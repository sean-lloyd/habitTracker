import { Component, OnInit, OnDestroy } from '@angular/core';
import { HabitService } from '../habit.service';
// import { Habit } from '../habit';

@Component({
  selector: 'ht-habit-add',
  templateUrl: './habit-add.component.html',
  styleUrls: ['./habit-add.component.css']
})
export class HabitAddComponent implements OnInit, OnDestroy {

  constructor(private habitService: HabitService) { }

  ngOnInit() {

  }

  onClick() {
    //
  }

  ngOnDestroy() {
  }

}
