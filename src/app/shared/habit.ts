import { Calendar } from '../calendar/calendar';

export interface Habit {
    name: string;
    description: string;
    date_added: string;
    month: Calendar;
    week: Calendar;
}
