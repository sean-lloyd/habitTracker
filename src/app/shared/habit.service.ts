import { Injectable, EventEmitter } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Subscription } from 'rxjs/Rx';
import 'rxjs/Rx'; // needed for .map() method to work on http.get();

import { Calendar } from '../calendar/calendar';
import { Habit } from './habit';
import { HabitDetail } from './habit-detail';

import { CalendarService } from '../calendar/calendar.service';

@Injectable()
export class HabitService {
  private calendarMonth: Calendar;
  private calendarWeek: Calendar;
  currentView: string = 'month';
  currentViewChanged = new EventEmitter<string>();
  private detailsUrl: string = 'app/details';
  private fetchHabitSubscription: Subscription;
  private fetchDetailsSubscription: Subscription;
  habits: Habit[]; // the main habits array (habits, details, calendar)
  habitsChanged = new EventEmitter<Habit[]>(); // notifies the main habits array updated
  private habitList: Habit[]; // from database
  private habitListChanged = new EventEmitter<Habit[]>(); // when list of habits changes
  private habitDetails: HabitDetail[]; // from database
  private habitDetailsChanged = new EventEmitter<any>(); // when habit details changes
  private habitsUrl: string = 'app/habits';
  selectedHabit: Habit;

  private extractData(res: Response) {
    let body = res.json();
    return body.data || {};
  }

  constructor(private http: Http, private calendarService: CalendarService) { }

  // Builds a master compilation of habits, details, and calendars.
  // Can query later without making database calls every time.
  private buildHabitsCalendars() {
    this.habits = [];
    // get calendar data
    this.calendarMonth = this.calendarService.getCalendarMonth();
    this.calendarWeek = this.calendarService.getCalendarWeek();

    // merge Habit and HabitDetail and Calendar and push to habits array
    this.habitList.forEach(
      (habit) => {
        let month: Calendar = this.mergeHabitDetailsWithCalendar(this.calendarMonth, habit.name);
        let week: Calendar = this.mergeHabitDetailsWithCalendar(this.calendarWeek, habit.name);

        // need to copy the Object to avoide closure scope issues
        habit.month = this.copyObject(month);
        habit.week = this.copyObject(week);

        this.habits.push(habit);
      }
    );

    this.habitsChanged.emit(this.habits);

  }

  changeCurrentView(view: string) {
    this.currentView = view;
    this.currentViewChanged.emit(this.currentView);
  }

  private copyObject(obj: any) {
    /** JSON methods are solution to reference issue
     * JavaScript makes reference when setting a varibale equal to an array
     * causing the final update to supplant the previous updates
     * The JSON methods make deep copies, breaking the reference
     */
    return JSON.parse(JSON.stringify(obj));
  }

  // fetch all data and emit notifications when data arrives and kickoff buildHabitsCalendars()
  private fetchData(habitName?: string) {
    // establish observable subscriptions of EventEmitters before initiating the fetching
    // first fecth Habits, then fetch Details
    // unsubscribe to avoid memory leaks
    this.fetchHabitSubscription = this.habitListChanged.subscribe(
      () => this.fetchDetails()
    );
    this.fetchDetailsSubscription = this.habitDetailsChanged.subscribe(
      () => {
        this.buildHabitsCalendars();
        this.unSubscribe();
      }
    );

    this.fetchHabits();
  }

  // fetch the habit details from the server
  private fetchDetails() {
    this.http.get(this.detailsUrl)
      .map(this.extractData)
      .subscribe((data: HabitDetail[]) => {
        this.habitDetails = data;
        this.habitDetailsChanged.emit(this.habitDetails);
      }, error => console.log(error)
      );
  }

  // fetch list of habits from database
  private fetchHabits() {
    return this.http.get(this.habitsUrl)
      .map(this.extractData)
      .subscribe(
      (data: Habit[]) => {
        this.habitList = data;
        this.habitListChanged.emit(this.habits);
      },
      error => console.log(error)
      );
  }

  // reacts to flipping the calendar forward/backward by a week or month
  flipCalendar(changeBy: number, view: string) {
    if (view === 'month') {
      this.calendarService.flipCalendarMonth(changeBy, view);
    } else if (view === 'week') {
      this.calendarService.flipCalendarWeek(changeBy, view);
    }

    this.buildHabitsCalendars();
  }

  getHabitData() {
    if (!this.habits) {
      this.fetchData();
    }
    return this.habits;
  }

  getHabitByID(id: string): Habit {
    if (this.habits) {
      this.selectedHabit = this.habits[id];
    } else {
      this.fetchData();
    }
    return this.selectedHabit;
  }

  private mergeHabitDetailsWithCalendar(calendar: Calendar, habitName: string): Calendar {
    let habits = this.copyObject(this.habitDetails);
    let currentMonth: string = calendar.period.year + calendar.period.month;

    // fix date formate from mySQL database to match calendar format
    habits.map(
      (habit) => {
        habit.date = new Date(habit.date);
        habit.date.setDate(habit.date.getDate() + 1);
        habit.date = makeZeroHour(habit.date);
        return habit;
      }
    );

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

  private unSubscribe() {
    if (this.fetchHabitSubscription) { this.fetchHabitSubscription.unsubscribe(); }
    if (this.fetchDetailsSubscription) { this.fetchDetailsSubscription.unsubscribe(); }
  }

}
