/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { HabitService } from './habit.service';

describe('Service: Habit', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HabitService]
    });
  });

  it('should ...', inject([HabitService], (service: HabitService) => {
    expect(service).toBeTruthy();
  }));
});
