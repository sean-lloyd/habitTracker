import { Calendar } from '../calendar/calendar';

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
