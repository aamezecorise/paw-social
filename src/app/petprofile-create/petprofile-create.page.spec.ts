import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PetprofileCreatePage } from './petprofile-create.page';

describe('PetprofileCreatePage', () => {
  let component: PetprofileCreatePage;
  let fixture: ComponentFixture<PetprofileCreatePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PetprofileCreatePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PetprofileCreatePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
