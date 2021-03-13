import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StrapiAuthRoutingModule } from 'projects/strapi-auth/src/public-api';

@NgModule({
  declarations: [],
  imports: [CommonModule, StrapiAuthRoutingModule]
})
export class AuthModule {}
