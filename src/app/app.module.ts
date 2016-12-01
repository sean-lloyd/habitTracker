// ANGULAR 2 MODULES
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

// COMPONENTS
import { AppComponent } from './app.component';
import { AllWeekComponent } from './calendar/all-week/all-week.component';
import { CalendarComponent } from './calendar/calendar.component';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { MonthComponent } from './calendar/month/month.component';
import { WeekComponent } from './calendar/week/week.component';
import { SidebarComponent } from './sidebar/sidebar.component';

// SERVICES
import { MenuService } from './shared/menu.service';
import { HabitService } from './habits/habit.service';
import { CalendarService } from './calendar/calendar.service';

// ROUTING
import { routing } from './app.routing';

import { InMemoryWebApiModule } from 'angular-in-memory-web-api';
import { InMemoryDataService }  from './api/in-memory-data.service';


@NgModule({
  declarations: [
    AppComponent,
    AllWeekComponent,
    CalendarComponent,
    HeaderComponent,
    HomeComponent,
    MonthComponent,
    SidebarComponent,
    WeekComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    InMemoryWebApiModule.forRoot(InMemoryDataService), // to trick the HTTP client into fetching and saving data from a mock service
    routing
  ],
  providers: [MenuService, HabitService, CalendarService],
  bootstrap: [AppComponent]
})
export class AppModule { }
