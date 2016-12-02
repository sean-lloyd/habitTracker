// ANGULAR 2 MODULES
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

// COMPONENTS
import { AppComponent } from './app.component';
import { AllWeekComponent } from './calendar/all-week/all-week.component';
import { CalendarComponent } from './calendar/calendar.component';
import { HabitAddComponent } from './habits/habit-add/habit-add.component';
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

// INTERNAL TEMP DATABASE API
import { InMemoryWebApiModule } from 'angular-in-memory-web-api';
import { InMemoryDataService }  from './api/in-memory-data.service';

// FIREBASE
import { AngularFireModule } from 'angularfire2';
export const firebaseConfig = {
    apiKey: 'AIzaSyBCl_h1o2bBZ7-24FZ8PtG3edbbUGxAS2s',
    authDomain: 'habit-tracker-d4cd6.firebaseapp.com',
    databaseURL: 'https://habit-tracker-d4cd6.firebaseio.com',
    storageBucket: 'habit-tracker-d4cd6.appspot.com',
    messagingSenderId: '613417752987'
};

@NgModule({
  declarations: [
    AppComponent,
    AllWeekComponent,
    CalendarComponent,
    HabitAddComponent,
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
    AngularFireModule.initializeApp(firebaseConfig),
    routing
  ],
  providers: [MenuService, HabitService, CalendarService],
  bootstrap: [AppComponent]
})
export class AppModule { }
