# HabitTracker
My first Angular 2 app. A calendar-based approach to tracking succes/failure when establishing a new habit. You can find a live running version [here](http://seanlloyd.org/habit-tracker/).

## Angular 2 Notes
The app uses the following Angular 2 features:
* Components
* Forms
* Pipes
* services
* Routing (Path Location Strategy)
* TypeScript (classes, interfaces, typings...)
* [angular-cli](https://github.com/angular/angular-cli) version 1.0.0-beta.19-3.

Other libraries use:
* [angularfire2](https://github.com/angular/angularfire2) for Angular2-friendly access to Firebase database APIs.
* Twitter bootstrap

## Still To Do
* Write tests. The testing (.spec) files are currently empty shells
* Habit-Edit Form: Async validation if habit name already exists. Ran into issues before with FormControl not having access to component's `this` object.
* Habit-Edit: Resolve undefined errors if you go directly to add route
* Improve performance. Currently loads slow on mobile devices.
* Improve comments
* Make sure typings always used

## Refactor Opportunities
* Combine common code, html, css into from child components into main CalendarComponent. I initially avoided this to play around with multiple components and services.
* Consider creating a CalendarModule with its own child routing. This would allow for possibly lazy loading the app, maybe improve performance.