import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';

import { HabitNew, HabitCalendar } from '../habit';
import { HabitService } from '../habit.service';

@Component({
  selector: 'ht-habit-add',
  templateUrl: './habit-edit.component.html',
  styleUrls: ['./habit-edit.component.css']
})
export class HabitEditComponent implements OnInit, OnDestroy {
  add: boolean;
  edit: boolean;
  habitForm: FormGroup;
  habitList: Array<any>;
  private id: string;
  private routeSubscription: Subscription;

  constructor(private habitService: HabitService,
    private formbuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router) {

    this.routeSubscription = this.activatedRoute.params.subscribe(
      (param: any) => {
        this.id = param['id'];
        let habit: HabitCalendar = this.habitService.getHabitByID(this.id);

        if (this.id) {
          this.habitService.add = false;
          this.habitService.edit = true;
        } else {
          this.habitService.add = true;
          this.habitService.edit = false;
        }
        this.habitList = habitService.getHabitIdList();

        this.initForm(habit);
      }
    );
  }

  ngOnInit() {
    this.add = this.habitService.add;
    this.edit = this.habitService.edit;
  }

  private initForm(habit: HabitCalendar) {
    if (!habit) {
      habit = new HabitCalendar();
    }
    this.habitForm = this.formbuilder.group({
      'name': [habit.name, [
        Validators.required,
        Validators.pattern('[A-Za-z0-9 -]*$'),
        // this.duplicateValidator
      ]],
      'description': [habit.description]
    });
  }

  // !TODO Cannot get this to work. Angular issues an error that the habitList is not defined.
  // However, the list is set before initForm, so it should be defined when this validator is called
  // private duplicateValidator(control: FormControl): { [s: string]: boolean } {
  //   console.log('duplicateValidator...');
  //   // if no error: return NULL
  //   // do not return FALSE

  //   if (this.habitList.find(control.value)) {
  //     return { duplcate: true };
  //   }
  //   return null;
  // }

  onAdd() {
    let habit: HabitNew = {
      name: this.habitForm.get('name').value,
      description: this.habitForm.get('description').value
    };
    this.habitService.addHabit(habit);
    this.router.navigate(['/' + habit.name.split(' ').join('-'), 'month']);
  }

  onClearHistory() {
    this.habitService.clearLogHistory(this.id);
    this.router.navigate(['/' + this.id, this.habitService.currentView]);
  }

  onDelete() {
    this.habitService.deleteHabit(this.id);
    this.router.navigate(['/all/week']);
  }

  onSave() {
    let newHabit: HabitNew = {
      name: this.habitForm.get('name').value,
      description: this.habitForm.get('description').value
    };
    let oldHabit = this.habitService.getHabitByID(this.id);
    this.habitService.editHabit(oldHabit, newHabit);
    this.router.navigate(['/' + newHabit.name.split(' ').join('-'), 'month']);
  }

  ngOnDestroy() {
    if (this.routeSubscription) { this.routeSubscription.unsubscribe(); }
  }

}
