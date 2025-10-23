import { NgModule } from '@angular/core';

import { BookService } from './book/book.service';
import { CategoryService } from './category/category.service';
import { BookstoreStateService } from './state/bookstore-state.service';
import { NotificationService } from './notification/notification.service';
import { SEOService } from './seo/seo.service';
import { BookingService } from './cart/booking.service';
import { ConfirmationService } from './ui/confirmation.service';

@NgModule({
  providers: [
    BookService,
    CategoryService,
    BookstoreStateService,
    NotificationService,
    SEOService,
    BookingService,
    ConfirmationService
  ]
})
export class SharedServicesModule { }
