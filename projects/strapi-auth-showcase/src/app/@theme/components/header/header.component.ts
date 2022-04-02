import type { OnDestroy, OnInit } from '@angular/core';
import { Component } from '@angular/core';
import type {
  NbMediaBreakpointsService,
  NbMenuService,
  NbSidebarService,
  NbThemeService,
  NbMenuItem,
  NbMenuBag
} from '@nebular/theme';

import type { LayoutService } from '../../../@core/utils';
import { map, takeUntil, filter } from 'rxjs/operators';
import { Subject } from 'rxjs';
import type { Router } from '@angular/router';
import type { TranslateService } from '@ngx-translate/core';
import type { AuthService, IUser } from 'projects/strapi-auth/src/public-api';

@Component({
  selector: 'app-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();
  userPictureOnly = false;
  user: IUser;

  themes = [
    {
      value: 'default',
      name: 'Light'
    },
    {
      value: 'dark',
      name: 'Dark'
    },
    {
      value: 'cosmic',
      name: 'Cosmic'
    },
    {
      value: 'corporate',
      name: 'Corporate'
    }
  ];

  currentTheme = 'default';

  isAuthenticated: boolean;

  userMenu = [
    { title: 'Profile', data: { id: 'profile' } },
    { title: 'Log out', data: { id: 'logout' } }
  ];

  headerMenu: NbMenuItem[] = [
    {
      title: 'Anmelden',
      data: { translate: 'header.login' },
      link: '/auth/login'
    },
    {
      title: 'Registrieren',
      data: { translate: 'header.register' },
      link: '/auth/register'
    }
  ];

  constructor(
    private sidebarService: NbSidebarService,
    private menuService: NbMenuService,
    private themeService: NbThemeService,
    private layoutService: LayoutService,
    private breakpointService: NbMediaBreakpointsService,
    private authService: AuthService,
    private router: Router,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.translate.instant('header.login');
    this.translate.instant('header.register');

    // const savedTheme = localStorage.getItem('theme');
    // if (savedTheme) {
    //   this.themeService.changeTheme(savedTheme);
    // }

    this.currentTheme = this.themeService.currentTheme;

    this.user = this.authService.getUser();
    this.authService.UserState.subscribe(() => {
      this.user = this.authService.getUser();
    });

    this.translateMenu();

    this.translate.onLangChange.subscribe(() => {
      this.translateMenu();
    });

    // this.userService
    //   .getUsers()
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe((users: any) => (this.user = users.nick));

    const { xl } = this.breakpointService.getBreakpointsMap();
    this.themeService
      .onMediaQueryChange()
      .pipe(
        map(([, currentBreakpoint]) => currentBreakpoint.width < xl),
        takeUntil(this.destroy$)
      )
      .subscribe(
        (isLessThanXl: boolean) => (this.userPictureOnly = isLessThanXl)
      );

    // this.themeService
    //   .onThemeChange()
    //   .pipe(
    //     map(({ name }) => name),
    //     takeUntil(this.destroy$)
    //   )
    //   .subscribe((themeName: string) => {
    //     this.currentTheme = themeName;
    //     localStorage.setItem('theme', themeName);
    //   });

    this.menuService.onItemClick().subscribe((bag: NbMenuBag) => {
      if (bag.item.data) {
        if (bag.item.data.id === 'logout') {
          this.router.navigateByUrl('/auth/logout');
        }
        if (bag.item.data.id === 'profile') {
          this.router.navigateByUrl('/pages/profile');
        }
      }
    });

    this.isAuthenticated = this.authService.isAuthenticated;
    this.authService.AuthState.subscribe(() => {
      this.isAuthenticated = this.authService.isAuthenticated;
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  translateMenu(): void {
    this.headerMenu.forEach((menu) => {
      menu.title = this.translate.instant(menu.data.translate);
    });
  }

  changeTheme(themeName: string): void {
    this.themeService.changeTheme(themeName);
  }

  toggleSidebar(): boolean {
    this.sidebarService.toggle(true, 'menu-sidebar');
    this.layoutService.changeLayoutSize();

    return false;
  }

  navigateHome(): boolean {
    this.menuService.navigateHome();
    return false;
  }
}
