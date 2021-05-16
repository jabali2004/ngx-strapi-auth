import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'strapi-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit, OnDestroy {
  redirectDelay = 0;
  showMessages: any = {
    error: true,
    success: true
  };
  strategy = '';

  submitted = false;
  errors: string[] = [];
  messages: string[] = [];

  passwordResetReq: any = {
    password_confirmation: '',
    password: '',
    reset_token: ''
  };

  config = {
    fullNameRequired: true,
    fullNameMinLength: 2,
    fullNameMaxLength: 100,
    emailRequired: true,
    passwordRequired: true,
    passwordMinLength: 6,
    passwordMaxLength: 60,
    termsRequired: true
  };

  constructor(
    protected cd: ChangeDetectorRef,
    protected router: Router,
    protected route: ActivatedRoute,
    protected authService: AuthService,
    protected translate: TranslateService
  ) {}

  ngOnInit(): void {
    // get code from url
    this.route.queryParams.subscribe(() => {
      this.passwordResetReq.code =
        this.route.snapshot.queryParamMap.get('code');
    });

    if (!this.passwordResetReq.code) {
      console.error('Reset token not found!');
    }
  }

  ngOnDestroy(): void {}

  resetPass(): void {
    this.errors = [];
    this.messages = [];
    this.submitted = true;

    this.authService
      .resetPassword(this.passwordResetReq)
      .then(() => {
        this.submitted = false;
        this.router.navigateByUrl(this.authService.LoginUrl);
      })
      .catch((error: HttpErrorResponse) => {
        this.submitted = false;

        if (error.status === 400) {
          this.errors.push(
            this.translate.instant('errors.auth.reset-password.code')
          );
        } else {
          this.errors.push(
            this.translate.instant('errors.auth.reset-password.undefined')
          );
        }
      });
  }
}
