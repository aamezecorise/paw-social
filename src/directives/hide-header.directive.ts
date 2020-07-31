import { IonContent, DomController } from '@ionic/angular';
import { Directive, ElementRef, Input, Renderer2,Renderer,SimpleChanges } from '@angular/core';

@Directive({
      // tslint:disable-next-line: directive-selector
      selector: '[scrollHide]',
      host : {
        '(ionScroll)': 'onContentScroll($event)'
      }
      })
export class ScrollHideDirective {

  @Input('scrollHide') config: ScrollHideConfig;
  // tslint:disable-next-line: no-input-rename
  @Input('scrollContent') scrollContent: IonContent;

  fabToHide;
  tabsToHide;
  oldScrollTop: number = 0;

  contentHeight: number;
  scrollHeight: number;
  lastScrollPosition: number;
  lastValue = 0;

  constructor(
    private element: ElementRef, 
    private renderer2: Renderer2, 
    private renderer: Renderer, 
    private domCtrl: DomController) {
    console.log('scroll directive');
  }

  ngOnInit(){
    this.fabToHide = this.element.nativeElement.querySelectorAll('ion-fab')[0];
    this.tabsToHide = this.element.nativeElement.querySelectorAll('ion-tab-bar')[0];
    console.log(this.fabToHide);
    console.log(this.tabsToHide);
  }

    onContentScroll(e){
      if(e.detail.scrollTop - this.oldScrollTop > 0 ){
        this.renderer.setElementStyle(this.fabToHide, "opacity", "0")
        this.renderer.setElementStyle(this.tabsToHide, "opacity", "0")
        this.renderer.setElementStyle(this.fabToHide, "webkitTransition", "opacity 500ms")
      }else if(e.detail.scrollTop - this.oldScrollTop < 0 ){
        this.renderer.setElementStyle(this.fabToHide, "opacity", "1")
        this.renderer.setElementStyle(this.tabsToHide, "opacity", "1")
      }
      this.oldScrollTop = e.detail.scrollTop;
  }

  // tslint:disable-next-line: use-lifecycle-interface
  ngOnChanges(changes: SimpleChanges) {
    if (this.scrollContent && this.config) {
      this.scrollContent.scrollEvents = true;

      const scrollStartFunc = async (ev) => {
        const el = await this.scrollContent.getScrollElement();
        this.contentHeight = el.offsetHeight;
        this.scrollHeight = el.scrollHeight;
        if (this.config.maxValue === undefined) {
          this.config.maxValue = this.element.nativeElement.offsetHeight;
        }
        this.lastScrollPosition = el.scrollTop;
      };

      if (this.scrollContent && this.scrollContent instanceof IonContent) {
        this.scrollContent.ionScrollStart.subscribe(scrollStartFunc);
        this.scrollContent.ionScroll.subscribe(async (ev) => this.adjustElementOnScroll(ev));
        this.scrollContent.ionScrollEnd.subscribe(async (ev) => this.adjustElementOnScroll(ev));

      } else if (this.scrollContent instanceof HTMLElement) {
        (this.scrollContent as HTMLElement).addEventListener('ionScrollStart', scrollStartFunc);
        (this.scrollContent as HTMLElement).addEventListener('ionScroll', async (ev) => this.adjustElementOnScroll(ev));
        (this.scrollContent as HTMLElement).addEventListener('ionScrollEnd', async (ev) => this.adjustElementOnScroll(ev));
      }
    }
  }

  private adjustElementOnScroll(ev) {
    if (ev) {
      this.domCtrl.write(async () => {
        const el = await this.scrollContent.getScrollElement();
        const scrollTop: number = el.scrollTop > 0 ? el.scrollTop : 0;
        const scrolldiff: number = scrollTop - this.lastScrollPosition;
        this.lastScrollPosition = scrollTop;
        let newValue = this.lastValue + scrolldiff;
        newValue = Math.max(0, Math.min(newValue, this.config.maxValue));
        this.renderer2.setStyle(this.element.nativeElement, this.config.cssProperty, `-${newValue}px`);
        this.lastValue = newValue;
      });
    }
  }
}

export interface ScrollHideConfig {
  cssProperty: string;
  maxValue: number;
}
