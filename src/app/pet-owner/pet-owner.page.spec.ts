import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PetOwnerPage } from './pet-owner.page';

describe('PetOwnerPage', () => {
  let component: PetOwnerPage;
  let fixture: ComponentFixture<PetOwnerPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PetOwnerPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PetOwnerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
