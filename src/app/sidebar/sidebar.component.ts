import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';

import { MenuService } from '../shared/menu.service';
import { HabitService } from '../shared/habit.service';
import { Habit } from '../shared/habit';

@Component({
  selector: 'ht-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit, OnDestroy {
  private routeSubscription: Subscription;
  private menuServiceSubscription: Subscription;
  private habitChangedSubscription: Subscription;
  private currentViewChangedSubscription: Subscription;
  show: boolean = false;
  id: string;
  selectedHabit: Habit;
  habits: Habit[] = [];
  currentView: string;

  constructor(
    private menuService: MenuService,
    private habitService: HabitService,
    private router: Router,
    private activatedRoute: ActivatedRoute) {

    this.routeSubscription = activatedRoute.params.subscribe(
      (param: any) => {
        this.id = param['id'];
        this.selectedHabit = this.habitService.selectedHabit;
      }
    );
  }

  ngOnInit() {
    this.currentView = this.habitService.currentView;
    this.show = this.menuService.showSideMenu;
    this.habits = this.habitService.getHabits();

    this.currentViewChangedSubscription = this.habitService.currentViewChanged.subscribe(
      (view: any) => {
        this.currentView = view;
      }
    );

    this.habitChangedSubscription = this.habitService.habitChanged.subscribe(
      (habits: Habit[]) => {
        this.habits = habits;
        this.selectedHabit = this.habitService.selectedHabit;
      }
    );

    this.menuServiceSubscription = this.menuService.showSideMenuChanged.subscribe(
      (value: boolean) => {
        this.show = value;
        this.currentView = this.habitService.currentView;
      }
    );
  }

  onClick(habit: Habit) {
    this.selectedHabit = habit;
  }

  ngOnDestroy() {
    if (this.menuServiceSubscription) { this.menuServiceSubscription.unsubscribe(); }
    if (this.habitChangedSubscription) { this.habitChangedSubscription.unsubscribe(); }
    if (this.routeSubscription) { this.routeSubscription.unsubscribe(); }
  }

}
