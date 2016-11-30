import { Routes, RouterModule } from '@angular/router';

import { CalendarComponent } from './calendar/calendar.component';
import { HomeComponent } from './home/home.component';
import { MonthComponent } from './calendar/month/month.component';
import { WeekComponent } from './calendar/week/week.component';
import { AllWeekComponent } from './calendar/all-week/all-week.component';

const routes: Routes = [
    { path: '', component: HomeComponent, pathMatch: 'full' },
    { path: 'all/week', component: AllWeekComponent, pathMatch: 'full'},
    { path: ':id', component: CalendarComponent, pathMatch: 'full'},
    { path: ':id/month', component: MonthComponent },
    { path: ':id/week', component: WeekComponent }
    // { path: ':id/add', component: MonthComponent },
    // { path: ':id/edit', component: MonthComponent },
    // { path: ':id/details', component: MonthComponent },
];

export const routing = RouterModule.forRoot(routes);

