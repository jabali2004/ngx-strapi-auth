import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import {
  NbCardModule,
  NbListModule,
  NbSearchModule,
  NbFormFieldModule,
  NbIconModule,
  NbInputModule,
  NbButtonModule,
  NbSelectModule,
  NbSpinnerModule,
  NbToggleModule,
  NbCheckboxModule,
  NbAccordionModule,
  NbAutocompleteModule,
  NbTooltipModule
} from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [HomeComponent],
  imports: [
    CommonModule,
    HomeRoutingModule,
    HttpClientModule,
    NbCardModule,
    NbListModule,
    NbEvaIconsModule,
    NbFormFieldModule,
    NbIconModule,
    NbInputModule,
    NbButtonModule,
    NbSelectModule,
    TranslateModule,
    NbSpinnerModule,
    NbToggleModule,
    NbCheckboxModule,
    NbAccordionModule,
    NbAutocompleteModule,
    NbTooltipModule
  ]
})
export class HomeModule {}
