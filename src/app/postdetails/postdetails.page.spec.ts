import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostdetailsPage } from './postdetails.page';

describe('PostdetailsPage', () => {
  let component: PostdetailsPage;
  let fixture: ComponentFixture<PostdetailsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostdetailsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostdetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
