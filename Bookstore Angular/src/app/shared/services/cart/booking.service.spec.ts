import { TestBed } from '@angular/core/testing';
import { BookingService, CartItem } from './booking.service';
import { Book } from '../book/book.service';

// Mock localStorage
const localStorageMock = {
  getItem: jasmine.createSpy('getItem'),
  setItem: jasmine.createSpy('setItem'),
  removeItem: jasmine.createSpy('removeItem'),
  clear: jasmine.createSpy('clear')
};

// Mock window object
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

describe('BookingService', () => {
  let service: BookingService;
  let mockBook1: Book;
  let mockBook2: Book;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BookingService);

    // Setup mock books
    mockBook1 = {
      id: 1,
      categoryId: 1,
      name: 'Test Book 1',
      author: 'Test Author 1',
      description: 'Test Description 1',
      value: 19.99,
      publishDate: '2024-01-01'
    };

    mockBook2 = {
      id: 2,
      categoryId: 2,
      name: 'Test Book 2',
      author: 'Test Author 2',
      description: 'Test Description 2',
      value: 29.99,
      publishDate: '2024-02-01'
    };

    // Reset localStorage mocks
    localStorageMock.getItem.calls.reset();
    localStorageMock.setItem.calls.reset();
    localStorageMock.removeItem.calls.reset();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('addToCart', () => {
    it('should add a new book to cart', () => {
      service.addToCart(mockBook1);

      const cartItems = service.getCartItems();
      expect(cartItems).toHaveSize(1);
      expect(cartItems[0].book).toEqual(mockBook1);
      expect(cartItems[0].quantity).toBe(1);
      expect(localStorageMock.setItem).toHaveBeenCalledWith('bookstore-cart', jasmine.any(String));
    });

    it('should increase quantity when adding existing book', () => {
      service.addToCart(mockBook1);
      service.addToCart(mockBook1);

      const cartItems = service.getCartItems();
      expect(cartItems).toHaveSize(1);
      expect(cartItems[0].quantity).toBe(2);
    });

    it('should handle books without id', () => {
      const bookWithoutId = { ...mockBook1, id: undefined };

      service.addToCart(bookWithoutId);

      const cartItems = service.getCartItems();
      expect(cartItems).toHaveSize(1);
      expect(cartItems[0].book).toEqual(bookWithoutId);
    });
  });

  describe('updateQuantity', () => {
    beforeEach(() => {
      service.addToCart(mockBook1);
    });

    it('should update quantity of existing item', () => {
      service.updateQuantity(1, 3);

      const cartItems = service.getCartItems();
      expect(cartItems[0].quantity).toBe(3);
      expect(localStorageMock.setItem).toHaveBeenCalled();
    });

    it('should remove item when quantity is 0 or negative', () => {
      service.updateQuantity(1, 0);

      const cartItems = service.getCartItems();
      expect(cartItems).toHaveSize(0);
    });

    it('should not update non-existing item', () => {
      service.updateQuantity(999, 5);

      const cartItems = service.getCartItems();
      expect(cartItems[0].quantity).toBe(1); // Unchanged
    });
  });

  describe('removeFromCart', () => {
    beforeEach(() => {
      service.addToCart(mockBook1);
      service.addToCart(mockBook2);
    });

    it('should remove specific item from cart', () => {
      service.removeFromCart(1);

      const cartItems = service.getCartItems();
      expect(cartItems).toHaveSize(1);
      expect(cartItems[0].book.id).toBe(2);
      expect(localStorageMock.setItem).toHaveBeenCalled();
    });

    it('should not remove non-existing item', () => {
      service.removeFromCart(999);

      const cartItems = service.getCartItems();
      expect(cartItems).toHaveSize(2); // Unchanged
    });
  });

  describe('clearCart', () => {
    beforeEach(() => {
      service.addToCart(mockBook1);
      service.addToCart(mockBook2);
    });

    it('should clear all items from cart', () => {
      service.clearCart();

      const cartItems = service.getCartItems();
      expect(cartItems).toHaveSize(0);
      expect(localStorageMock.setItem).toHaveBeenCalledWith('bookstore-cart', '[]');
    });
  });

  describe('getSubtotal', () => {
    it('should calculate correct subtotal for empty cart', () => {
      expect(service.getSubtotal()).toBe(0);
    });

    it('should calculate correct subtotal for single item', () => {
      service.addToCart(mockBook1);
      expect(service.getSubtotal()).toBe(19.99);
    });

    it('should calculate correct subtotal for multiple items', () => {
      service.addToCart(mockBook1);
      service.addToCart(mockBook2);
      service.addToCart(mockBook1); // Add another copy of book1

      expect(service.getSubtotal()).toBe(69.97); // 19.99 * 2 + 29.99
    });
  });

  describe('getTax', () => {
    it('should calculate 10% tax correctly', () => {
      service.addToCart(mockBook1);
      expect(service.getTax()).toBe(1.999); // 10% of 19.99
    });

    it('should return 0 for empty cart', () => {
      expect(service.getTax()).toBe(0);
    });
  });

  describe('getTotal', () => {
    it('should calculate total with tax', () => {
      service.addToCart(mockBook1);
      expect(service.getTotal()).toBe(21.989); // 19.99 + 1.999 (tax)
    });
  });

  describe('getItemCount', () => {
    it('should return 0 for empty cart', () => {
      expect(service.getItemCount()).toBe(0);
    });

    it('should return correct count for single item', () => {
      service.addToCart(mockBook1);
      expect(service.getItemCount()).toBe(1);
    });

    it('should return correct count for multiple quantities', () => {
      service.addToCart(mockBook1);
      service.addToCart(mockBook1);
      service.addToCart(mockBook2);

      expect(service.getItemCount()).toBe(3); // 2 + 1
    });
  });

  describe('localStorage integration', () => {
    it('should load cart from localStorage on initialization', () => {
      const mockCartData = JSON.stringify([{ book: mockBook1, quantity: 2 }]);
      localStorageMock.getItem.and.returnValue(mockCartData);

      // Create new service instance to test initialization
      const newService = new (BookingService as any)();

      const cartItems = newService.getCartItems();
      expect(cartItems).toHaveSize(1);
      expect(cartItems[0].quantity).toBe(2);
    });

    it('should handle corrupted localStorage data', () => {
      localStorageMock.getItem.and.returnValue('invalid json');

      // Should not throw error and initialize empty cart
      const newService = new (BookingService as any)();
      expect(newService.getCartItems()).toHaveSize(0);
    });

    it('should handle localStorage access errors gracefully', () => {
      localStorageMock.getItem.and.throwError('localStorage error');

      // Should not throw error and initialize empty cart
      const newService = new (BookingService as any)();
      expect(newService.getCartItems()).toHaveSize(0);
    });

    it('should save cart to localStorage when modified', () => {
      service.addToCart(mockBook1);

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'bookstore-cart',
        jasmine.stringMatching(/bookstore-cart/)
      );
    });

    it('should handle localStorage save errors gracefully', () => {
      localStorageMock.setItem.and.throwError('Storage full');

      // Should not throw error
      expect(() => service.addToCart(mockBook1)).not.toThrow();
    });
  });

  describe('edge cases', () => {
    it('should handle undefined book gracefully', () => {
      expect(() => service.addToCart(undefined as any)).toThrow();
    });

    it('should handle book with zero value', () => {
      const zeroValueBook = { ...mockBook1, value: 0 };

      service.addToCart(zeroValueBook);

      expect(service.getSubtotal()).toBe(0);
      expect(service.getTotal()).toBe(0);
    });

    it('should handle very large quantities', () => {
      service.addToCart(mockBook1);

      service.updateQuantity(1, 1000);

      const cartItems = service.getCartItems();
      expect(cartItems[0].quantity).toBe(1000);
      expect(service.getItemCount()).toBe(1000);
    });
  });
});
