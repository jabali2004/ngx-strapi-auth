import { CommonModule } from '@angular/common';
import { ModuleWithProviders } from '@angular/core';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { StrapiAuthRoutingModule } from './routing/strapi-auth-routing.module';
import { AuthService } from './services/auth/auth.service';
import { ConfigServiceInjector } from './services/config/config.service';
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
import { TokenService } from './services/token/token.service';
import { ProfileBaseComponent } from './components/base-components/profile-base/profile-base.component';
import { DefaultProfileComponent } from './components/default-components/default-profile/default-profile.component';

@NgModule({
  declarations: [
    ValidationComponent,
    DynamicComponentDirective,
    DefaultLoginComponent,
    DefaultRegisterComponent,
    DefaultLogoutComponent,
    DefaultRequestPasswordComponent,
    DefaultResetPasswordComponent,
    DefaultProfileComponent,
    LoginBaseComponent,
    RegisterBaseComponent,
    LogoutBaseComponent,
    RequestPasswordBaseComponent,
    ResetPasswordBaseComponent,
    ProfileBaseComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    TranslateModule
  ],
  exports: [
    ValidationComponent,
    DefaultLoginComponent,
    DefaultRegisterComponent,
    DefaultLogoutComponent,
    DefaultRequestPasswordComponent,
    DefaultResetPasswordComponent,
    DefaultProfileComponent,
    LoginBaseComponent,
    RegisterBaseComponent,
    LogoutBaseComponent,
    RequestPasswordBaseComponent,
    ResetPasswordBaseComponent,
    ProfileBaseComponent
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
        TokenService,
        AuthInterceptor,
        LanguageService,
        {
          provide: ConfigServiceInjector,
          useValue: config
        }
      ]
    };
  }
}
