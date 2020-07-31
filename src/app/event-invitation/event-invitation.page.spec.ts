import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventInvitationPage } from './event-invitation.page';

describe('EventInvitationPage', () => {
  let component: EventInvitationPage;
  let fixture: ComponentFixture<EventInvitationPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventInvitationPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventInvitationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
