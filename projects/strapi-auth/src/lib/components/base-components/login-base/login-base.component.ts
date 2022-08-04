import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  UntypedFormControl,
  UntypedFormGroup,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../../services/auth/auth.service';
import { IReqAuthLogin } from '../../../types/requests/ReqAuthLogin';
import { IAuthError } from '../../../types/responses/AuthError';
import {
  StrapiAuthConfig,
  StrapiAuthProviders
} from '../../../types/StrapiAuthConfig';

@Component({
  selector: 'strapi-login-base',
  template: ''
})
export class LoginBaseComponent implements OnInit {
  public loginReq: IReqAuthLogin;
  public formGroup: UntypedFormGroup = new UntypedFormGroup({
    identifier: new UntypedFormControl('', [
      Validators.required,
      Validators.email
    ]),
    password: new UntypedFormControl('', [Validators.required])
  });

  public error: IAuthError;

  constructor(
    protected authService: AuthService,
    protected router: Router,
    protected translate: TranslateService
  ) {}

  ngOnInit(): void {
    if (this.authService.isAuthenticated) {
      this.router.navigateByUrl(this.authService.LoginRedirectUrl);
    }
  }

  /**
   * Login for local registered users
   */
  public login(): void {
    this.loginReq = {
      identifier: this.formGroup.get('identifier').value,
      password: this.formGroup.get('password').value
    };

    this.authService
      .login(this.loginReq)
      .then(() => {
        if (this.authService.isAuthenticated) {
          this.router.navigateByUrl(this.authService.LoginRedirectUrl);
        }
      })
      .catch((err: HttpErrorResponse) => {
        this.error = err.error;
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
