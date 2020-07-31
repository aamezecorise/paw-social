import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventPreviewPage } from './event-preview.page';

describe('EventPreviewPage', () => {
  let component: EventPreviewPage;
  let fixture: ComponentFixture<EventPreviewPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventPreviewPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventPreviewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
