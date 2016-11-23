import { Component, OnInit, OnDestroy } from '@angular/core';
import { Calendar } from '../calendar';
import { HabitService } from '../../shared/habit.service';

@Component({
  selector: 'ht-month',
  templateUrl: './month.component.html',
  styleUrls: ['./month.component.css']
})
export class MonthComponent implements OnInit, OnDestroy {
  public calendar: Calendar;

  constructor(private habitservice: HabitService) { }

  onFlipCalendar(changeBy: number) {
    this.habitservice.flipCalendar(changeBy, 'month');
  }

  ngOnInit() {
    this.calendar = this.habitservice.getCalendarMonth('daily javascript');
    this.habitservice.calendarMonthChanged.subscribe(
      (calendar: Calendar) => this.calendar = calendar
    );

  }

  ngOnDestroy() {
    this.habitservice.calendarMonthChanged.unsubscribe();
  }

}
