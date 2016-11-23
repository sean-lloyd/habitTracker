import { Injectable, EventEmitter } from '@angular/core';
import { Calendar } from './calendar';

@Injectable()
export class CalendarService {
  public calendarMonth: Calendar;
  public calendarWeek: Calendar;
  private listMonths: Array<string> = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August',
    'September', 'October', 'November', 'December'];


  calendarMonthChanged = new EventEmitter<Calendar>();
  calendarWeekChanged = new EventEmitter<Calendar>();

  constructor() { }

  /*
      1. Determine base date (today or other)
      2. Determine start date: the first day of week & month before base date
      3. get the calendar days (either 1 week or 1 month) (using start date, num weeks)

  */
  setCalendar(date?: Date) {
    let baseDate: Date = date || new Date();
    let startDate = {
      week: new Date(),
      month: new Date()
    };

    let calendarWeek = new Calendar();
    let calendarMonth = new Calendar();

    // set calendar start dates
    baseDate = this.makeZeroHour(baseDate);
    startDate = this.getStartDate(baseDate);

    // get days in week calendar
    calendarWeek.days = this.getCalendarDays(startDate.week, 1);
    calendarWeek.period = this.mostlyMonth(calendarWeek.days);
    calendarWeek.title = this.listMonths[calendarWeek.period.month] + ' ' + calendarWeek.period.year; // 'September 2016'

    // get days in month calendar
    calendarMonth.days = this.getCalendarDays(startDate.month, 6);
    calendarMonth.period = this.mostlyMonth(calendarMonth.days);
    calendarMonth.title = this.listMonths[calendarMonth.period.month] + ' ' + calendarMonth.period.year;

    this.calendarWeek = calendarWeek;
    this.calendarMonth = calendarMonth;
    this.calendarMonthChanged.emit(this.calendarMonth);
    this.calendarWeekChanged.emit(this.calendarWeek);
  }

  // creates an array with the calendar dates
  private getCalendarDays(startDate: Date, numWeeks: number): Date[] {
    let a: Date[] = [];
    let date: Date;
    let numDays: number = numWeeks * 7;

    for (let i = 0; i < numDays; i++) {
      date = new Date(startDate);
      date.setDate(date.getDate() + i);
      a.push(date);
    }

    return a;
  }

  /* takes a base date and returns an object with two dates
      1. first Sunday before base date (weekly view)
      2. first Sunday before month's first day (monthly view)
  */
  private getStartDate(baseDate?: Date): { week: Date, month: Date } {
    let startDate = {
      week: new Date(),
      month: new Date()
    };

    if (baseDate) {
      startDate.week = baseDate;
      startDate.month = baseDate;
    }

    startDate.week = startDate.month = baseDate || new Date();
    startDate.week.setDate(baseDate.getDate() - baseDate.getDay()); // set to 1st Sunday
    startDate.week = this.makeZeroHour(startDate.week);

    startDate.month.setDate(baseDate.getDate() - (baseDate.getDate() - 1)); // set to 1st day of month
    startDate.month.setDate(startDate.month.getDate() - startDate.month.getDay()); // set to 1st Sunday before
    startDate.month = this.makeZeroHour(startDate.month);

    return startDate;
  }

  // zeroes out time in date to make it easier to matches dates later. The times does not matter in this app.
  private makeZeroHour(date: Date): Date {
    let year = date.getFullYear();
    let month = date.getMonth();
    let day = date.getDate();

    return new Date(year, month, day, 0, 0, 0, 0); // new Date(year, month, day, hours, minutes, seconds, milliseconds)
  }

  // takes in an array and returns an array of objects with the predominant month & year (YYYY-M)
  private mostlyMonth(array: Date[]): { month: string, year: string } {
    let periods: Array<any>;
    let period: string;
    let result: { month: string, year: string } = {
      month: '',
      year: ''
    };

    // create new array of months YYYY-MM
    periods = array.map(date => date.getFullYear() + '-' + date.getMonth());

    // sort the array by the number of occurrences of each month (least to most)
    periods.sort(function (a, b) {
      return periods.filter(x => x === a).length - periods.filter(x => x === b).length;
    });

    // return the month with the most occurrences
    period = periods.pop();
    result.month = period.substring(5, period.length);
    result.year = period.substring(0, 4);

    return result;
  }

}
