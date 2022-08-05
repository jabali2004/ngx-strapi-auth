import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators
} from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../../services/auth/auth.service';
import { IUser } from '../../../types/models/User';
import { IReqPasswordUpdate } from '../../../types/requests/ReqPasswordUpdate';
import { IReqUserUpdate } from '../../../types/requests/ReqUserUpdate';
import { IErrorRes } from '../../../types/responses/AuthError';
import Validation from '../../../utils/validation';

@Component({
  selector: 'strapi-profile-base',
  template: ''
})
export class ProfileBaseComponent implements OnInit {
  private userObj: IUser;
  private oldUserObj: IUser;

  public formGroup: UntypedFormGroup = new UntypedFormGroup({
    email: new UntypedFormControl(),
    username: new UntypedFormControl()
  });

  public passwordFormGroup: UntypedFormGroup = new UntypedFormGroup(
    {
      password: new UntypedFormControl('', [
        Validators.required,
        Validators.pattern(
          '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\\d$@$!%*?&].{8,}'
        )
      ]),
      passwordConfirmation: new UntypedFormControl('', [
        Validators.required,
        Validators.pattern(
          '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\\d$@$!%*?&].{8,}'
        )
      ]),
      oldPassword: new UntypedFormControl('', [Validators.required])
    },
    {
      validators: [Validation.match('password', 'passwordConfirmation')]
    }
  );

  public error: IErrorRes;
  public passwordError: IErrorRes;

  constructor(
    protected authService: AuthService,
    protected translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.oldUserObj = this.authService.getUser();

    if (this.oldUserObj) {
      this.userObj = {
        ...this.oldUserObj
      };

      this.formGroup.setValue({
        username: this.userObj.username,
        email: this.userObj.email
      });
    }

    this.authService.UserState.subscribe(() => {
      this.oldUserObj = this.authService.getUser();
      this.userObj = {
        ...this.oldUserObj
      };

      this.formGroup.setValue({
        username: this.userObj.username,
        email: this.userObj.email
      });
    });
  }

  /**
   * Update UserData if changed
   */
  public update(): void {
    this.userObj = {
      ...this.formGroup.value
    };

    const updateRequest: IReqUserUpdate = {
      username:
        this.userObj.username &&
        this.oldUserObj.username !== this.userObj.username
          ? this.userObj.username
          : null,
      email:
        this.userObj.email && this.oldUserObj.email !== this.userObj.email
          ? this.userObj.email
          : null
    };

    if (!updateRequest.username && !updateRequest.email) {
      return;
    }

    this.authService
      .updateProfile(updateRequest)
      .then(() => {
        this.formGroup.markAsPristine();
      })
      .catch((err: HttpErrorResponse) => {
        this.error = err.error;
      });
  }

  /**
   * Update password if changed
   * and confirmed
   */
  public updatePassword(): void {
    const updateRequest: IReqPasswordUpdate = {
      password: this.passwordFormGroup.value.password,
      oldPassword: this.passwordFormGroup.value.oldPassword
    };

    if (!updateRequest.password || !updateRequest.oldPassword) {
      return;
    }

    this.authService
      .updateProfile(updateRequest)
      .then(() => {
        this.passwordFormGroup.reset();
        this.passwordFormGroup.markAsPristine();
      })
      .catch((err: HttpErrorResponse) => {
        this.passwordError = err.error;
      });
  }
}
