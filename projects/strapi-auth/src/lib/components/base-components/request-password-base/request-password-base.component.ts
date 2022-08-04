import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {
  FormGroup,
  UntypedFormControl,
  UntypedFormGroup,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../../services/auth/auth.service';
import { IAuthError } from '../../../types/responses/AuthError';
import { IResRequestPasswordReset } from '../../../types/responses/ResRequestPasswordReset';

@Component({
  selector: 'strapi-request-password-base',
  template: ''
})
export class RequestPasswordBaseComponent {
  public formGroup: FormGroup = new UntypedFormGroup({
    email: new UntypedFormControl('', [Validators.required, Validators.email])
  });

  public error: IAuthError;

  constructor(
    protected cd: ChangeDetectorRef,
    protected router: Router,
    protected authService: AuthService,
    protected translate: TranslateService
  ) {}

  public requestPasswordReset(): void {
    this.authService
      .requestPasswordReset(this.formGroup.value.email)
      .then(() => {
        this.formGroup.get('email').setValue('');
        this.router.navigateByUrl(this.authService.RequestPasswordRedirectUrl);
      })
      .catch((err: HttpErrorResponse) => {
        this.error = err.error;
      });
  }
}
