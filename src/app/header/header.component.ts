import { Component, OnInit } from '@angular/core';
import { trigger, state, style, transition, animate, keyframes, group } from '@angular/core';
import { MenuService } from '../shared/menu.service';

@Component({
  selector: 'ht-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  animations: [
    trigger('menuIconState', [
      state('closed', style({
        transform: 'translateX(0)'
      })),
      state('open', style({
        transform: 'translateX(5px)'
      }))
    ])
  ]
})
export class HeaderComponent implements OnInit {
  menuIconState: string = 'closed';

  constructor(private menuService: MenuService) { }

  ngOnInit() {
  }

  onClickSideMenu() {
    this.menuIconState === 'closed' ? this.menuIconState = 'open' : this.menuIconState = 'closed';;
    this.menuService.toggleSideMenu();
  }

}
