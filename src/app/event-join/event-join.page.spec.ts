import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventJoinPage } from './event-join.page';

describe('EventJoinPage', () => {
  let component: EventJoinPage;
  let fixture: ComponentFixture<EventJoinPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventJoinPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventJoinPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
