import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { SharedComponentsModule } from '../../shared/components/shared-components.module';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule,
    SharedComponentsModule,
    SharedModule
  ],
  exports: []
})
export class AboutModule { }
