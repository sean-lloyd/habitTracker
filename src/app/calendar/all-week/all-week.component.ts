import { Component, OnInit } from '@angular/core';
import { HabitService } from '../../shared/habit.service';

@Component({
  selector: 'ht-all-week',
  templateUrl: './all-week.component.html',
  styleUrls: ['./all-week.component.css']
})
export class AllWeekComponent implements OnInit {

  constructor(private habitService: HabitService) { }

  ngOnInit() {
    // need to create method in habitService to provide everything (habit + habit details) in one big JSON object
    // for each habit, create the habit detail object and push into array
    // [
    //   {
    //     "habit-name": "daily javascript",
    //     days: [calendar objects]
    //   }
    // ]
  }

}

