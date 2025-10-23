import { NgModule } from '@angular/core';

import { SharedComponentsModule } from './components/shared-components.module';
import { SharedServicesModule } from './services/shared-services.module';

@NgModule({
  imports: [
    SharedComponentsModule,
    SharedServicesModule
  ],
  exports: [
    SharedComponentsModule,
    SharedServicesModule
  ]
})
export class SharedModule { }
