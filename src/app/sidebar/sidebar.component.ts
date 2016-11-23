import { Component, OnInit, OnDestroy } from '@angular/core';
import { MenuService } from '../shared/menu.service';
import { HabitService } from '../shared/habit.service';
import { Habit } from '../shared/habit';

@Component({
  selector: 'ht-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit, OnDestroy {
  show: boolean = false;
  habits: Habit[] = [];

  constructor(private menuService: MenuService, private habitService: HabitService) { }

  ngOnInit() {
    this.show = this.menuService.showSideMenu;
    this.menuService.showSideMenuChanged.subscribe(
      (value: boolean) => this.show = value
    );

    this.habitService.fetchHabits();

    this.habits = this.habitService.getHabits();
    this.habitService.habitChanged.subscribe(
      // add typings to habits
      (habits: Habit[]) => this.habits = habits
    );
  }

  ngOnDestroy() {
    this.menuService.showSideMenuChanged.unsubscribe();
  }

}
