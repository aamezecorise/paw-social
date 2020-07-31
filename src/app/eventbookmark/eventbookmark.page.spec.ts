import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventbookmarkPage } from './eventbookmark.page';

describe('EventbookmarkPage', () => {
  let component: EventbookmarkPage;
  let fixture: ComponentFixture<EventbookmarkPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventbookmarkPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventbookmarkPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
