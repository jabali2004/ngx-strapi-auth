import {
  NgModule,
  ModuleWithProviders,
  SkipSelf,
  Optional
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { throwIfAlreadyLoaded } from './module-import-guard';
import { ComponentsModule } from './components/components.module';
import { LayoutService } from './utils';

@NgModule({
  declarations: [],
  imports: [CommonModule, ComponentsModule],
  exports: [ComponentsModule],
  providers: []
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    throwIfAlreadyLoaded(parentModule, 'CoreModule');
  }

  static forRoot(): ModuleWithProviders<CoreModule> {
    return {
      ngModule: CoreModule,
      providers: [LayoutService]
    } as ModuleWithProviders<CoreModule>;
  }
}
