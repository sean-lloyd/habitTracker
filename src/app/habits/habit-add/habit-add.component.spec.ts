/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { HabitAddComponent } from './habit-add.component';

describe('HabitAddComponent', () => {
  let component: HabitAddComponent;
  let fixture: ComponentFixture<HabitAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HabitAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HabitAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
