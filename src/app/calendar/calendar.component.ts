import { Component, OnInit } from '@angular/core';
import { HabitService } from '../shared/habit.service';

@Component({
  selector: 'ht-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {
  constructor(private habitService: HabitService) { }

  ngOnInit() {
    this.habitService.getCalendars(this.habitService.getSelectedHabit());
  }

}
