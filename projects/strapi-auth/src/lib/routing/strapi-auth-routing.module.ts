import { NgModule } from '@angular/core';
import { Routes } from '@angular/router';
import { RouterModule } from '@angular/router';
import { DefaultLoginComponent } from '../components/default-components/default-login/default-login.component';
import { DefaultLogoutComponent } from '../components/default-components/default-logout/default-logout.component';
import { DefaultRegisterComponent } from '../components/default-components/default-register/default-register.component';
import { DefaultRequestPasswordComponent } from '../components/default-components/default-request-password/default-request-password.component';
import { DefaultResetPasswordComponent } from '../components/default-components/default-reset-password/default-reset-password.component';
import { TokenGuard } from '../guards/token/token.guard';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'login',
        component: DefaultLoginComponent
      },
      {
        path: 'register',
        component: DefaultRegisterComponent
      },
      {
        path: 'logout',
        component: DefaultLogoutComponent
      },
      {
        path: 'request-password',
        component: DefaultRequestPasswordComponent
      },
      {
        path: 'reset-password',
        component: DefaultResetPasswordComponent
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
