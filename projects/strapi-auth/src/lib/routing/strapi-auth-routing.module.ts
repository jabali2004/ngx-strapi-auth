import { NgModule } from '@angular/core';
import { Routes } from '@angular/router';
import { RouterModule } from '@angular/router';
import { AuthComponentsComponent } from '../components/auth-components/auth-components.component';
import { LoginComponent } from '../components/auth-components/login/login.component';
import { LogoutComponent } from '../components/auth-components/logout/logout.component';
import { RegisterComponent } from '../components/auth-components/register/register.component';
import { RequestPasswordComponent } from '../components/auth-components/request-password/request-password.component';
import { ResetPasswordComponent } from '../components/auth-components/reset-password/reset-password.component';
import { TokenGuard } from '../guards/token/token.guard';

const routes: Routes = [
  {
    path: '',
    component: AuthComponentsComponent,
    children: [
      {
        path: 'login',
        component: LoginComponent
      },
      {
        path: 'register',
        component: RegisterComponent
      },
      {
        path: 'logout',
        component: LogoutComponent
      },
      {
        path: 'request-password',
        component: RequestPasswordComponent
      },
      {
        path: 'reset-password',
        component: ResetPasswordComponent
      },
      {
        path: 'providers',
        canActivateChild: [TokenGuard],
        children: [
          {
            path: 'github'
          },
          {
            path: 'google'
          },
          {
            path: 'microsoft'
          }
          // TODO: Add more providers
        ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StrapiAuthRoutingModule {}
