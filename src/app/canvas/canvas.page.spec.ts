import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CanvasPage } from './canvas.page';

describe('CanvasPage', () => {
  let component: CanvasPage;
  let fixture: ComponentFixture<CanvasPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CanvasPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CanvasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
