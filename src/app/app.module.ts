// ANGULAR 2 MODULES
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

// COMPONENTS
import { AppComponent } from './app.component';
import { AllWeekComponent } from './calendar/all-week/all-week.component';
import { CalendarComponent } from './calendar/calendar.component';
import { HabitDetailsComponent } from './habits/habit-details/habit-details.component';
import { HabitEditComponent } from './habits/habit-edit/habit-edit.component';
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

// FIREBASE
import { AngularFireModule } from 'angularfire2';
export const firebaseConfig = {
    apiKey: 'your apiKey',
    authDomain: 'your authDomain',
    databaseURL: 'your databaseURL',
    storageBucket: 'your storageBucket',
    messagingSenderId: 'your messagingSenderId'
};

@NgModule({
  declarations: [
    AppComponent,
    AllWeekComponent,
    CalendarComponent,
    HabitEditComponent,
    HeaderComponent,
    HomeComponent,
    MonthComponent,
    SidebarComponent,
    WeekComponent,
    HabitDetailsComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    AngularFireModule.initializeApp(firebaseConfig),
    routing
  ],
  providers: [MenuService, HabitService, CalendarService],
  bootstrap: [AppComponent]
})
export class AppModule { }
