import { Routes, RouterModule } from '@angular/router';

import { AllWeekComponent } from './calendar/all-week/all-week.component';
import { CalendarComponent } from './calendar/calendar.component';
import { HomeComponent } from './home/home.component';
import { MonthComponent } from './calendar/month/month.component';
import { WeekComponent } from './calendar/week/week.component';
import { HabitAddComponent } from './habits/habit-add/habit-add.component';

const routes: Routes = [
    { path: '', redirectTo: 'all/week', pathMatch: 'full' },
    { path: 'add', component: HabitAddComponent, pathMatch: 'full' },
    { path: 'all/week', component: AllWeekComponent, pathMatch: 'full'},
    { path: ':id', component: CalendarComponent, pathMatch: 'full'},
    { path: ':id/month', component: MonthComponent },
    { path: ':id/week', component: WeekComponent },
    { path: '**', component: HomeComponent }
    // { path: ':id/edit', component: MonthComponent },
    // { path: ':id/details', component: MonthComponent },
];

export const routing = RouterModule.forRoot(routes);

