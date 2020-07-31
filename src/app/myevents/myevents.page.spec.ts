import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyeventsPage } from './myevents.page';

describe('MyeventsPage', () => {
  let component: MyeventsPage;
  let fixture: ComponentFixture<MyeventsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyeventsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyeventsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
