import { Component, OnInit } from '@angular/core';
import { MENU_ITEMS_SUBJECT, MENU_ITEMS } from './pages-menu';
import { NbMenuItem } from '@nebular/theme';
import { AuthService } from 'projects/strapi-auth/src/public-api';

@Component({
  selector: 'app-pages',
  template: `
    <app-one-column-layout>
      <nb-menu [items]="menu"></nb-menu>
      <router-outlet></router-outlet>
    </app-one-column-layout>
  `
})
export class PagesComponent implements OnInit {
  menu = MENU_ITEMS;

  constructor(private authService: AuthService) {
    MENU_ITEMS_SUBJECT.subscribe((menuItems) => {
      this.menu = menuItems;
    });
  }

  ngOnInit(): void {
    if (this.authService.isAuthenticated) {
      this.menu.forEach((menuItem) => {
        this.handleVisibility(menuItem);
      });
    }
    this.authService.AuthState.subscribe(() => {
      this.menu.forEach((menuItem) => {
        this.handleVisibility(menuItem);
      });
    });
  }

  handleVisibility(menu: NbMenuItem): void {
    // load requested rights and groups
    if (!menu.data) {
      menu.hidden = false;
      return;
    }

    // recursive child check
    if (menu.children) {
      menu.children.forEach((child) => {
        this.handleVisibility(child);
      });
    }

    const restrictedAccess: boolean = menu.data.restrictedAccess as boolean;

    if (restrictedAccess && this.authService.isAuthenticated) {
      menu.hidden = false;
    } else if (restrictedAccess) {
      menu.hidden = true;
    }
  }
}
