import { Routes, RouterModule } from '@angular/router';

import { AllWeekComponent } from './calendar/all-week/all-week.component';
import { CalendarComponent } from './calendar/calendar.component';
import { HomeComponent } from './home/home.component';
import { MonthComponent } from './calendar/month/month.component';
import { WeekComponent } from './calendar/week/week.component';
import { HabitDetailsComponent } from './habits/habit-details/habit-details.component';
import { HabitEditComponent } from './habits/habit-edit/habit-edit.component';

const routes: Routes = [
    { path: '', component: HomeComponent, pathMatch: 'full' },
    { path: 'add', component: HabitEditComponent, pathMatch: 'full' },
    { path: 'all/week', component: AllWeekComponent, pathMatch: 'full'},
    { path: ':id', component: CalendarComponent, pathMatch: 'full'},
    { path: ':id/details', component: HabitDetailsComponent, pathMatch: 'full' },
    { path: ':id/edit', component: HabitEditComponent, pathMatch: 'full' },
    { path: ':id/month', component: MonthComponent, pathMatch: 'full' },
    { path: ':id/week', component: WeekComponent, pathMatch: 'full' },
    { path: '**', component: HomeComponent }
];

export const routing = RouterModule.forRoot(routes);

