import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { of } from 'rxjs';

import { AdminComponent } from './admin.component';
import { BookService, Book } from '../../shared/services/book/book.service';
import { CategoryService, Category } from '../../shared/services/category/category.service';
import { BookstoreStateService } from '../../shared/services/state/bookstore-state.service';
import { NotificationService } from '../../shared/services/notification/notification.service';
import { CardComponent } from '../../shared/components/card/card.component';

describe('AdminComponent', () => {
  let component: AdminComponent;
  let fixture: ComponentFixture<AdminComponent>;
  let mockBookService: jasmine.SpyObj<BookService>;
  let mockCategoryService: jasmine.SpyObj<CategoryService>;
  let mockStateService: jasmine.SpyObj<BookstoreStateService>;
  let mockNotificationService: jasmine.SpyObj<NotificationService>;

  let mockBook: Book;
  let mockCategory: Category;

  beforeEach(async () => {
    const bookServiceSpy = jasmine.createSpyObj('BookService', [
      'getBooks', 'createBook', 'updateBook', 'deleteBook'
    ]);
    const categoryServiceSpy = jasmine.createSpyObj('CategoryService', [
      'getCategories', 'createCategory', 'updateCategory', 'deleteCategory'
    ]);
    const stateServiceSpy = jasmine.createSpyObj('BookstoreStateService', [
      'setBooks', 'setCategories', 'setFilteredBooks', 'addToCart', 'getCartItems',
      'setShowCategoryForm', 'setShowBookForm', 'setEditingCategory', 'setEditingBook',
      'setCategoryForm', 'setBookForm', 'resetCategoryForm', 'resetBookForm'
    ]);
    const notificationServiceSpy = jasmine.createSpyObj('NotificationService', ['success']);

    await TestBed.configureTestingModule({
      imports: [
        AdminComponent,
        CardComponent,
        FormsModule,
        RouterTestingModule
      ],
      providers: [
        { provide: BookService, useValue: bookServiceSpy },
        { provide: CategoryService, useValue: categoryServiceSpy },
        { provide: BookstoreStateService, useValue: stateServiceSpy },
        { provide: NotificationService, useValue: notificationServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminComponent);
    component = fixture.componentInstance;

    mockBookService = TestBed.inject(BookService) as jasmine.SpyObj<BookService>;
    mockCategoryService = TestBed.inject(CategoryService) as jasmine.SpyObj<CategoryService>;
    mockStateService = TestBed.inject(BookstoreStateService) as jasmine.SpyObj<BookstoreStateService>;
    mockNotificationService = TestBed.inject(NotificationService) as jasmine.SpyObj<NotificationService>;

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
    mockBookService.getBooks.and.returnValue(of([mockBook]));
    mockCategoryService.getCategories.and.returnValue(of([mockCategory]));
    mockStateService.getCartItems.and.returnValue([]);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should initialize component and load data', () => {
      component.ngOnInit();

      expect(mockBookService.getBooks).toHaveBeenCalled();
      expect(mockCategoryService.getCategories).toHaveBeenCalled();
    });

    it('should subscribe to state changes', () => {
      spyOn(mockStateService.state$, 'subscribe');

      component.ngOnInit();

      expect(mockStateService.state$.subscribe).toHaveBeenCalled();
    });
  });

  describe('addToCart', () => {
    beforeEach(() => {
      component.books = [mockBook];
      component.ngOnInit();

      // Setup proper cart state mock that updates after addToCart
      const mockCartItem = { book: mockBook, quantity: 1 };
      mockStateService.getCartItems.and.returnValue([mockCartItem]);
      mockStateService.addToCart.and.callFake((book: Book) => {
        // Simulate adding to cart
        const updatedCartItem = { book, quantity: 1 };
        mockStateService.getCartItems.and.returnValue([updatedCartItem]);
      });
    });

    it('should add book to cart via state service', () => {
      component.addToCart(mockBook);

      expect(mockStateService.addToCart).toHaveBeenCalledWith(mockBook);
    });

    it('should show success notification', () => {
      component.addToCart(mockBook);

      expect(mockNotificationService.success).toHaveBeenCalledWith(
        'Added to Cart!',
        `"${mockBook.name}" by ${mockBook.author} has been added to your cart.`
      );
    });

    it('should set loading state', () => {
      component.addToCart(mockBook);

      expect(component.addingToCartBookId).toBe(1);
    });

    it('should clear loading state after delay', (done) => {
      component.addToCart(mockBook);

      setTimeout(() => {
        expect(component.addingToCartBookId).toBeNull();
        done();
      }, 1100);
    });

    it('should handle undefined book id', () => {
      const bookWithoutId = { ...mockBook, id: undefined };

      component.addToCart(bookWithoutId);

      expect(mockStateService.addToCart).toHaveBeenCalledWith(bookWithoutId);
      expect(component.addingToCartBookId).toBeNull();
    });

    it('should log cart state for debugging', () => {
      spyOn(console, 'log');

      component.addToCart(mockBook);

      expect(console.log).toHaveBeenCalledWith('Adding to cart:', mockBook.name);
      expect(console.log).toHaveBeenCalledWith('Cart count after adding:', 1);
    });
  });

  describe('book management', () => {
    beforeEach(() => {
      component.ngOnInit();
    });

    it('should load books successfully', () => {
      mockBookService.getBooks.and.returnValue(of([mockBook]));

      component.loadBooks();

      expect(mockBookService.getBooks).toHaveBeenCalled();
      expect(mockStateService.setBooks).toHaveBeenCalledWith([mockBook]);
    });

    it('should handle book loading errors', () => {
      mockBookService.getBooks.and.returnValue(of([]));
      spyOn(console, 'error');

      component.loadBooks();

      expect(console.error).toHaveBeenCalledWith('Error loading books:', undefined);
    });

    it('should open book form for new book', () => {
      component.openBookForm();

      expect(mockStateService.setShowBookForm).toHaveBeenCalledWith(true);
      expect(mockStateService.setEditingBook).toHaveBeenCalledWith(null);
      expect(mockStateService.resetBookForm).toHaveBeenCalled();
    });

    it('should open book form for editing', () => {
      component.openBookForm(mockBook);

      expect(mockStateService.setShowBookForm).toHaveBeenCalledWith(true);
      expect(mockStateService.setEditingBook).toHaveBeenCalledWith(mockBook);
      expect(mockStateService.setBookForm).toHaveBeenCalledWith(mockBook);
    });

    it('should cancel book edit', () => {
      component.cancelBookEdit();

      expect(mockStateService.setShowBookForm).toHaveBeenCalledWith(false);
      expect(mockStateService.setEditingBook).toHaveBeenCalledWith(null);
      expect(mockStateService.resetBookForm).toHaveBeenCalled();
    });

    it('should delete book with confirmation', () => {
      spyOn(window, 'confirm').and.returnValue(true);

      component.deleteBook(1);

      expect(window.confirm).toHaveBeenCalledWith('Are you sure?');
      expect(mockBookService.deleteBook).toHaveBeenCalledWith(1);
    });

    it('should not delete book without confirmation', () => {
      spyOn(window, 'confirm').and.returnValue(false);

      component.deleteBook(1);

      expect(window.confirm).toHaveBeenCalledWith('Are you sure?');
      expect(mockBookService.deleteBook).not.toHaveBeenCalled();
    });
  });

  describe('category management', () => {
    beforeEach(() => {
      component.ngOnInit();
    });

    it('should load categories successfully', () => {
      mockCategoryService.getCategories.and.returnValue(of([mockCategory]));

      component.loadCategories();

      expect(mockCategoryService.getCategories).toHaveBeenCalled();
      expect(mockStateService.setCategories).toHaveBeenCalledWith([mockCategory]);
    });

    it('should open category form for new category', () => {
      component.openCategoryForm();

      expect(mockStateService.setShowCategoryForm).toHaveBeenCalledWith(true);
      expect(mockStateService.setEditingCategory).toHaveBeenCalledWith(null);
      expect(mockStateService.resetCategoryForm).toHaveBeenCalled();
    });

    it('should open category form for editing', () => {
      component.openCategoryForm(mockCategory);

      expect(mockStateService.setShowCategoryForm).toHaveBeenCalledWith(true);
      expect(mockStateService.setEditingCategory).toHaveBeenCalledWith(mockCategory);
      expect(mockStateService.setCategoryForm).toHaveBeenCalledWith(mockCategory);
    });

    it('should cancel category edit', () => {
      component.cancelCategoryEdit();

      expect(mockStateService.setShowCategoryForm).toHaveBeenCalledWith(false);
      expect(mockStateService.setEditingCategory).toHaveBeenCalledWith(null);
      expect(mockStateService.resetCategoryForm).toHaveBeenCalled();
    });

    it('should delete category with confirmation', () => {
      spyOn(window, 'confirm').and.returnValue(true);

      component.deleteCategory(1);

      expect(window.confirm).toHaveBeenCalledWith('Are you sure?');
      expect(mockCategoryService.deleteCategory).toHaveBeenCalledWith(1);
    });
  });

  describe('form submission', () => {
    beforeEach(() => {
      component.categoryForm = { name: 'New Category' };
      component.bookForm = mockBook;
      component.ngOnInit();
    });

    it('should submit new category', () => {
      mockCategoryService.createCategory.and.returnValue(of(undefined as any));

      component.submitCategory();

      expect(mockCategoryService.createCategory).toHaveBeenCalledWith(component.categoryForm);
      expect(mockStateService.setShowCategoryForm).toHaveBeenCalledWith(false);
      expect(mockStateService.setEditingCategory).toHaveBeenCalledWith(null);
      expect(mockStateService.resetCategoryForm).toHaveBeenCalled();
    });

    it('should submit updated category', () => {
      component.editingCategory = mockCategory;
      mockCategoryService.updateCategory.and.returnValue(of(undefined as any));

      component.submitCategory();

      expect(mockCategoryService.updateCategory).toHaveBeenCalledWith(1, component.categoryForm);
    });

    it('should submit new book', () => {
      component.bookForm.categoryId = 1;
      mockBookService.createBook.and.returnValue(of(mockBook));

      component.submitBook();

      expect(mockBookService.createBook).toHaveBeenCalledWith(component.bookForm);
    });

    it('should submit updated book', () => {
      component.editingBook = mockBook;
      mockBookService.updateBook.and.returnValue(of());

      component.submitBook();

      expect(mockBookService.updateBook).toHaveBeenCalledWith(1, component.bookForm);
    });

    it('should validate book category before submission', () => {
      component.bookForm.categoryId = 0;

      component.submitBook();

      expect(mockBookService.createBook).not.toHaveBeenCalled();
    });

    it('should handle form submission errors', () => {
      mockCategoryService.createCategory.and.returnValue(of(mockCategory));
      spyOn(console, 'error');

      component.submitCategory();

      // Should not throw errors
      expect(mockCategoryService.createCategory).toHaveBeenCalled();
    });
  });

  describe('filtering', () => {
    beforeEach(() => {
      component.books = [mockBook];
    });

    it('should filter books by category', () => {
      const mockBook2 = { ...mockBook, id: 2, categoryId: 2 };
      component.books = [mockBook, mockBook2];

      component.filterBooksByCategory(1);

      expect(mockStateService.setFilteredBooks).toHaveBeenCalledWith([mockBook]);
    });
  });

  describe('scrolling', () => {
    it('should scroll to section when element exists', () => {
      const mockElement = { scrollIntoView: jasmine.createSpy('scrollIntoView') };
      spyOn(document, 'getElementById').and.returnValue(mockElement as any);

      component.scrollToSection('test-section');

      expect(document.getElementById).toHaveBeenCalledWith('test-section');
      expect(mockElement.scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' });
    });

    it('should handle missing element gracefully', () => {
      spyOn(document, 'getElementById').and.returnValue(null);

      expect(() => component.scrollToSection('missing-section')).not.toThrow();
    });
  });

  describe('component cleanup', () => {
    it('should unsubscribe on destroy', () => {
      spyOn(component['subscription'], 'unsubscribe');

      component.ngOnDestroy();

      expect(component['subscription'].unsubscribe).toHaveBeenCalled();
    });
  });

  describe('edge cases', () => {
    it('should handle books without required fields', () => {
      const incompleteBook = { id: 1, name: 'Incomplete' } as Book;

      expect(() => component.addToCart(incompleteBook)).not.toThrow();
    });

    it('should handle categories without id', () => {
      const categoryWithoutId = { name: 'No ID' } as Category;

      expect(() => component.openCategoryForm(categoryWithoutId)).not.toThrow();
    });

    it('should handle form validation', () => {
      component.bookForm = { ...mockBook, categoryId: 0 };

      component.submitBook();

      expect(mockBookService.createBook).not.toHaveBeenCalled();
    });
  });
});
