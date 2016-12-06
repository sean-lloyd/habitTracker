import { Injectable, EventEmitter } from '@angular/core';
import { Http } from '@angular/http';
// import { Subscription } from 'rxjs/Rx';
import 'rxjs/Rx'; // needed for .map() method to work on http.get();

import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';

import { Calendar } from '../calendar/calendar';
import { Habit, HabitDetail, HabitNew, HabitCalendar } from './habit';

import { CalendarService } from '../calendar/calendar.service';

@Injectable()
export class HabitService {
  add: boolean = false; // for edit-component to determine which mode
  edit: boolean = false; // for edit-component to determine which mode
  private calendarMonth: Calendar;
  private calendarWeek: Calendar;
  currentView: string = 'month';
  currentViewChanged = new EventEmitter<string>();
  private habits: HabitCalendar[]; // the main habits array (habits + calendar)
  private habitsDbCache: Habit[];
  private habitsDb: FirebaseListObservable<Habit[]>; // the original habits array pulled from database
  habitsChanged = new EventEmitter<HabitCalendar[]>(); // notifies the main habits array updated
  selectedHabit: HabitCalendar;

  constructor(private calendarService: CalendarService, private af: AngularFire, private http: Http) { }

  addHabit(habit: HabitNew) {
    let path = `/habits/${habit.name.split(' ').join('-')}`;
    let habitList: FirebaseObjectObservable<HabitDetail[]> = this.af.database.object(path);
    let date = new Date;
    habit.date_added = this.makeZeroHour(date).toISOString();

    habitList.set(habit);
  }

  clearLogHistory(habitId: string) {
    let path = `/habits/${habitId}/log`;
    let log: FirebaseObjectObservable<Habit> = this.af.database.object(path);
    log.remove();
  }

  deleteHabit(habitId: string) {
    let path = `/habits/${habitId}`;
    let habit: FirebaseObjectObservable<Habit> = this.af.database.object(path);
    habit.remove();
  }

  editHabit(oldHabit: HabitCalendar, newHabit: HabitNew) {
    let oldPath = `/habits/${oldHabit.$key}`;
    let newPath = `/habits/${newHabit.name.split(' ').join('-')}`;
    let habit: FirebaseObjectObservable<Habit> = this.af.database.object(oldPath);
    let habitNew: FirebaseObjectObservable<Habit> = this.af.database.object(newPath);

    if (oldHabit.name === newHabit.name) {
      // update exsting habit
      habit.update({
        name: newHabit.name,
        description: newHabit.description
      });
    } else {
      oldHabit.name = newHabit.name;
      oldHabit.description = newHabit.description;
      delete oldHabit.$key;
      delete oldHabit.month;
      delete oldHabit.week;
      // remove old the old habit/name/key with the new habit (retaining old data);
      habit.remove();
      habitNew.set(oldHabit);
    }
  }

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

  getHabitDbCacheById(id: string): Habit {
    let habit: Habit;

    if (this.habitsDbCache) {
      habit = this.habitsDbCache.find(
        record => record.$key === id
      );
    } else {
      this.fetchData();
    }

    return habit;
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

  getHabitIdList(): Array<any> {
    return this.habitsDbCache.map(habit => habit.name);
  }

  logDay(habitId: string, day) {
    let date: string = new Date(day.date).toISOString();
    let logId: string = date.slice(0, 10);
    let logEntry: HabitDetail = {
      date: date,
      status: day.status
    };
    // Firebase declarations
    let path = `/habits/${habitId}/log/${logId}`;
    let logDbObj: FirebaseObjectObservable<HabitDetail>;
    logDbObj = this.af.database.object(path);

    if (day.status === 'blank') {
      logDbObj.remove();
    } else {
      logDbObj.update(logEntry);
    }

  }

  // zeroes out time in date to make it easier to matches dates later. The times does not matter in this app.
  private makeZeroHour(date: Date): Date {
    let year = date.getFullYear();
    let month = date.getMonth();
    let day = date.getDate();

    return new Date(year, month, day, 0, 0, 0, 0); // new Date(year, month, day, hours, minutes, seconds, milliseconds)
  }

  private mergeHabitWithCalendar(cal: Calendar, log: HabitDetail[]): Calendar {
    let details: HabitDetail[] = this.objectToArray(log);
    let calendar: Calendar = this.copyObject(cal);
    let currentMonth: string = calendar.period.year + calendar.period.month;

    details.map(
      (habit) => {
        habit.date = new Date(habit.date);
        habit.date = this.makeZeroHour(habit.date);
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

  }

  private objectToArray(obj: any) {
    if (obj) {
      return Object.keys(obj).map((k) => obj[k]);
    } else {
      return [];
    }
  }
}
