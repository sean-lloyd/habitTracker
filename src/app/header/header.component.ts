import { Component, OnInit } from '@angular/core';
import { MenuService } from '../shared/menu.service';

@Component({
  selector: 'ht-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(private menuService: MenuService) { }

  ngOnInit() {
  }

  onClickSideMenu() {
    this.menuService.toggleSideMenu();
  }

}
