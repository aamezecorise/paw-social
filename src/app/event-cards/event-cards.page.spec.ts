import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventCardsPage } from './event-cards.page';

describe('EventCardsPage', () => {
  let component: EventCardsPage;
  let fixture: ComponentFixture<EventCardsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventCardsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventCardsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
