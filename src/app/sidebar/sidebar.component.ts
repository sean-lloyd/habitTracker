import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';

import { MenuService } from '../shared/menu.service';
import { HabitCalendar } from '../habits/habit-calendar';
import { HabitService } from '../habits/habit.service';

@Component({
  selector: 'ht-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit, OnDestroy {
  private routeSubscription: Subscription;
  private menuServiceSubscription: Subscription;
  private habitChangedSubscription: Subscription;
  allWeekView: boolean = true;
  currentView: string;
  id: string;
  habits: HabitCalendar[] = [];
  selectedHabit: HabitCalendar;
  show: boolean = false;

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
    this.habits = this.habitService.getHabitData();

    this.habitChangedSubscription = this.habitService.habitsChanged.subscribe(
      (habits: HabitCalendar[]) => {
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

  onClick(habit: HabitCalendar) {
    this.menuService.toggleSideMenu();
    this.selectedHabit = habit;
    this.allWeekView = false;
  }

  onClickAdd() {
    this.menuService.toggleSideMenu();
    this.habitService.add = true;
    this.habitService.edit = false;
  }

  onClickAll() {
    this.menuService.toggleSideMenu();
    this.selectedHabit = null;
    this.allWeekView = true;
  }

  ngOnDestroy() {
    if (this.menuServiceSubscription) { this.menuServiceSubscription.unsubscribe(); }
    if (this.habitChangedSubscription) { this.habitChangedSubscription.unsubscribe(); }
    if (this.routeSubscription) { this.routeSubscription.unsubscribe(); }
  }

}
