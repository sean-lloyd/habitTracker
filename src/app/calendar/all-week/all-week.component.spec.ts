/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { AllWeekComponent } from './all-week.component';

describe('AllWeekComponent', () => {
  let component: AllWeekComponent;
  let fixture: ComponentFixture<AllWeekComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllWeekComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllWeekComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
