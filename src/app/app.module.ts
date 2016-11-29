import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

/** Imports for loading & configuring the in-memory web api
 * to simulate a database or api response before the database actually exsts
 * ! REMOVE after database is added
*/
import { InMemoryWebApiModule } from 'angular-in-memory-web-api';
import { InMemoryDataService }  from './api/in-memory-data.service';

import { AppComponent } from './app.component';
import { CalendarComponent } from './calendar/calendar.component';
import { MonthComponent } from './calendar/month/month.component';
import { WeekComponent } from './calendar/week/week.component';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { MenuService } from './shared/menu.service';
import { HabitService } from './shared/habit.service';
import { CalendarService } from './calendar/calendar.service';

import { routing } from './app.routing';
import { HomeComponent } from './home/home.component';

@NgModule({
  declarations: [
    AppComponent,
    CalendarComponent,
    MonthComponent,
    WeekComponent,
    HeaderComponent,
    SidebarComponent,
    HomeComponent,
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
