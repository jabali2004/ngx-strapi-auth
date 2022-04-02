import { NgModule } from '@angular/core';
import type { Routes} from '@angular/router';
import { RouterModule } from '@angular/router';
import { PagesComponent } from './pages.component';
import { NotFoundComponent } from './miscellaneous/not-found/not-found.component';
import {
  AuthGuard,
  ProfileComponent
} from 'projects/strapi-auth/src/public-api';

const routes: Routes = [
  {
    path: '',
    component: PagesComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'home'
      },
      {
        path: 'home',
        loadChildren: () =>
          import('./home/home.module').then((m) => m.HomeModule)
      },
      {
        path: 'profile',
        canActivate: [AuthGuard],
        component: ProfileComponent
      },
      {
        path: '**',
        component: NotFoundComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule {}
