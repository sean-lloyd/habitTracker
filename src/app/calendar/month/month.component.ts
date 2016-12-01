import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';

import { Calendar } from '../calendar';
import { Habit } from '../../shared/habit';
import { HabitService } from '../../shared/habit.service';

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
  habit: Habit;

  constructor(private habitService: HabitService, private router: Router, private activatedRoute: ActivatedRoute) {
    this.routeSubscription = activatedRoute.params.subscribe(
      (param: any) => {
        this.id = param['id'];
        this.habitService.changeCurrentView('month');
        this.refreshCalendar();
      }
    );
  }

  ngOnInit() {
    this.habit = this.habitService.selectedHabit;

    this.habitChangeSubscription = this.habitService.habitsChanged.subscribe(
      () => this.refreshCalendar()
    );

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
