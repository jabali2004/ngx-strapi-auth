import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'strapi-request-password',
  templateUrl: './request-password.component.html',
  styleUrls: ['./request-password.component.scss']
})
export class RequestPasswordComponent implements OnInit, OnDestroy {
  redirectDelay = 0;
  showMessages: any = {
    error: true,
    success: true
  };

  resetCreateReq: any = {
    email: ''
  };

  submitted = false;
  errors: string[] = [];
  messages: string[] = [];

  config = {
    emailRequired: true
  };

  constructor(
    protected cd: ChangeDetectorRef,
    protected router: Router,
    protected authService: AuthService,
    protected translate: TranslateService
  ) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {}

  requestPass(): void {
    this.errors = [];
    this.messages = [];
    this.submitted = true;

    this.authService
      .requestPasswordReset(this.resetCreateReq.email)
      .then(() => {
        this.submitted = false;
        this.resetCreateReq.email = '';
        this.router.navigateByUrl(this.authService.RequestPasswordRedirectUrl);
      })
      .catch((error: HttpErrorResponse) => {
        this.submitted = false;

        if (error.status === 400) {
          this.errors.push(
            this.translate.instant('errors.auth.request-password.email')
          );
        } else {
          this.errors.push(
            this.translate.instant('errors.auth.request-password.undefined')
          );
        }
      });
  }
}
