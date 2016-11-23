import { Injectable, EventEmitter } from '@angular/core';
import { Http, Response } from '@angular/http';

import { Habit } from './habit';
import { HabitDetail } from './habit-detail';
import { CalendarService } from '../calendar/calendar.service';
import { Calendar } from '../calendar/calendar';
import 'rxjs/Rx'; // needed for .map() method to work on http.get();


@Injectable()
export class HabitService {
  habitChanged = new EventEmitter<Habit[]>();
  calendarWeekChanged = new EventEmitter<HabitDetail[]>();
  calendarMonthChanged = new EventEmitter<HabitDetail[]>();
  private calendarMonth: Calendar;
  private calendarWeek: Calendar;
  private calendarMonthDetail: any;
  private calendarWeekDetail: any;
  private habits: Habit[] = [];
  private habitsUrl: string = 'app/habits';
  private detailsUrl: string = 'app/details';

  private extractData(res: Response) {
    let body = res.json();
    return body.data || {};
  }

  constructor(private http: Http, private calendarService: CalendarService) { }

  private fetchDetails(habitName: string, calendarView: string) {
    return this.http.get(this.detailsUrl)
      .map(this.extractData)
      .subscribe((data: HabitDetail[]) => {
        let calendar: Calendar;
        let calendarDetail: any;
        (calendarView === 'month') ? calendar = this.calendarMonth : calendar = this.calendarWeek;
        calendarDetail = this.mergeHabitsWithCalendar(data, calendar, habitName);

        if (calendarView === 'month') {
          this.calendarMonthDetail = calendarDetail;
          this.calendarMonthChanged.emit(this.calendarMonthDetail);
        } else {
          this.calendarWeekDetail = calendarDetail;
          this.calendarWeekChanged.emit(this.calendarWeekDetail);
        }
      }, error => console.log(error)
      );
  }

  private fetchHabits() {
    return this.http.get(this.habitsUrl)
      .map(this.extractData)
      .subscribe(
      (data: Habit[]) => {
        this.habits = data;
        this.habitChanged.emit(this.habits);
      },
      error => console.log(error)
      );
  }

  // reacts to flipping the calendar forward/backward by a week or month
  flipCalendar(changeBy: number, view: string) {
    this.calendarService.flipCalendar(changeBy, view);
  }

  getHabits() {
    this.fetchHabits();
    return this.habits;
  }

  getCalendarMonth(habitName: string) {
    this.calendarMonth = this.calendarService.getCalendarMonth();
    this.fetchDetails(habitName, 'month');
    return this.calendarMonth;
  }

  getCalendarWeek(habitName: string) {
    this.calendarWeek = this.calendarService.getCalendarWeek();
    this.fetchDetails(habitName, 'week');
    return this.calendarWeek;
  }

  private mergeHabitsWithCalendar(habits: HabitDetail[], calendar: Calendar, habitName: string) {
    let currentMonth: string = calendar.period.year + calendar.period.month;

    calendar.days = calendar.days.map(mergeData);

    return calendar;

    function mergeData(dt: Date): HabitDetail {
      let css_class = 'habit-day';
      dt = new Date(dt);
      let evalMonth = dt.getFullYear() + '' + dt.getMonth();
      let status = '';

      if (evalMonth !== currentMonth) {
        css_class = 'habit-day-inactive';
      } else {

        for (let habit of habits) {
          if (habit.name === habitName && dt.getTime() === habit.date.getTime()) {
            status = habit.status;

            switch (habit.status) {
              case '0':
                css_class = 'failure';
                break;
              case '1':
                css_class = 'success';
                break;
              default:
                break;
            }
          }
        }
      }

      return {
        name: habitName,
        date: dt,
        status: status,
        css_class: css_class
      };
    }
  }

}
