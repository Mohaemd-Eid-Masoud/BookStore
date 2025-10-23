import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookstoreStateService } from '../../shared/services/state/bookstore-state.service';
import { Book } from '../../shared/services/book/book.service';
import { Category } from '../../shared/services/category/category.service';
import { Subscription } from 'rxjs';
import { Router, RouterModule } from '@angular/router';
import { NotificationComponent } from '../../shared/components/notification/notification.component';
import { ConfirmationModalComponent } from '../../shared/components/confirmation-modal/confirmation-modal.component';
import { ConfirmationService } from '../../shared/services/ui/confirmation.service'
import { NotificationService } from '../../shared/services/notification/notification.service'
@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NotificationComponent, ConfirmationModalComponent],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit, OnDestroy {
  cartItems: { book: Book, quantity: number }[] = [];
  categories: Category[] = [];

  private subscription: Subscription = new Subscription();

  constructor(private stateService: BookstoreStateService, private router: Router, private notificationService: NotificationService, private confirmationService: ConfirmationService) {}

  ngOnInit() {
    this.subscription.add(
      this.stateService.state$.subscribe(state => {
        this.cartItems = state.cartItems;
        this.categories = state.categories;
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  updateQuantity(index: number, newQuantity: number) {
    if (newQuantity > 0) {
      const bookId = this.cartItems[index]?.book?.id;
      if (bookId !== undefined) {
        this.stateService.updateCartItemQuantity(bookId, newQuantity);
        const bookName = this.cartItems[index]?.book?.name || 'Item';
        this.notificationService.info(
          'Quantity Updated',
          `Quantity of "${bookName}" updated to ${newQuantity}.`
        );
      }
    }
  }

  async removeFromCart(index: number) {
    const book = this.cartItems[index]?.book;
    if (!book) return;

    const result = await this.confirmationService.confirmDelete(book.name);

    if (result.confirmed) {
      const bookId = book.id;
      if (bookId !== undefined) {
        this.stateService.removeFromCart(bookId);
        this.notificationService.success(
          'Removed from Cart',
          `"${book.name}" has been removed from your cart.`
        );
      }
    }
  }

  getSubtotal(): number {
    return this.cartItems.reduce((total, item) => total + (item.book.value * item.quantity), 0);
  }

  getTax(): number {
    return this.getSubtotal() * 0.1; // 10% tax
  }

  getTotal(): number {
    return this.getSubtotal() + this.getTax();
  }

  async buyCart() {
    const total = this.getTotal();

    const result = await this.confirmationService.confirmCustomAction(
      'Confirm Purchase',
      `Are you sure you want to complete your purchase totaling $${total.toFixed(2)}? This will clear your cart.`,
      'Purchase'
    );

    if (result.confirmed) {
      this.notificationService.success(
        'Order Completed!',
        `Thank you for your purchase! Your order totaling $${total.toFixed(2)} has been processed successfully.`
      );
      this.stateService.clearCart();
      this.router.navigate(['/']);
    }
  }

  goBack() {
    this.router.navigate(['/']);
  }
}
