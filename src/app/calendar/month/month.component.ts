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
  public calendar: Calendar;
  private routeSubscription: Subscription;
  private habitChangeSubscription: Subscription;
  private calendarChangedSubscription: Subscription;
  private id: string;
  selectedHabit: Habit;

  constructor(private habitService: HabitService, private router: Router, private activatedRoute: ActivatedRoute) {
    this.routeSubscription = activatedRoute.params.subscribe(
      (param: any) => {
        this.id = param['id'];
        this.habitService.changeCurrentView('month');
        this.refreshCalendar();
      }
    );
  }

  private refreshCalendar() {
    this.habitService.getHabits();
    this.selectedHabit = this.habitService.getHabitByID(this.id);
    if (this.selectedHabit) {
      this.habitService.getCalendars(this.selectedHabit.name);
    }
  }

  onFlipCalendar(changeBy: number) {
    this.habitService.flipCalendar(this.selectedHabit.name, changeBy, 'month');
  }

  ngOnInit() {
    this.selectedHabit = this.habitService.selectedHabit;
    this.calendar = this.habitService.calendarMonthDetail;

    this.habitChangeSubscription = this.habitService.habitChanged.subscribe(
      () => this.refreshCalendar()
    );

    this.calendarChangedSubscription = this.habitService.calendarMonthChanged.subscribe(
      (calendar: Calendar) => {
        this.calendar = calendar;
      }
    );
  }

  ngOnDestroy() {
    if (this.habitChangeSubscription) { this.habitChangeSubscription.unsubscribe(); }
    if (this.calendarChangedSubscription) { this.calendarChangedSubscription.unsubscribe(); }
    if (this.routeSubscription) { this.routeSubscription.unsubscribe(); }
  }

}
