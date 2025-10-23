import { Injectable } from '@angular/core';
import { Book } from '../book/book.service';

export interface CartItem {
  book: Book;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private cartItems: CartItem[] = [];

  constructor() {
    // Only access localStorage in browser environment
    if (typeof window !== 'undefined' && window.localStorage) {
      this.loadCartFromStorage();
    }
  }

  private loadCartFromStorage(): void {
    try {
      const savedCart = localStorage.getItem('bookstore-cart');
      if (savedCart) {
        this.cartItems = JSON.parse(savedCart);
      }
    } catch (error) {
      console.warn('Failed to load cart from localStorage:', error);
      this.cartItems = [];
    }
  }

  getCartItems(): CartItem[] {
    return [...this.cartItems];
  }

  addToCart(book: Book): void {
    const existingItem = this.cartItems.find(item => item.book.id === book.id);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      this.cartItems.push({ book, quantity: 1 });
    }
    this.saveCartToStorage();
  }

  updateQuantity(bookId: number, newQuantity: number): void {
    if (newQuantity <= 0) {
      this.removeFromCart(bookId);
      return;
    }

    const item = this.cartItems.find(item => item.book.id === bookId);
    if (item) {
      item.quantity = newQuantity;
      this.saveCartToStorage();
    }
  }

  removeFromCart(bookId: number): void {
    this.cartItems = this.cartItems.filter(item => item.book.id !== bookId);
    this.saveCartToStorage();
  }

  clearCart(): void {
    this.cartItems = [];
    this.saveCartToStorage();
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

  getItemCount(): number {
    return this.cartItems.reduce((total, item) => total + item.quantity, 0);
  }

  private saveCartToStorage(): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('bookstore-cart', JSON.stringify(this.cartItems));
      }
    } catch (error) {
      console.warn('Failed to save cart to localStorage:', error);
    }
  }
}
