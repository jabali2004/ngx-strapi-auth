import type { OnInit, OnDestroy } from '@angular/core';
import { Component } from '@angular/core';
import type {
  FormGroup} from '@angular/forms';
import {
  Form,
  FormBuilder,
  FormControl,
  Validators
} from '@angular/forms';
import type { AuthService } from '../../services/auth/auth.service';
import type { IReqUserUpdate } from '../../types/requests/ReqUserUpdate';
import type { IUser } from '../../types/models/User';
import type { NbIconLibraries } from '@nebular/theme';
import type { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'strapi-auth-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {
  form: FormGroup = new FormBuilder().group({
    firstname: new FormControl(),
    lastname: new FormControl(),
    email: new FormControl(),
    username: new FormControl()
  });

  passwordForm: FormGroup = new FormBuilder().group({
    password: new FormControl('', [
      Validators.required,
      Validators.pattern(
        '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\\d$@$!%*?&].{8,}'
      )
    ]),
    rePass: new FormControl('', [
      Validators.required,
      Validators.pattern(
        '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\\d$@$!%*?&].{8,}'
      )
    ]),
    oldPassword: new FormControl()
  });

  oldUserObj: IUser;

  userObj = {
    firstname: null,
    lastname: null,
    email: null,
    username: null,
    password: null,
    password_confirmation: null,
    oldPassword: null,
    provider: null
  };

  redirectDelay = 0;
  showMessages: any = {
    error: true
  };

  // TODO: Create error component for displaying errors
  // TODO: Add opt in error notifications
  submitted = false;
  passwordSubmitted = false;
  errors: string[] = [];
  messages: string[] = [];

  config = {
    firstnameRequired: false,
    firstnameMinLength: 2,
    firstnameMaxLength: 100,
    lastnameRequired: false,
    lastnameMinLength: 2,
    lastnameMaxLength: 100,
    usernameRequired: true,
    usernameMinLength: 2,
    usernameMaxLength: 100,
    emailRequired: true,
    passwordRequired: true,
    passwordMinLength: 6,
    passwordMaxLength: 60
  };

  constructor(
    protected authService: AuthService,
    protected translate: TranslateService,
    public iconPack: NbIconLibraries
  ) {}

  ngOnInit(): void {
    // Import existing user obj
    this.oldUserObj = this.authService.getUser();

    if (this.oldUserObj) {
      this.userObj = {
        firstname: null,
        lastname: null,
        username: this.oldUserObj.username,
        email: this.oldUserObj.email,
        password: null,
        password_confirmation: null,
        oldPassword: null,
        provider: null
      };
    }
    // Hook on update from user service
    this.authService.UserState.subscribe(() => {
      this.oldUserObj = this.authService.getUser();
      this.userObj = {
        firstname: null,
        lastname: null,
        username: this.oldUserObj.username,
        email: this.oldUserObj.email,
        password: null,
        password_confirmation: null,
        oldPassword: null,
        provider: null
      };
    });
  }

  ngOnDestroy(): void {}

  /**
   * Update UserData if changed
   */
  update(): void {
    this.clearErrors();
    this.submitted = true;
    const updateRequest: IReqUserUpdate = {
      username:
        this.userObj.username &&
        this.oldUserObj.username !== this.userObj.username
          ? this.userObj.username
          : null,
      email:
        this.userObj.email && this.oldUserObj.email !== this.userObj.email
          ? this.userObj.email
          : null,
      password: null,
      oldPassword: null
    };

    if (!updateRequest.username && !updateRequest.email) {
      this.submitted = false;
      return;
    }

    this.authService
      .updateProfile(updateRequest)
      .then(() => {
        this.submitted = false;
      })
      .catch((err) => {
        console.error(err);

        if (err.error.message === 'Username already exists!') {
          console.log('error');
          this.errors.push(
            this.translate.instant('errors.auth.profile.username_existence')
          );

          console.log(this.errors);
        }

        if (err.error.message === 'Email already exists!') {
          this.errors.push(
            this.translate.instant('errors.auth.profile.email_existence')
          );
        }

        this.submitted = false;
      });

    this.form.markAsPristine();
  }

  /**
   * Update password if changed
   * and confirmed
   */
  updatePassword(): void {
    this.clearErrors();
    this.passwordSubmitted = true;
    const updateRequest: IReqUserUpdate = {
      email: null,
      username: null,
      password:
        this.userObj.email && this.userObj.password_confirmation
          ? this.userObj.password
          : null,
      oldPassword: this.userObj.oldPassword
    };

    if (!updateRequest.password) {
      this.passwordSubmitted = false;
      return;
    }

    this.authService
      .updateProfile(updateRequest)
      .then(() => {
        this.passwordSubmitted = false;
        this.passwordForm.controls.password.reset();
        this.passwordForm.controls.rePass.reset();
        this.passwordForm.controls.oldPassword.reset();
      })
      .catch((err) => {
        console.error(err);

        // TODO: Display errors

        if (err.error.message === 'Old user password does not match!') {
          this.errors.push(
            this.translate.instant('errors.auth.profile.wrong_current_password')
          );
        } else if (
          err.error.message === 'Password does not fulfill requirements!'
        ) {
          this.errors.push(
            this.translate.instant('errors.auth.profile.password_requirements')
          );
        } else {
          this.errors.push(
            this.translate.instant('errors.auth.profile.password_change_error')
          );
        }

        this.passwordSubmitted = false;
      });
  }

  private clearErrors(): void {
    this.errors = [];
  }
}
