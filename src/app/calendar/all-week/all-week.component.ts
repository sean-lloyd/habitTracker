import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Subscription } from 'rxjs/Rx';

import { HabitService } from '../../habits/habit.service';
import { HabitCalendar } from '../../habits/habit-calendar';
import { HabitDetail } from '../../habits/habit-detail';

@Component({
  selector: 'ht-all-week',
  templateUrl: './all-week.component.html',
  styleUrls: ['./all-week.component.css']
})
export class AllWeekComponent implements OnInit, OnDestroy {
  currentView: string;
  calendarTitle: string;
  habits: HabitCalendar[] = [];
  private habitChangedSubscription: Subscription;

  constructor(private habitService: HabitService) { }

  @HostListener('window:keydown', ['$event']) onKeyDown(event: any) {
    event.preventDefault();
    event.stopPropagation();
    switch (event.keyCode) {
      case 37: // ArrowLeft
        this.onFlipCalendar(-1);
        break;
      case 39: // ArrowRight
        this.onFlipCalendar(1);
        break;
      default:
        break;
    }
  }

  ngOnInit() {
    this.habits = this.habitService.getHabitData();
    if (this.habits) {
      this.calendarTitle = this.habits[0].week.title;
    }

    this.habitChangedSubscription = this.habitService.habitsChanged.subscribe(
      (habits: HabitCalendar[]) => {
        this.habits = habits;
        this.calendarTitle = this.habits[0].week.title;
      }
    );
  }

  onDateClick(habitId, detail: HabitDetail) {

    switch (detail.status) {
      case 'false':
        detail.status = 'blank'; // reset to blank
        break;
      case 'true':
        detail.status = 'false'; // change from true (success) to false (failure)
        break;
      default:
        detail.status = 'true';
        break;
    }

    this.habitService.logDay(habitId, detail);
  }

  onFlipCalendar(changeBy: number) {
    this.habitService.flipCalendar(changeBy, 'week');
  }

  ngOnDestroy() {
    if (this.habitChangedSubscription) { this.habitChangedSubscription.unsubscribe(); }
  }


}

