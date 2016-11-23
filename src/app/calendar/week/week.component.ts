import { Component, OnInit, OnDestroy } from '@angular/core';
import { Calendar } from '../calendar';
import { HabitService } from '../../shared/habit.service';

@Component({
  selector: 'ht-week',
  templateUrl: './week.component.html',
  styleUrls: ['./week.component.css']
})
export class WeekComponent implements OnInit, OnDestroy {
  public calendar: Calendar;

  constructor(private habitService: HabitService) { }

  onFlipCalendar(changeBy: number) {
    this.habitService.flipCalendar(changeBy, 'week');
  }

  ngOnInit() {
    this.calendar = this.habitService.getCalendarWeek('daily javascript');
    this.habitService.calendarWeekChanged.subscribe(
      (calendar: Calendar) => this.calendar = calendar
    );

  }

  ngOnDestroy() {
    this.habitService.calendarWeekChanged.unsubscribe();
  }

}
