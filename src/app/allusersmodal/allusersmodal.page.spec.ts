import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllusersmodalPage } from './allusersmodal.page';

describe('AllusersmodalPage', () => {
  let component: AllusersmodalPage;
  let fixture: ComponentFixture<AllusersmodalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllusersmodalPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllusersmodalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
