import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';
import { Book } from '../book/book.service';

export interface CartItem {
  book: Book;
  quantity: number;
  addedAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
  public cartItems$ = this.cartItemsSubject.asObservable();
  private platformId = inject(PLATFORM_ID);

  private readonly STORAGE_KEY = 'bookstore-cart';
  private isBrowser: boolean;

  constructor() {
    this.isBrowser = isPlatformBrowser(this.platformId);
    console.log('CartService initialized, isBrowser:', this.isBrowser);
    if (this.isBrowser) {
      this.loadCartFromStorage();
    }
  }

  private loadCartFromStorage(): void {
    if (!this.isBrowser || typeof localStorage === 'undefined') {
      console.log('Cannot load cart - not in browser or localStorage not available');
      return;
    }

    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      console.log('Loading cart from storage:', stored);
      if (stored) {
        const items = JSON.parse(stored);
        // Convert date strings back to Date objects
        const cartItems = items.map((item: any) => ({
          ...item,
          addedAt: new Date(item.addedAt)
        }));
        console.log('Parsed cart items:', cartItems.length);
        this.cartItemsSubject.next(cartItems);
      } else {
        console.log('No stored cart found');
      }
    } catch (error) {
      console.error('Error loading cart from storage:', error);
      this.cartItemsSubject.next([]);
    }
  }

  private saveCartToStorage(items: CartItem[]): void {
    if (!this.isBrowser || typeof localStorage === 'undefined') return;

    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.error('Error saving cart to storage:', error);
    }
  }

  addToCart(book: Book, quantity: number = 1): void {
    console.log('Adding to cart - before:', book.name, 'current count:', this.getCartCount());
    const currentItems = this.cartItemsSubject.value;
    const existingItem = currentItems.find(item => item.book.id === book.id);

    let updatedItems: CartItem[];

    if (existingItem) {
      // Update quantity of existing item
      updatedItems = currentItems.map(item =>
        item.book.id === book.id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
    } else {
      // Add new item
      const newItem: CartItem = {
        book,
        quantity,
        addedAt: new Date()
      };
      updatedItems = [...currentItems, newItem];
    }

    console.log('Cart updated, new count:', this.getCartCountFromArray(updatedItems));
    this.cartItemsSubject.next(updatedItems);
    this.saveCartToStorage(updatedItems);
  }

  private getCartCountFromArray(items: CartItem[]): number {
    return items.reduce((total, item) => total + item.quantity, 0);
  }

  removeFromCart(bookId: number): void {
    const currentItems = this.cartItemsSubject.value;
    const updatedItems = currentItems.filter(item => item.book.id !== bookId);

    this.cartItemsSubject.next(updatedItems);
    this.saveCartToStorage(updatedItems);
  }

  updateQuantity(bookId: number, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(bookId);
      return;
    }

    const currentItems = this.cartItemsSubject.value;
    const updatedItems = currentItems.map(item =>
      item.book.id === bookId
        ? { ...item, quantity }
        : item
    );

    this.cartItemsSubject.next(updatedItems);
    this.saveCartToStorage(updatedItems);
  }

  clearCart(): void {
    this.cartItemsSubject.next([]);
    if (this.isBrowser && typeof localStorage !== 'undefined') {
      localStorage.removeItem(this.STORAGE_KEY);
    }
  }

  getCartItems(): CartItem[] {
    return this.cartItemsSubject.value;
  }

  getCartCount(): number {
    return this.getCartCountFromArray(this.cartItemsSubject.value);
  }

  getCartTotal(): number {
    return this.cartItemsSubject.value.reduce((total, item) => total + (item.book.value * item.quantity), 0);
  }

  isInCart(bookId: number): boolean {
    return this.cartItemsSubject.value.some(item => item.book.id === bookId);
  }

  getItemQuantity(bookId: number): number {
    const item = this.cartItemsSubject.value.find(item => item.book.id === bookId);
    return item ? item.quantity : 0;
  }
}
