import { Injectable, EventEmitter } from '@angular/core';
import { Http, Response } from '@angular/http';

import { Habit } from './habit';
import { HabitDetail } from './habit-detail';
import 'rxjs/Rx'; // needed for .map() method to work on http.get();


@Injectable()
export class HabitService {
  habitChanged = new EventEmitter<Habit[]>(); // !TODO add typing (add HABITS class)
  habitDetailChanged = new EventEmitter<HabitDetail[]>(); // !TODO add typing (add HABITS class)
  private habits: Habit[] = []; // !TODO add typing (add HABITS class)
  private details: HabitDetail[]; // !TODO add typing (add HABIT DETAILS class)
  private habitsUrl: string = 'app/habits';
  private detailsUrl: string = 'app/details';

  private extractData(res: Response) {
    let body = res.json();
    return body.data || {};
  }

  constructor(private http: Http) { }

  fetchDetails() {
    return this.http.get(this.detailsUrl)
      // .map((response: Response) => response.json())
      .map(this.extractData)
      .subscribe(
        (data: HabitDetail[]) => {
          this.details = data;
          this.habitDetailChanged.emit(this.details);
        },
      error => console.log(error)
      );
  }

  fetchHabits() {
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

  getHabits() {
    return this.habits;
  }

  getHabitDetails() {
    return this.details;
  }

}
