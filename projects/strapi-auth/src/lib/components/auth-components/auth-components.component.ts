import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { Location } from '@angular/common';

@Component({
  selector: 'strapi-auth-components',
  templateUrl: './auth-components.component.html',
  styleUrls: ['./auth-components.component.scss']
})
export class AuthComponentsComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  subscription: any;

  authenticated = false;
  token = '';

  // showcase of how to use the onAuthenticationChange method
  constructor(
    protected location: Location // private themeService: NbThemeService
  ) {
    // TODO: Remove later
    // const savedTheme = localStorage.getItem('theme');
    // if (savedTheme) {
    //   this.themeService.changeTheme(savedTheme);
    // } else {
    //   this.themeService.changeTheme('dark');
    // }
  }

  back(): boolean {
    this.location.back();
    return false;
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
