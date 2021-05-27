import { Component, OnInit, OnDestroy } from '@angular/core';
import { Form, FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { IReqUserUpdate } from '../../types/requests/ReqUserUpdate';
import { IUser } from '../../types/models/User';

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
    password: new FormControl(),
    rePass: new FormControl()
  });

  oldUserObj: IUser;

  userObj = {
    firstname: null,
    lastname: null,
    email: null,
    username: null,
    password: null,
    password_confirmation: null,
    provider: null
  };

  redirectDelay = 0;
  showMessages: any = {};

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

  constructor(protected authService: AuthService) {}

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
        provider: null
      };
    });
  }

  ngOnDestroy(): void {}

  /**
   * Update UserData if changed
   */
  update(): void {
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
      password: null
    };

    if (!updateRequest.username && !updateRequest.email) {
      this.submitted = false;
      return;
    }

    this.authService.updateProfile(updateRequest).then(() => {
      this.submitted = false;
    });

    this.form.markAsPristine();
  }

  /**
   * Update password if changed
   * and confirmed
   */
  updatePassword(): void {
    this.passwordSubmitted = true;
    const updateRequest: IReqUserUpdate = {
      email: null,
      username: null,
      password:
        this.userObj.email && this.userObj.password_confirmation
          ? this.userObj.password
          : null
    };

    if (!updateRequest.password) {
      this.passwordSubmitted = false;
      return;
    }

    this.authService.updateProfile(updateRequest).then(() => {
      this.passwordSubmitted = false;
      this.passwordForm.controls.password.reset();
      this.passwordForm.controls.rePass.reset();
    });
  }
}
