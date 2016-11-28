import { Injectable, EventEmitter } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/Rx'; // needed for .map() method to work on http.get();

import { Calendar } from '../calendar/calendar';
import { Habit } from './habit';
import { HabitDetail } from './habit-detail';

import { CalendarService } from '../calendar/calendar.service';

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
  private habitDetailsCache: HabitDetail[];
  private habitsUrl: string = 'app/habits';
  private detailsUrl: string = 'app/details';
  private selectedHabit: Habit;

  private extractData(res: Response) {
    let body = res.json();
    return body.data || {};
  }

  constructor(private http: Http, private calendarService: CalendarService) { }

  // fetch the habit ddetails from the server and combine that data with full calendar data
  private fetchDetails(habitName: string) {

    if (this.habitDetailsCache) {
      this.calendarMonthDetail = this.mergeHabitsWithCalendar(this.habitDetailsCache, this.calendarMonth, habitName);
      this.calendarMonthChanged.emit(this.calendarMonthDetail);

      this.calendarWeekDetail = this.mergeHabitsWithCalendar(this.habitDetailsCache, this.calendarWeek, habitName);
      this.calendarWeekChanged.emit(this.calendarWeekDetail);

    } else {
      this.http.get(this.detailsUrl)
        .map(this.extractData)
        .subscribe((data: HabitDetail[]) => {
          this.habitDetailsCache = data;
          this.calendarMonthDetail = this.mergeHabitsWithCalendar(data, this.calendarMonth, habitName);
          this.calendarMonthChanged.emit(this.calendarMonthDetail);

          this.calendarWeekDetail = this.mergeHabitsWithCalendar(data, this.calendarWeek, habitName);
          this.calendarWeekChanged.emit(this.calendarWeekDetail);

        }, error => console.log(error)
        );
    }
  }

  // fetch list of habits from database
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
  flipCalendar(habit: Habit, changeBy: number, view: string) {
    if (view === 'month') {
      this.calendarService.flipCalendarMonth(changeBy, view);
    } else if (view === 'week') {
      this.calendarService.flipCalendarWeek(changeBy, view);
    }

    this.calendarMonth = this.calendarService.getCalendarMonth();
    this.calendarWeek = this.calendarService.getCalendarWeek();

    this.fetchDetails(habit.name);
  }

  getHabits() {
    this.fetchHabits();
    return this.habits;
  }

  getCalendars(habit: Habit) {
    this.calendarMonth = this.calendarService.getCalendarMonth();
    this.calendarWeek = this.calendarService.getCalendarWeek();
    this.fetchDetails(habit.name);
  }

  getSelectedHabit(): Habit {
    // !TODO REMOVE later when default selected habit is sorted out
    if (!this.selectedHabit) {
      this.selectedHabit = {
        'name': 'daily javascript',
        'description': 'practice makes perfect!',
        'date_added': '2016-09-02'
      };
    }
    //

    return this.selectedHabit;
  }

  setSelectedHabit(habit) {
    this.selectedHabit = habit;
    this.getCalendars(habit);
  }

  private mergeHabitsWithCalendar(habits: HabitDetail[], calendar: Calendar, habitName: string): Calendar {
    let currentMonth: string = calendar.period.year + calendar.period.month;

    calendar.days = calendar.days.map(mergeData);

    return calendar;

    function mergeData(dt): HabitDetail {
      let css_class = 'habit-day';
      dt.hasOwnProperty('date') ? dt = new Date(dt.date) : dt = new Date(dt);
      let evalMonth = dt.getFullYear() + '' + dt.getMonth();
      let status = '';

      if (evalMonth !== currentMonth) {
        css_class = 'habit-day-inactive';
      } else {

        for (let habit of habits) {
          habit.date = new Date(habit.date);
          habit.date = makeZeroHour(habit.date);

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

    // zeroes out time in date to make it easier to matches dates later. The times does not matter in this app.
    function makeZeroHour(date: Date): Date {
      let year = date.getFullYear();
      let month = date.getMonth();
      let day = date.getDate();

      return new Date(year, month, day, 0, 0, 0, 0); // new Date(year, month, day, hours, minutes, seconds, milliseconds)
    }

  }


}
