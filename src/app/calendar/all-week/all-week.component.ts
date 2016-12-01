import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Rx';

import { HabitService } from '../../shared/habit.service';
import { Habit } from '../../shared/habit';

@Component({
  selector: 'ht-all-week',
  templateUrl: './all-week.component.html',
  styleUrls: ['./all-week.component.css']
})
export class AllWeekComponent implements OnInit, OnDestroy {
  currentView: string;
  calendarTitle: string;
  habits: Habit[] = [];
  private habitChangedSubscription: Subscription;

  constructor(private habitService: HabitService) { }

  ngOnInit() {
    this.habits = this.habitService.getHabitData();
    if (this.habits) {
      this.calendarTitle = this.habits[0].week.title;
    }

    this.habitChangedSubscription = this.habitService.habitsChanged.subscribe(
      (habits: Habit[]) => {
        this.habits = habits;
        this.calendarTitle = this.habits[0].week.title;
      }
    );
  }

  onFlipCalendar(changeBy: number) {
    this.habitService.flipCalendar(changeBy, 'week');
  }

  ngOnDestroy() {
    if (this.habitChangedSubscription) { this.habitChangedSubscription.unsubscribe(); }
  }


}

