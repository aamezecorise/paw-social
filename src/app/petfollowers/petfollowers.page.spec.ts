import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PetfollowersPage } from './petfollowers.page';

describe('PetfollowersPage', () => {
  let component: PetfollowersPage;
  let fixture: ComponentFixture<PetfollowersPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PetfollowersPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PetfollowersPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
