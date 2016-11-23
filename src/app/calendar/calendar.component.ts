import { Component, OnInit } from '@angular/core';
import { MenuService } from '../shared/menu.service';

@Component({
  selector: 'ht-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {
  showSideMenu: boolean = false;

  constructor(private menuService: MenuService) { }

  ngOnInit() {
    this.showSideMenu = this.menuService.showSideMenu;
    this.menuService.showSideMenuChanged.subscribe(
      (value: boolean) => this.showSideMenu = value
    );
  }

}
