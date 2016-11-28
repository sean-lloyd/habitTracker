import { Component, OnInit, OnDestroy } from '@angular/core';

import { Habit } from '../../shared/habit';
import { Calendar } from '../calendar';
import { HabitService } from '../../shared/habit.service';

@Component({
  selector: 'ht-month',
  templateUrl: './month.component.html',
  styleUrls: ['./month.component.css']
})
export class MonthComponent implements OnInit, OnDestroy {
  public calendar: Calendar;
  selectedHabit: Habit;

  constructor(private habitService: HabitService) { }

  onFlipCalendar(changeBy: number) {
    this.habitService.flipCalendar(this.selectedHabit, changeBy, 'month');
  }

  ngOnInit() {
    this.selectedHabit = this.habitService.getSelectedHabit();
    this.calendar = new Calendar();

    this.habitService.calendarMonthChanged.subscribe(
      (calendar: Calendar) => {
        this.calendar = calendar;
        this.selectedHabit = this.habitService.getSelectedHabit();
      }
    );
  }

  ngOnDestroy() {
    this.habitService.calendarMonthChanged.unsubscribe();
  }

}
