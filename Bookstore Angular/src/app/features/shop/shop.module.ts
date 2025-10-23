import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { SharedComponentsModule } from '../../shared/components/shared-components.module';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    SharedComponentsModule,
    SharedModule
  ],
  exports: []
})
export class ShopModule { }
