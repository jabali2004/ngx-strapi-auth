import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../../services/auth/auth.service';
import { IReqAuthRegister } from '../../../types/requests/ReqAuthRegister';
import Validation from '../../../utils/validation';

@Component({
  selector: 'strapi-register-base',
  template: ''
})
export class RegisterBaseComponent implements OnInit {
  public registerReq: IReqAuthRegister;
  public formGroup: FormGroup = new FormGroup(
    {
      email: new FormControl('', [Validators.required, Validators.email]),
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
      passwordConfirmation: new FormControl('', [Validators.required])
    },
    {
      validators: [Validation.match('password', 'passwordConfirmation')]
    }
  );

  constructor(
    protected router: Router,
    protected authService: AuthService,
    protected translate: TranslateService
  ) {}

  ngOnInit(): void {
    if (this.authService.AuthState) {
      this.authService.logout();
    }
  }

  public register(): void {
    this.registerReq = this.formGroup.value;

    this.authService
      .register(this.registerReq)
      .then(() => {
        this.router.navigateByUrl(this.authService.LoginUrl);
      })
      .catch((error: HttpErrorResponse) => {
        console.log(error);
      });

    // this.authService
    //   .register(
    //     this.authRegisterReq.email,
    //     this.authRegisterReq.username,
    //     this.authRegisterReq.password
    //   )
    //   .then(() => {
    //     this.router.navigateByUrl(this.authService.LoginUrl);
    //   })
    //   .catch((error: HttpErrorResponse) => {
    //     this.submitted = false;
    //     if (error.status === 400) {
    //       this.errors.push(
    //         this.translate.instant('errors.auth.register.password_or_email')
    //       );
    //     } else {
    //       this.errors.push(
    //         this.translate.instant('errors.auth.register.undefined')
    //       );
    //     }
    //   });
  }
}
