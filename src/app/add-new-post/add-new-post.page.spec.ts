import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewPostPage } from './add-new-post.page';

describe('AddNewPostPage', () => {
  let component: AddNewPostPage;
  let fixture: ComponentFixture<AddNewPostPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddNewPostPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNewPostPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
