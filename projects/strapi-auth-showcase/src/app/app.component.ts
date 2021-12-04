import { Component, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'projects/strapi-auth/src/public-api';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>'
})
export class AppComponent implements OnDestroy, OnInit {
  constructor(
    public titleService: Title,
    private translate: TranslateService,
    private authService: AuthService
  ) {
    // Hier werden die language files geladen
    this.authService.setDefaultTranslation(translate);

    this.translate.get('page-title').subscribe((title) => {
      this.setTitle(title);
    });

    if (authService.isAuthenticated && !authService.getUser()) {
      this.authService.loadUser();
    }
    this.authService.AuthState.subscribe(() => {
      if (authService.isAuthenticated && !authService.getUser()) {
        this.authService.loadUser();
      }
    });
  }

  ngOnInit(): void {}

  public setTitle(newTitle: string): void {
    this.titleService.setTitle(newTitle);
  }

  ngOnDestroy(): void {
    const test = 't';
  }
}
