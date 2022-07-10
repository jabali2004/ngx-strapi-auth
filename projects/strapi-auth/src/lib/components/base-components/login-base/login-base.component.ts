import { HttpErrorResponse } from '@angular/common/http';
import {  Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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
  public formGroup: FormGroup = new FormGroup({
    identifier: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
  });

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
        const loginError = err.error as IAuthError;
        console.log(loginError.error.message);
      });

    // this.errors = [];
    // this.messages = [];
    // this.submitted = true;
    // this.authService
    //   .login(this.authLoginReq.email, this.authLoginReq.password)
    //   .then(() => {
    //     this.submitted = false;
    //     if (this.authService.isAuthenticated) {
    //       this.router.navigateByUrl(this.authService.LoginRedirectUrl);
    //     }
    //   })
    //   .catch((err: HttpErrorResponse) => {
    //     this.submitted = false;
    //     console.log(err);
    //     if (err.status === 400) {
    //       switch (err.error.data[0].messages[0].id) {
    //         // Check if email is confirmed
    //         case 'Auth.form.error.confirmed':
    //           this.errors.push(
    //             this.translate.instant('errors.auth.login.email_verification')
    //           );
    //           break;
    //         // Check if user has been blocked
    //         case 'Auth.form.error.blocked':
    //           this.errors.push(
    //             this.translate.instant('errors.auth.login.account_blocked')
    //           );
    //           break;
    //         default:
    //           this.errors.push(
    //             this.translate.instant('errors.auth.login.password_or_email')
    //           );
    //           break;
    //       }
    //     } else {
    //       this.errors.push(
    //         this.translate.instant('errors.auth.login.undefined')
    //       );
    //     }
    //   });
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
