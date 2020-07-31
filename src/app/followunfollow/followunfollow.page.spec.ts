import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FollowunfollowPage } from './followunfollow.page';

describe('FollowunfollowPage', () => {
  let component: FollowunfollowPage;
  let fixture: ComponentFixture<FollowunfollowPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FollowunfollowPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FollowunfollowPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
