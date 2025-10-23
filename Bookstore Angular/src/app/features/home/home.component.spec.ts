import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { of, Subject } from 'rxjs';

import { HomeComponent } from './home.component';
import { BookService, Book } from '../../shared/services/book/book.service';
import { CategoryService, Category } from '../../shared/services/category/category.service';
import { BookstoreStateService } from '../../shared/services/state/bookstore-state.service';
import { NotificationService } from '../../shared/services/notification/notification.service';
import { SEOService } from '../../shared/services/seo/seo.service';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let mockBookService: jasmine.SpyObj<BookService>;
  let mockCategoryService: jasmine.SpyObj<CategoryService>;
  let mockStateService: jasmine.SpyObj<BookstoreStateService>;
  let mockNotificationService: jasmine.SpyObj<NotificationService>;
  let mockSEOService: jasmine.SpyObj<SEOService>;

  let mockBook: Book;
  let mockCategory: Category;

  beforeEach(async () => {
    const bookServiceSpy = jasmine.createSpyObj('BookService', [
      'getBooks', 'searchBooksWithCategory'
    ]);
    const categoryServiceSpy = jasmine.createSpyObj('CategoryService', [
      'getCategories', 'searchCategories'
    ]);
    const stateServiceSpy = jasmine.createSpyObj('BookstoreStateService', [
      'setCategories', 'addToCart', 'getCartItems'
    ]);
    const notificationServiceSpy = jasmine.createSpyObj('NotificationService', ['success']);
    const seoServiceSpy = jasmine.createSpyObj('SEOService', ['setHomePageSEO']);

    await TestBed.configureTestingModule({
      imports: [
        HomeComponent,
        FormsModule,
        RouterTestingModule
      ],
      providers: [
        { provide: BookService, useValue: bookServiceSpy },
        { provide: CategoryService, useValue: categoryServiceSpy },
        { provide: BookstoreStateService, useValue: stateServiceSpy },
        { provide: NotificationService, useValue: notificationServiceSpy },
        { provide: SEOService, useValue: seoServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;

    mockBookService = TestBed.inject(BookService) as jasmine.SpyObj<BookService>;
    mockCategoryService = TestBed.inject(CategoryService) as jasmine.SpyObj<CategoryService>;
    mockStateService = TestBed.inject(BookstoreStateService) as jasmine.SpyObj<BookstoreStateService>;
    mockNotificationService = TestBed.inject(NotificationService) as jasmine.SpyObj<NotificationService>;
    mockSEOService = TestBed.inject(SEOService) as jasmine.SpyObj<SEOService>;

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
    mockBookService.searchBooksWithCategory.and.returnValue(of([mockBook]));
    mockCategoryService.getCategories.and.returnValue(of([mockCategory]));
    mockCategoryService.searchCategories.and.returnValue(of([mockCategory]));
    mockStateService.getCartItems.and.returnValue([]);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should initialize component and load categories', () => {
      component.ngOnInit();

      expect(mockCategoryService.getCategories).toHaveBeenCalled();
      expect(mockSEOService.setHomePageSEO).toHaveBeenCalled();
    });

    it('should setup search subscription', () => {
      spyOn(component['searchSubject'], 'pipe').and.returnValue(of(''));
      spyOn(component['searchSubject'], 'subscribe');

      component.ngOnInit();

      expect(component['searchSubject'].subscribe).toHaveBeenCalled();
    });
  });

  describe('addToCart', () => {
    beforeEach(() => {
      component.categories = [mockCategory];
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

  describe('search functionality', () => {
    beforeEach(() => {
      component.categories = [mockCategory];
      component.ngOnInit();
    });

    it('should set search type to books', () => {
      component.setSearchType('books');

      expect(component.searchType).toBe('books');
      expect(component.showBooksResults).toBe(false);
      expect(component.showCategoriesResults).toBe(false);
    });

    it('should set search type to categories', () => {
      component.setSearchType('categories');

      expect(component.searchType).toBe('categories');
      expect(component.showBooksResults).toBe(false);
      expect(component.showCategoriesResults).toBe(false);
    });

    it('should perform book search', () => {
      component.searchQuery = 'test';
      component.searchType = 'books';

      mockBookService.searchBooksWithCategory.and.returnValue(of([mockBook]));

      component.performSearch();

      expect(mockBookService.searchBooksWithCategory).toHaveBeenCalledWith('test');
      expect(component.searchResults).toEqual([mockBook]);
      expect(component.showBooksResults).toBe(true);
      expect(component.isSearching).toBe(false);
    });

    it('should perform category search', () => {
      component.searchQuery = 'test';
      component.searchType = 'categories';

      mockCategoryService.searchCategories.and.returnValue(of([mockCategory]));

      component.performSearch();

      expect(mockCategoryService.searchCategories).toHaveBeenCalledWith('test');
      expect(component.filteredCategories).toEqual([mockCategory]);
      expect(component.showCategoriesResults).toBe(true);
    });

    it('should handle empty search query', () => {
      component.searchQuery = '';
      component.showBooksResults = true;
      component.showCategoriesResults = true;

      component.performSearch();

      expect(component.showBooksResults).toBe(false);
      expect(component.showCategoriesResults).toBe(false);
      expect(component.searchResults).toEqual([]);
      expect(component.filteredBooks).toEqual([]);
    });

    it('should handle search errors gracefully', () => {
      component.searchQuery = 'test';
      component.searchType = 'books';

      mockBookService.searchBooksWithCategory.and.returnValue(of([]));
      spyOn(console, 'error');

      component.performSearch();

      expect(console.error).toHaveBeenCalledWith('Error searching books:', undefined);
      expect(component.showBooksResults).toBe(true);
    });
  });

  describe('search input handling', () => {
    beforeEach(() => {
      component.categories = [mockCategory];
      component.ngOnInit();
      spyOn(component, 'performSearch');
    });

    it('should debounce search input', (done) => {
      component.searchQuery = 'test';

      component.onSearchInput();

      // Should not call performSearch immediately due to debounce
      expect(component.performSearch).not.toHaveBeenCalled();

      setTimeout(() => {
        expect(component.performSearch).toHaveBeenCalled();
        done();
      }, 350);
    });

    it('should handle rapid input changes', () => {
      component.searchQuery = 'a';
      component.onSearchInput();

      component.searchQuery = 'ab';
      component.onSearchInput();

      component.searchQuery = 'abc';
      component.onSearchInput();

      // Should only call performSearch once after debounce
      setTimeout(() => {
        expect(component.performSearch).toHaveBeenCalledTimes(1);
      }, 350);
    });
  });

  describe('filtering and sorting', () => {
    beforeEach(() => {
      component.searchResults = [
        mockBook,
        { ...mockBook, id: 2, name: 'Another Book', value: 15.99 },
        { ...mockBook, id: 3, name: 'Third Book', value: 25.99 }
      ];
    });

    it('should apply category filter', () => {
      component.selectedCategory = '1';
      component.applyFilters();

      expect(component.filteredBooks).toEqual([mockBook]);
    });

    it('should apply price range filter', () => {
      component.priceRange = '20-50';
      component.applyFilters();

      expect(component.filteredBooks).toHaveSize(2); // Books with price 20-50
    });

    it('should sort by name', () => {
      component.sortBy = 'name';
      component.applyFilters();

      expect(component.filteredBooks[0].name).toBe('Another Book');
    });

    it('should sort by price', () => {
      component.sortBy = 'price';
      component.applyFilters();

      expect(component.filteredBooks[0].value).toBe(15.99);
    });

    it('should sort by author', () => {
      const bookWithDifferentAuthor = {
        ...mockBook,
        id: 2,
        author: 'A Author',
        name: 'Z Book'
      };
      component.searchResults = [mockBook, bookWithDifferentAuthor];

      component.sortBy = 'author';
      component.applyFilters();

      expect(component.filteredBooks[0].author).toBe('A Author');
    });
  });

  describe('suggestions', () => {
    it('should generate book suggestions', () => {
      component.searchType = 'books';
      component.generateSuggestions('fic');

      expect(component.suggestions).toContain('fiction');
      expect(component.suggestions.length).toBeLessThanOrEqual(5);
    });

    it('should generate category suggestions', () => {
      component.searchType = 'categories';
      component.generateSuggestions('hist');

      expect(component.suggestions).toContain('History');
    });

    it('should not generate suggestions for short queries', () => {
      component.generateSuggestions('a');

      expect(component.suggestions).toEqual([]);
    });

    it('should select suggestion and perform search', () => {
      spyOn(component, 'performSearch');
      component.searchQuery = '';

      component.selectSuggestion('fiction');

      expect(component.searchQuery).toBe('fiction');
      expect(component.showSuggestions).toBe(false);
      expect(component.performSearch).toHaveBeenCalled();
    });
  });

  describe('utility methods', () => {
    it('should get category name by id', () => {
      component.categories = [mockCategory];

      expect(component.getCategoryName(1)).toBe('Test Category');
      expect(component.getCategoryName(999)).toBe('');
    });

    it('should clear all search results', () => {
      component.searchQuery = 'test';
      component.showBooksResults = true;
      component.showCategoriesResults = true;
      component.searchResults = [mockBook];
      component.filteredBooks = [mockBook];

      component.clearSearch();

      expect(component.searchQuery).toBe('');
      expect(component.showBooksResults).toBe(false);
      expect(component.showCategoriesResults).toBe(false);
      expect(component.searchResults).toEqual([]);
      expect(component.filteredBooks).toEqual([]);
    });

    it('should return correct placeholder text', () => {
      component.searchType = 'books';
      expect(component.updatePlaceholder()).toBe('books by title, author, or description');

      component.searchType = 'categories';
      expect(component.updatePlaceholder()).toBe('categories by name');
    });
  });

  describe('component cleanup', () => {
    it('should unsubscribe on destroy', () => {
      spyOn(component['searchSubscription']!, 'unsubscribe');

      component.ngOnDestroy();

      expect(component['searchSubscription']?.unsubscribe).toHaveBeenCalled();
    });
  });

  describe('edge cases', () => {
    it('should handle empty search results', () => {
      mockBookService.searchBooksWithCategory.and.returnValue(of([]));

      component.searchQuery = 'nonexistent';
      component.performSearch();

      expect(component.searchResults).toEqual([]);
      expect(component.filteredBooks).toEqual([]);
    });

    it('should handle search with special characters', () => {
      component.searchQuery = 'test@#$%';

      expect(() => component.performSearch()).not.toThrow();
    });

    it('should handle very long search queries', () => {
      component.searchQuery = 'a'.repeat(1000);

      expect(() => component.performSearch()).not.toThrow();
    });
  });
});
