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
  selectedHabit: Habit;
  habits: Habit[] = [];

  // !TODO REMOVE later when default state is worked out
  defaultHabit: Habit = {
    'name': 'daily javascript',
    'description': 'practice makes perfect!',
    'date_added': '2016-09-02'
  };
  //

  constructor(private menuService: MenuService, private habitService: HabitService) { }

  onClick(habit: Habit) {
    this.selectedHabit = habit;
    this.habitService.setSelectedHabit(habit);
  }

  ngOnInit() {
    // !TODO REMOVE later when default state is worked out
    if (!this.selectedHabit) { this.selectedHabit = this.defaultHabit; }
    //
    this.show = this.menuService.showSideMenu;
    this.menuService.showSideMenuChanged.subscribe(
      (value: boolean) => this.show = value
    );

    this.habits = this.habitService.getHabits();
    this.habitService.habitChanged.subscribe(
      (habits: Habit[]) => this.habits = habits
    );
  }

  ngOnDestroy() {
    this.menuService.showSideMenuChanged.unsubscribe();
    this.habitService.habitChanged.unsubscribe()
  }

}
