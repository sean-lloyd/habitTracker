import { Component, OnInit, OnDestroy } from '@angular/core';
import { HabitService } from '../shared/habit.service';
import { Subscription } from 'rxjs/Rx';

@Component({
  selector: 'ht-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit, OnDestroy {
  currentView: string;
  currentViewSubscription: Subscription;

  constructor(private habitservice: HabitService) { }

  ngOnInit() {
    this.currentView = this.habitservice.currentView;

    this.currentViewSubscription = this.habitservice.currentViewChanged.subscribe(
      (view: any) => this.currentView = view
    );
  }

  ngOnDestroy() {
    if (this.currentViewSubscription) { this.currentViewSubscription.unsubscribe(); }
  }

}
