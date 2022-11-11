import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {
  FormGroup,
  UntypedFormControl,
  UntypedFormGroup,
  Validators
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../../services/auth/auth.service';
import { IReqPasswordReset } from '../../../types/requests/ReqPasswordReset';
import { IErrorRes } from '../../../types/responses/AuthError';
import Validation from '../../../utils/validation';

@Component({
  selector: 'strapi-reset-password-base',
  template: ''
})
export class ResetPasswordBaseComponent implements OnInit {
  private passwordResetReq: IReqPasswordReset;

  public formGroup: FormGroup = new UntypedFormGroup(
    {
      password: new UntypedFormControl('', [Validators.required]),
      passwordConfirmation: new UntypedFormControl('', [Validators.required]),
      code: new UntypedFormControl('', [Validators.required])
    },
    {
      validators: [Validation.match('password', 'passwordConfirmation')]
    }
  );

  public error: IErrorRes;

  constructor(
    protected cd: ChangeDetectorRef,
    protected router: Router,
    protected route: ActivatedRoute,
    protected authService: AuthService,
    protected translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(() => {
      const code = this.route.snapshot.queryParamMap.get('code');

      if (code) {
        this.formGroup.get('code').setValue(code);
      } else {
        console.error('Reset token not found!');
      }
    });
  }

  /**
   * Reset password
   */
  public resetPassword(): void {
    this.passwordResetReq = this.formGroup.value;

    this.authService
      .resetPassword(this.passwordResetReq)
      .then(() => {
        this.router.navigateByUrl(this.authService.LoginUrl);
      })
      .catch((err: HttpErrorResponse) => {
        this.error = err.error;
      });
  }
}
