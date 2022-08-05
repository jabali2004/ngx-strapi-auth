import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {
  UntypedFormControl,
  UntypedFormGroup,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../../services/auth/auth.service';
import { IReqAuthRegister } from '../../../types/requests/ReqAuthRegister';
import { IErrorRes } from '../../../types/responses/AuthError';
import Validation from '../../../utils/validation';

@Component({
  selector: 'strapi-register-base',
  template: ''
})
export class RegisterBaseComponent implements OnInit {
  public registerReq: IReqAuthRegister;
  public formGroup: UntypedFormGroup = new UntypedFormGroup(
    {
      email: new UntypedFormControl('', [
        Validators.required,
        Validators.email
      ]),
      username: new UntypedFormControl('', [Validators.required]),
      password: new UntypedFormControl('', [Validators.required]),
      passwordConfirmation: new UntypedFormControl('', [Validators.required])
    },
    {
      validators: [Validation.match('password', 'passwordConfirmation')]
    }
  );

  public error: IErrorRes;

  constructor(
    protected router: Router,
    protected authService: AuthService,
    protected translate: TranslateService
  ) {}

  ngOnInit(): void {
    if (this.authService.isAuthenticated) {
      this.router.navigateByUrl(this.authService.LoginRedirectUrl);
    }
  }

  public register(): void {
    this.registerReq = this.formGroup.value;

    this.authService
      .register(this.registerReq)
      .then(() => {
        this.router.navigateByUrl(this.authService.LoginUrl);
      })
      .catch((err: HttpErrorResponse) => {
        this.error = err.error;
      });
  }
}
