import { CommonModule } from '@angular/common';
import { ModuleWithProviders } from '@angular/core';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ProfileComponent } from './components/profile/profile.component';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { StrapiAuthRoutingModule } from './routing/strapi-auth-routing.module';
import { AuthService } from './services/auth/auth.service';
import { ConfigService } from './services/config/config.service';
import { LanguageService } from './services/language/language.service';
import { StrapiAuthConfig } from './types/StrapiAuthConfig';
import { ValidationComponent } from './components/validation/validation.component';
import { DynamicComponentDirective } from './directives/dynamic-component.directive';
import { DefaultLoginComponent } from './components/default-components/default-login/default-login.component';
import { DefaultRegisterComponent } from './components/default-components/default-register/default-register.component';
import { DefaultLogoutComponent } from './components/default-components/default-logout/default-logout.component';
import { DefaultRequestPasswordComponent } from './components/default-components/default-request-password/default-request-password.component';
import { DefaultResetPasswordComponent } from './components/default-components/default-reset-password/default-reset-password.component';
import { LoginBaseComponent } from './components/base-components/login-base/login-base.component';
import { RegisterBaseComponent } from './components/base-components/register-base/register-base.component';
import { LogoutBaseComponent } from './components/base-components/logout-base/logout-base.component';
import { RequestPasswordBaseComponent } from './components/base-components/request-password-base/request-password-base.component';
import { ResetPasswordBaseComponent } from './components/base-components/reset-password-base/reset-password-base.component';

@NgModule({
  declarations: [
    ProfileComponent,
    ValidationComponent,
    DynamicComponentDirective,
    DefaultLoginComponent,
    DefaultRegisterComponent,
    DefaultLogoutComponent,
    DefaultRequestPasswordComponent,
    DefaultResetPasswordComponent,
    LoginBaseComponent,
    RegisterBaseComponent,
    LogoutBaseComponent,
    RequestPasswordBaseComponent,
    ResetPasswordBaseComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    TranslateModule
  ],
  exports: [
    ProfileComponent,
    ValidationComponent,
    DefaultLoginComponent,
    DefaultRegisterComponent,
    DefaultLogoutComponent,
    DefaultRequestPasswordComponent,
    DefaultResetPasswordComponent,
    LoginBaseComponent,
    RegisterBaseComponent,
    LogoutBaseComponent,
    RequestPasswordBaseComponent,
    ResetPasswordBaseComponent
  ]
})
export class StrapiAuthModule {
  static forRoot(
    config: StrapiAuthConfig
  ): ModuleWithProviders<StrapiAuthModule> {
    return {
      ngModule: StrapiAuthModule,
      providers: [
        AuthService,
        AuthInterceptor,
        LanguageService,
        {
          provide: ConfigService,
          useValue: config
        }
      ]
    };
  }
}
