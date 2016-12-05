import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';

import { Calendar } from '../calendar';
import { HabitCalendar } from '../../habits/habit-calendar';
import { HabitDetail } from '../../habits/habit-detail';
import { HabitService } from '../../habits/habit.service';

@Component({
  selector: 'ht-month',
  templateUrl: './month.component.html',
  styleUrls: ['./month.component.css']
})
export class MonthComponent implements OnInit, OnDestroy {
  calendar: Calendar;
  private routeSubscription: Subscription;
  private habitChangeSubscription: Subscription;
  private id: string;
  habit: HabitCalendar;

  constructor(private habitService: HabitService, private router: Router, private activatedRoute: ActivatedRoute) {
    this.routeSubscription = activatedRoute.params.subscribe(
      (param: any) => {
        this.id = param['id'];
        this.habitService.changeCurrentView('month');
        this.refreshCalendar();
      }
    );
  }

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
    this.habit = this.habitService.selectedHabit;

    this.habitChangeSubscription = this.habitService.habitsChanged.subscribe(
      () => this.refreshCalendar()
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

  onEditClick() {
    this.habitService.add = false;
    this.habitService.edit = true;
  }

  private refreshCalendar() {
    this.habitService.getHabitData();
    this.habit = this.habitService.getHabitByID(this.id);
  }

  onFlipCalendar(changeBy: number) {
    this.habitService.flipCalendar(changeBy, 'month');
  }

  ngOnDestroy() {
    if (this.habitChangeSubscription) { this.habitChangeSubscription.unsubscribe(); }
    if (this.routeSubscription) { this.routeSubscription.unsubscribe(); }
  }

}
