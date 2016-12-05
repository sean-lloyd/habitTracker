import { HabitDetail } from './habit-detail';

export class Habit {
  $key?: string;
  name: string;
  description: string;
  date_added: string;
  log: HabitDetail[];
}
