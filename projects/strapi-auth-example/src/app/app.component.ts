import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {
  AuthService,
  LanguageService
} from 'projects/strapi-auth/src/public-api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'strapi-auth-example';

  constructor(
    private authService: AuthService,
    private languageService: LanguageService,
    private translate: TranslateService
  ) {
    this.languageService.setDefaultTranslation(this.translate);

    if (this.authService.isAuthenticated && !this.authService.getUser()) {
      this.authService.loadUser();
    }
    this.authService.AuthState.subscribe(() => {
      if (this.authService.isAuthenticated && !this.authService.getUser()) {
        this.authService.loadUser();
      }
    });
  }
}
