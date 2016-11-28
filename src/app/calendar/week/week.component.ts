import { Component, OnInit, OnDestroy } from '@angular/core';

import { Calendar } from '../calendar';
import { Habit } from '../../shared/habit';
import { HabitService } from '../../shared/habit.service';

@Component({
  selector: 'ht-week',
  templateUrl: './week.component.html',
  styleUrls: ['./week.component.css']
})
export class WeekComponent implements OnInit, OnDestroy {
  public calendar: Calendar;
  selectedHabit: Habit;

  constructor(private habitService: HabitService) { }

  onFlipCalendar(changeBy: number) {
    this.habitService.flipCalendar(this.selectedHabit, changeBy, 'week');
  }

  ngOnInit() {
    this.selectedHabit = this.habitService.getSelectedHabit();
    this.calendar = new Calendar();
    
    this.habitService.calendarWeekChanged.subscribe(
      (calendar: Calendar) => {
        this.calendar = calendar;
        this.selectedHabit = this.habitService.getSelectedHabit();
      }
    );
  }

  ngOnDestroy() {
    this.habitService.calendarWeekChanged.unsubscribe();
  }

}
