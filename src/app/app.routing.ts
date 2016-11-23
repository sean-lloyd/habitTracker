import { Routes, RouterModule } from '@angular/router';

import { CalendarComponent } from './calendar/calendar.component';
import { MonthComponent } from './calendar/month/month.component';
import { WeekComponent } from './calendar/week/week.component';

const routes: Routes = [
    { path: '', component: CalendarComponent, pathMatch: 'full' },
    { path: 'month', component: MonthComponent},
    { path: 'week', component: WeekComponent }
];

export const routing = RouterModule.forRoot(routes);

