import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';

import { Habit } from '../habit';
import { HabitService } from '../habit.service';

@Component({
  selector: 'ht-habit-details',
  templateUrl: './habit-details.component.html',
  styleUrls: ['./habit-details.component.css']
})
export class HabitDetailsComponent implements OnInit, OnDestroy {
  private routeSubscription: Subscription;
  private id: string;
  habit: Habit;
  private habitChangeSubscription: Subscription;

  constructor(private habitService: HabitService, private activatedRoute: ActivatedRoute) {
    this.routeSubscription = activatedRoute.params.subscribe(
      (param: any) => {
        this.id = param['id'];
        this.habit = this.habitService.getHabitDbCacheById(this.id);
      }
    );
  }

  ngOnInit() {
    this.habitChangeSubscription = this.habitService.habitsChanged.subscribe(
      () => this.habit = this.habitService.getHabitDbCacheById(this.id)
    );
  }

  onEditClick() {
    this.habitService.add = false;
    this.habitService.edit = true;
  }

  ngOnDestroy() {
    if (this.habitChangeSubscription) { this.habitChangeSubscription.unsubscribe(); }
    if (this.routeSubscription) { this.routeSubscription.unsubscribe(); }
  }

}
