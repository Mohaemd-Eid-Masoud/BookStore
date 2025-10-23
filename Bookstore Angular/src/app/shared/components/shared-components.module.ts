import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BookCardComponent } from './book-card/book-card.component';
import { CardComponent } from './card/card.component';
import { NotificationComponent } from './notification/notification.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    BookCardComponent,
    CardComponent,
    NotificationComponent
  ],
  exports: [
    BookCardComponent,
    CardComponent,
    NotificationComponent
  ]
})
export class SharedComponentsModule { }
