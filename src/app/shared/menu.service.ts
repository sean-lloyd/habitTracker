import { Injectable, EventEmitter } from '@angular/core';

@Injectable()
export class MenuService {
  showSideMenu: boolean = false;
  showSideMenuChanged = new EventEmitter<boolean>();

  constructor() { }

  toggleSideMenu() {
    this.showSideMenu = !this.showSideMenu;
    this.showSideMenuChanged.emit(this.showSideMenu);
  }

}
