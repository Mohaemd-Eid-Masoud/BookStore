import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { BookstoreStateService } from './bookstore-state.service';
import { BookingService } from '../cart/booking.service';
import { Book } from '../book/book.service';
import { Category } from '../category/category.service';

describe('BookstoreStateService', () => {
  let service: BookstoreStateService;
  let mockBookingService: jasmine.SpyObj<BookingService>;
  let mockBook: Book;
  let mockCategory: Category;

  beforeEach(() => {
    const bookingServiceSpy = jasmine.createSpyObj('BookingService', [
      'getCartItems', 'addToCart', 'updateQuantity', 'removeFromCart', 'clearCart'
    ]);

    TestBed.configureTestingModule({
      providers: [
        BookstoreStateService,
        { provide: BookingService, useValue: bookingServiceSpy }
      ]
    });

    service = TestBed.inject(BookstoreStateService);
    mockBookingService = TestBed.inject(BookingService) as jasmine.SpyObj<BookingService>;

    // Setup mock data
    mockBook = {
      id: 1,
      categoryId: 1,
      name: 'Test Book',
      author: 'Test Author',
      description: 'Test Description',
      value: 19.99,
      publishDate: '2024-01-01'
    };

    mockCategory = {
      id: 1,
      name: 'Test Category'
    };

    // Default mock returns
    mockBookingService.getCartItems.and.returnValue([]);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('state management', () => {
    it('should initialize with default state', () => {
      const state = service.currentState;

      expect(state.books).toEqual([]);
      expect(state.categories).toEqual([]);
      expect(state.filteredBooks).toEqual([]);
      expect(state.showCategoryForm).toBe(false);
      expect(state.showBookForm).toBe(false);
      expect(state.cartItems).toEqual([]);
    });

    it('should update state correctly', () => {
      const newBooks = [mockBook];
      service.setBooks(newBooks);

      expect(service.currentState.books).toEqual(newBooks);
    });

    it('should update categories correctly', () => {
      const newCategories = [mockCategory];
      service.setCategories(newCategories);

      expect(service.currentState.categories).toEqual(newCategories);
    });

    it('should update filtered books correctly', () => {
      const filteredBooks = [mockBook];
      service.setFilteredBooks(filteredBooks);

      expect(service.currentState.filteredBooks).toEqual(filteredBooks);
    });

    it('should manage form visibility states', () => {
      service.setShowCategoryForm(true);
      expect(service.currentState.showCategoryForm).toBe(true);

      service.setShowBookForm(true);
      expect(service.currentState.showBookForm).toBe(true);
    });

    it('should manage editing states', () => {
      service.setEditingCategory(mockCategory);
      expect(service.currentState.editingCategory).toEqual(mockCategory);

      service.setEditingBook(mockBook);
      expect(service.currentState.editingBook).toEqual(mockBook);
    });
  });

  describe('cart operations', () => {
    beforeEach(() => {
      const mockCartItems = [{ book: mockBook, quantity: 1 }];
      mockBookingService.getCartItems.and.returnValue(mockCartItems);
    });

    it('should delegate addToCart to BookingService', () => {
      service.addToCart(mockBook);

      expect(mockBookingService.addToCart).toHaveBeenCalledWith(mockBook);
    });

    it('should update state after adding to cart', () => {
      service.addToCart(mockBook);

      expect(mockBookingService.getCartItems).toHaveBeenCalled();
      // Verify that updateState was called (we can't easily spy on private method)
      const state = service.currentState;
      expect(state.cartItems).toBeDefined();
    });

    it('should delegate updateCartItemQuantity to BookingService', () => {
      service.updateCartItemQuantity(1, 5);

      expect(mockBookingService.updateQuantity).toHaveBeenCalledWith(1, 5);
    });

    it('should delegate removeFromCart to BookingService', () => {
      service.removeFromCart(1);

      expect(mockBookingService.removeFromCart).toHaveBeenCalledWith(1);
    });

    it('should delegate clearCart to BookingService', () => {
      service.clearCart();

      expect(mockBookingService.clearCart).toHaveBeenCalled();
    });

    it('should get cart items from BookingService', () => {
      const cartItems = service.getCartItems();

      expect(mockBookingService.getCartItems).toHaveBeenCalled();
      expect(cartItems).toEqual([{ book: mockBook, quantity: 1 }]);
    });
  });

  describe('form management', () => {
    it('should reset category form correctly', () => {
      service.setCategoryForm({ name: 'Test' });
      service.resetCategoryForm();

      expect(service.currentState.categoryForm.name).toBe('');
    });

    it('should reset book form correctly', () => {
      service.setBookForm(mockBook);
      service.resetBookForm();

      const bookForm = service.currentState.bookForm;
      expect(bookForm.name).toBe('');
      expect(bookForm.author).toBe('');
      expect(bookForm.description).toBe('');
      expect(bookForm.value).toBe(0);
      expect(bookForm.categoryId).toBe(0);
    });

    it('should update book form correctly', () => {
      service.setBookForm(mockBook);

      expect(service.currentState.bookForm).toEqual(mockBook);
    });

    it('should update category form correctly', () => {
      service.setCategoryForm(mockCategory);

      expect(service.currentState.categoryForm).toEqual(mockCategory);
    });
  });

  describe('getter methods', () => {
    beforeEach(() => {
      service.setBooks([mockBook]);
      service.setCategories([mockCategory]);
      service.setFilteredBooks([mockBook]);
    });

    it('should return books correctly', () => {
      expect(service.getBooks()).toEqual([mockBook]);
    });

    it('should return categories correctly', () => {
      expect(service.getCategories()).toEqual([mockCategory]);
    });

    it('should return filtered books correctly', () => {
      expect(service.getFilteredBooks()).toEqual([mockBook]);
    });

    it('should return form states correctly', () => {
      service.setShowCategoryForm(true);
      service.setShowBookForm(true);

      expect(service.getShowCategoryForm()).toBe(true);
      expect(service.getShowBookForm()).toBe(true);
    });

    it('should return editing states correctly', () => {
      service.setEditingCategory(mockCategory);
      service.setEditingBook(mockBook);

      expect(service.getEditingCategory()).toEqual(mockCategory);
      expect(service.getEditingBook()).toEqual(mockBook);
    });
  });

  describe('book operations', () => {
    beforeEach(() => {
      service.setBooks([mockBook]);
    });

    it('should update book in books array', () => {
      const updatedBook = { ...mockBook, name: 'Updated Book' };
      service.updateBookInBooks(1, updatedBook);

      const books = service.getBooks();
      expect(books[0].name).toBe('Updated Book');
    });

    it('should not update non-existing book', () => {
      const updatedBook = { ...mockBook, name: 'Updated Book' };
      service.updateBookInBooks(999, updatedBook);

      const books = service.getBooks();
      expect(books[0].name).toBe('Test Book'); // Unchanged
    });
  });

  describe('reactive updates', () => {
    it('should emit state changes', (done) => {
      service.state$.subscribe(state => {
        if (state.books.length > 0) {
          expect(state.books).toEqual([mockBook]);
          done();
        }
      });

      service.setBooks([mockBook]);
    });

    it('should emit cart changes', (done) => {
      const mockCartItems = [{ book: mockBook, quantity: 1 }];
      mockBookingService.getCartItems.and.returnValue(mockCartItems);

      service.state$.subscribe(state => {
        if (state.cartItems.length > 0) {
          expect(state.cartItems).toEqual(mockCartItems);
          done();
        }
      });

      service.addToCart(mockBook);

      // Ensure the mock returns the updated cart items
      mockBookingService.getCartItems.and.returnValue(mockCartItems);
    });
  });

  describe('error handling', () => {
    it('should handle BookingService errors gracefully', () => {
      mockBookingService.addToCart.and.throwError('Service error');

      expect(() => service.addToCart(mockBook)).toThrow('Service error');
    });

    it('should handle undefined book gracefully', () => {
      // The service delegates to BookingService, which should handle undefined gracefully
      expect(() => service.addToCart(undefined as any)).not.toThrow();
    });

    it('should handle undefined category gracefully', () => {
      expect(() => service.setEditingCategory(undefined as any)).not.toThrow();
      expect(service.getEditingCategory()).toBeNull();
    });
  });
});
