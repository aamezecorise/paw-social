import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PetprofilePage } from './petprofile.page';

describe('PetprofilePage', () => {
  let component: PetprofilePage;
  let fixture: ComponentFixture<PetprofilePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PetprofilePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PetprofilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
