import { Component, OnInit, OnDestroy } from '@angular/core';
import { CalendarService } from '../calendar.service';
import { Calendar } from '../calendar';

@Component({
  selector: 'ht-month',
  templateUrl: './month.component.html',
  styleUrls: ['./month.component.css']
})
export class MonthComponent implements OnInit, OnDestroy {
  public calendar: Calendar;

  constructor(private calendarService: CalendarService) { }

  ngOnInit() {
    this.calendarService.setCalendar();
    this.calendarService.calendarMonthChanged.subscribe(
      (calendar: Calendar) => { this.calendar = calendar; }
    );

  }

  ngOnDestroy() {
    this.calendarService.calendarMonthChanged.unsubscribe();
  }

}
