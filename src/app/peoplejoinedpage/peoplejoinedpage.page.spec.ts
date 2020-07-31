import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PeoplejoinedpagePage } from './peoplejoinedpage.page';

describe('PeoplejoinedpagePage', () => {
  let component: PeoplejoinedpagePage;
  let fixture: ComponentFixture<PeoplejoinedpagePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PeoplejoinedpagePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PeoplejoinedpagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
