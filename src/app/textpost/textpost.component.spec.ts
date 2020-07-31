import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TextpostComponent } from './textpost.component';

describe('TextpostComponent', () => {
  let component: TextpostComponent;
  let fixture: ComponentFixture<TextpostComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TextpostComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TextpostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
