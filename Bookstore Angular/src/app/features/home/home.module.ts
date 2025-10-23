import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { SharedComponentsModule } from '../../shared/components/shared-components.module';
import { SharedModule } from '../../shared/shared.module';
import { BookService } from  '../../shared/services/book/book.service';

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
export class HomeModule { }
