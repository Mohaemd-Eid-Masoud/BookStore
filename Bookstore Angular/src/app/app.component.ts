import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';
import { NotificationService } from './shared/services/notification/notification.service';
import { BookstoreStateService } from './shared/services/state/bookstore-state.service';
import { Subscription } from 'rxjs';
import { NotificationComponent } from './shared/components/notification/notification.component';
import { ConfirmationModalComponent } from './shared/components/confirmation-modal/confirmation-modal.component';
import { SharedModule } from './shared/shared.module';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterOutlet, NotificationComponent, ConfirmationModalComponent, SharedModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'bookstore';
  cartItemCount = 0;
  private cartSubscription?: Subscription;

  constructor(private stateService: BookstoreStateService, private notificationService: NotificationService) {}

  ngOnInit(): void {
    // Test notification system
    this.notificationService.success('Welcome!', 'Notification system is working!');

    // Subscribe to cart changes to update the counter
    this.cartSubscription = this.stateService.state$.subscribe((state) => {
      const newCount = state.cartItems.reduce((total, item) => total + item.quantity, 0);
      console.log('Cart count updated:', newCount);
      this.cartItemCount = newCount;
    });

    // Initialize the count
    const initialCount = this.stateService.getCartItems().reduce((total, item) => total + item.quantity, 0);
    this.cartItemCount = initialCount;
    console.log('Initial cart count:', this.cartItemCount);
  }

  ngOnDestroy(): void {
    this.cartSubscription?.unsubscribe();
  }
}