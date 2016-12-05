/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { HabitEditComponent } from './habit-edit.component';

describe('HabitEditComponent', () => {
  let component: HabitEditComponent;
  let fixture: ComponentFixture<HabitEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HabitEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HabitEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
