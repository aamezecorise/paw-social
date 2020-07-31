import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventcommentsPage } from './eventcomments.page';

describe('EventcommentsPage', () => {
  let component: EventcommentsPage;
  let fixture: ComponentFixture<EventcommentsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventcommentsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventcommentsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
