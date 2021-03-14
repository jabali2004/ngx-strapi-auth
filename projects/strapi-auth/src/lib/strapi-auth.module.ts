import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import {
  NbCardModule,
  NbLayoutModule,
  NbInputModule,
  NbButtonModule,
  NbIconModule,
  NbCheckboxModule,
  NbSpinnerModule,
  NbAlertModule,
  NbActionsModule,
  NbListModule,
  NbRadioModule,
  NbSelectModule
} from '@nebular/theme';
import { TranslateModule } from '@ngx-translate/core';
import { AuthBlockComponent } from './components/auth-components/auth-block/auth-block.component';
import { AuthComponentsComponent } from './components/auth-components/auth-components.component';
import { LoginComponent } from './components/auth-components/login/login.component';
import { LogoutComponent } from './components/auth-components/logout/logout.component';
import { RegisterComponent } from './components/auth-components/register/register.component';
import { RequestPasswordComponent } from './components/auth-components/request-password/request-password.component';
import { ResetPasswordComponent } from './components/auth-components/reset-password/reset-password.component';
import { ProfileComponent } from './components/profile/profile.component';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { StrapiAuthRoutingModule } from './routing/strapi-auth-routing.module';
import { AuthService } from './services/auth.service';
import { ConfigService } from './services/config.service';
import { StrapiAuthConfig } from './types/StrapiAuthConfig';

@NgModule({
  declarations: [
    AuthComponentsComponent,
    LoginComponent,
    LogoutComponent,
    RegisterComponent,
    RequestPasswordComponent,
    ResetPasswordComponent,
    AuthBlockComponent,
    ProfileComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    StrapiAuthRoutingModule,
    RouterModule,
    NbCardModule,
    NbLayoutModule,
    NbInputModule,
    NbButtonModule,
    NbCardModule,
    NbIconModule,
    NbCheckboxModule,
    NbSpinnerModule,
    NbAlertModule,
    NbSpinnerModule,
    NbActionsModule,
    NbRadioModule,
    NbSelectModule,
    NbListModule,
    TranslateModule
  ],
  exports: [
    AuthComponentsComponent,
    LoginComponent,
    LogoutComponent,
    RegisterComponent,
    RequestPasswordComponent,
    ResetPasswordComponent,
    AuthBlockComponent,
    ProfileComponent
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
        {
          provide: ConfigService,
          useValue: config
        }
      ]
    };
  }
}
