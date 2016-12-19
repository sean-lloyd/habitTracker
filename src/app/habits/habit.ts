import { Calendar } from '../calendar/calendar';

export class Habit {
  $key?: string;
  name: string;
  description: string;
  date_added: string;
  log: HabitDetail[];
}

export interface HabitDetail {
    date: string;
    status: string;
    css_class?: string;
}

export interface HabitNew {
  name: string;
  description: string;
  date_added?: string;
}

export class HabitCalendar {
  $key?: any;
  name: string;
  description: string;
  date_added: string;
  month: Calendar;
  week: Calendar;

  constructor() {
    this.name = '';
    this.description = '';
    this.date_added = '';
    this.month = new Calendar();
    this.week = new Calendar();
  }
}
