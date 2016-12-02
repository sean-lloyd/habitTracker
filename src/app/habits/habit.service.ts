import { Injectable, EventEmitter } from '@angular/core';
// import { Subscription } from 'rxjs/Rx';
import 'rxjs/Rx'; // needed for .map() method to work on http.get();

import { AngularFire, FirebaseListObservable } from 'angularfire2';

import { Calendar } from '../calendar/calendar';
import { Habit } from './habit';
import { HabitCalendar } from './habit-calendar';
import { HabitDetail } from './habit-detail';

import { CalendarService } from '../calendar/calendar.service';

@Injectable()
export class HabitService {
  private calendarMonth: Calendar;
  private calendarWeek: Calendar;
  currentView: string = 'month';
  currentViewChanged = new EventEmitter<string>();
  habits: HabitCalendar[]; // the main habits array (habits + calendar)
  private habitsDbCache: Habit[];
  private habitsDb: FirebaseListObservable<Habit[]>; // the original habits array pulled from database
  habitsChanged = new EventEmitter<HabitCalendar[]>(); // notifies the main habits array updated
  selectedHabit: HabitCalendar;

  constructor(private calendarService: CalendarService, private af: AngularFire) { }

  changeCurrentView(view: string) {
    this.currentView = view;
    this.currentViewChanged.emit(this.currentView);
  }

  // Builds a master compilation of habits, details, and calendars.
  // Can query later without making database calls every time.
  private buildHabitsCalendars(habitsDb: any): HabitCalendar[] {
    let habitsCalendarResult: HabitCalendar[] = [];
    let habits = this.copyObject(habitsDb);

    // get calendar data
    this.calendarMonth = this.calendarService.getCalendarMonth();
    this.calendarWeek = this.calendarService.getCalendarWeek();

    // merge Habit and habitsDb and Calendar and push to habits array
    habits.forEach(
      (habit) => {
        let month: Calendar = this.mergeHabitWithCalendar(this.calendarMonth, habit.log);
        let week: Calendar = this.mergeHabitWithCalendar(this.calendarWeek, habit.log);

        // need to copy the Object to avoid reference issues
        habit.month = this.copyObject(month);
        habit.week = this.copyObject(week);

        habitsCalendarResult.push(habit);
      }
    );

    return habitsCalendarResult;
  }
  // deep copy objects & arrays to break the reference
  private copyObject(obj: any) {
    /** JSON methods are solution to reference issue
     * JavaScript makes reference when setting a varibale equal to an array
     * causing the final update to supplant the previous updates
     * The JSON methods make deep copies, breaking the reference
     */
    return JSON.parse(JSON.stringify(obj));
  }

  // fetch all data and emit notifications when data arrives and kickoff buildHabitsCalendars()
  private fetchData() {
    this.habitsDb = this.af.database.list('/habits');
    this.habitsDb.subscribe(
      (data: Habit[]) => {
        this.habitsDbCache = data;
        this.habits = [];
        this.habits = this.buildHabitsCalendars(this.habitsDbCache);
        this.habitsChanged.emit(this.habits);
      }
    );
  }

  // reacts to flipping the calendar forward/backward by a week or month
  flipCalendar(changeBy: number, view: string) {
    if (view === 'month') {
      this.calendarService.flipCalendarMonth(changeBy, view);
    } else if (view === 'week') {
      this.calendarService.flipCalendarWeek(changeBy, view);
    }
    this.habits = [];
    this.habits = this.buildHabitsCalendars(this.habitsDbCache);
    this.habitsChanged.emit(this.habits);
  }

  getHabitData() {
    if (!this.habits) {
      this.fetchData();
    }
    return this.habits;
  }

  getHabitByID(id: any): HabitCalendar {
    if (this.habits) {
      this.selectedHabit = this.habits.find(
        (record) => record.$key === id
      );
    } else {
      this.fetchData();
    }
    return this.selectedHabit;
  }

  private mergeHabitWithCalendar(cal: Calendar, log: HabitDetail[]): Calendar {
    let details: HabitDetail[] = this.copyObject(log);
    let calendar: Calendar = this.copyObject(cal);
    let currentMonth: string = calendar.period.year + calendar.period.month;

    details.map(
      (habit) => {
        habit.date = new Date(habit.date);
        habit.date = makeZeroHour(habit.date);
      }
    );

    calendar.days = calendar.days.map(mergeData);

    return calendar;

    function mergeData(dt): HabitDetail {
      let css_class = 'habit-day';
      dt.hasOwnProperty('date') ? dt = new Date(dt.date) : dt = new Date(dt);
      let evalMonth = dt.getFullYear() + '' + dt.getMonth();
      let status = '';

      if (evalMonth !== currentMonth && calendar.days.length > 7) {
        css_class = 'habit-day-inactive';
      } else {

        for (let detail of details) {

          if (dt.getTime() === detail.date.getTime()) {
            status = detail.status;

            switch (detail.status) {
              case 'false':
                css_class = 'failure';
                break;
              case 'true':
                css_class = 'success';
                break;
              default:
                break;
            }
          }
        }
      }

      return {
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
