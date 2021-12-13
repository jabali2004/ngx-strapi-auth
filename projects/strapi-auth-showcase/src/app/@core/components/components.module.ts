import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  NbCardModule,
  NbInputModule,
  NbButtonModule,
  NbSelectModule,
  NbToggleModule,
  NbCheckboxModule,
  NbStepperModule,
  NbTooltipModule
} from '@nebular/theme';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AbstractDialogComponent } from './dialogs/abstract-dialog/abstract-dialog.component';

@NgModule({
    declarations: [AbstractDialogComponent],
    imports: [
        CommonModule,
        NbCardModule,
        TranslateModule,
        NbInputModule,
        NbButtonModule,
        FormsModule,
        ReactiveFormsModule,
        NbSelectModule,
        NbToggleModule,
        NbCheckboxModule,
        NbStepperModule,
        NbTooltipModule,
    ],
    exports: [AbstractDialogComponent]
})
export class ComponentsModule {}
