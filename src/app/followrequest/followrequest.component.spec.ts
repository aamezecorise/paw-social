import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FollowrequestComponent } from './followrequest.component';

describe('FollowrequestComponent', () => {
  let component: FollowrequestComponent;
  let fixture: ComponentFixture<FollowrequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FollowrequestComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FollowrequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
