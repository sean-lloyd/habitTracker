import { Component, OnInit, OnDestroy } from '@angular/core';
import { CalendarService } from '../calendar.service';
import { Calendar } from '../calendar';

@Component({
  selector: 'ht-week',
  templateUrl: './week.component.html',
  styleUrls: ['./week.component.css']
})
export class WeekComponent implements OnInit, OnDestroy {
  public calendar: Calendar;

  constructor(private calendarService: CalendarService) { }

  ngOnInit() {
    this.calendarService.setCalendar();
    this.calendarService.calendarWeekChanged.subscribe(
      (calendar: Calendar) => this.calendar = calendar
    );
  }

  ngOnDestroy() {
    this.calendarService.calendarWeekChanged.unsubscribe();
  }

}
