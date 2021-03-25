import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
  Inject
} from '@angular/core';
import { Router } from '@angular/router';

import { HttpErrorResponse } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../../services/auth.service';
import {
  StrapiAuthConfig,
  StrapiAuthProviders
} from '../../../types/StrapiAuthConfig';
import { ConfigService } from '../../../services/config.service';

@Component({
  selector: 'strapi-auth-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  showMessages: any = {
    error: true,
    success: true
  };

  errors: string[] = [];
  messages: string[] = [];
  submitted = false;
  rememberMe = false;

  authLoginReq = {
    email: null,
    password: null
  };

  config = {
    passwordRequired: true,
    passwordMinLength: 6,
    passwordMaxLength: 60,
    emailRequired: true
  };

  constructor(
    protected authService: AuthService,
    protected cd: ChangeDetectorRef,
    protected router: Router,
    protected translate: TranslateService,
    @Inject(ConfigService) public strapiAuthConfig: StrapiAuthConfig
  ) {}

  ngOnInit(): void {
    this.rememberMe = false;

    if (this.authService.isAuthenticated) {
      this.router.navigateByUrl(this.authService.LoginRedirectUrl);
    }
  }

  ngOnDestroy(): void {}

  /**
   * Login for local registered users
   */
  public login(): void {
    this.errors = [];
    this.messages = [];
    this.submitted = true;

    this.authService
      .login(this.authLoginReq.email, this.authLoginReq.password)
      .then(() => {
        this.submitted = false;
        if (this.authService.isAuthenticated) {
          this.router.navigateByUrl('/pages');
        }
      })
      .catch((err: HttpErrorResponse) => {
        this.submitted = false;

        if (err.status === 400) {
          this.errors.push(
            this.translate.instant('errors.auth.login.password_or_email')
          );
        } else {
          this.errors.push(
            this.translate.instant('errors.auth.login.undefined')
          );
        }
      });
  }

  /**
   * Login using third party provider
   */
  public loginProvider(provider: StrapiAuthProviders): void {
    window.location.href =
      this.authService.strapiAuthConfig.strapi_base_url +
      '/connect/' +
      provider;
  }
}
