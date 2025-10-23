import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { AppComponent } from './app.component';
import { BookstoreStateService } from './shared/services/state/bookstore-state.service';
import { NotificationService } from './shared/services/notification/notification.service';
import { NotificationComponent } from './shared/components/notification/notification.component';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let mockStateService: jasmine.SpyObj<BookstoreStateService>;

  beforeEach(async () => {
    const stateServiceSpy = jasmine.createSpyObj('BookstoreStateService', [
      'state$', 'getCartItems'
    ]);

    await TestBed.configureTestingModule({
      imports: [
        AppComponent,
        NotificationComponent,
        RouterTestingModule
      ],
      providers: [
        { provide: BookstoreStateService, useValue: stateServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    mockStateService = TestBed.inject(BookstoreStateService) as jasmine.SpyObj<BookstoreStateService>;

    // Setup default mock behavior
    const mockCartItems = [
      { book: { id: 1, categoryId: 1, name: 'Book 1', author: 'Author 1', description: 'Desc 1', value: 10, publishDate: '2024-01-01' }, quantity: 2 },
      { book: { id: 2, categoryId: 2, name: 'Book 2', author: 'Author 2', description: 'Desc 2', value: 15, publishDate: '2024-02-01' }, quantity: 1 }
    ];
    mockStateService.getCartItems.and.returnValue(mockCartItems);
    mockStateService.state$ = of({
      books: [],
      categories: [],
      filteredBooks: [],
      showCategoryForm: false,
      editingCategory: null,
      categoryForm: { name: '' },
      showBookForm: false,
      editingBook: null,
      bookForm: { categoryId: 0, name: '', author: '', description: '', value: 0, publishDate: '' },
      cartItems: mockCartItems
    });
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it(`should have the 'bookstore' title`, () => {
    expect(component.title).toEqual('bookstore');
  });

  it('should render title', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('nav')?.textContent).toContain('Bookstore');
  });

  describe('cart counter functionality', () => {
    it('should initialize cart count correctly', () => {
      component.ngOnInit();

      expect(component.cartItemCount).toBe(3); // 2 + 1 items
      expect(mockStateService.getCartItems).toHaveBeenCalled();
    });

    it('should update cart count when state changes', () => {
      component.ngOnInit();

      // Simulate state change with different cart items
      const newCartItems = [
        { book: { id: 1, categoryId: 1, name: 'Book 1', author: 'Author 1', description: 'Desc 1', value: 10, publishDate: '2024-01-01' }, quantity: 1 }
      ];
      mockStateService.state$ = of({
        books: [],
        categories: [],
        filteredBooks: [],
        showCategoryForm: false,
        editingCategory: null,
        categoryForm: { name: '' },
        showBookForm: false,
        editingBook: null,
        bookForm: { categoryId: 0, name: '', author: '', description: '', value: 0, publishDate: '' },
        cartItems: newCartItems
      });

      // Reinitialize to test subscription
      component.ngOnDestroy();
      component.ngOnInit();

      expect(component.cartItemCount).toBe(1);
    });

    it('should handle empty cart', () => {
      mockStateService.getCartItems.and.returnValue([]);
      mockStateService.state$ = of({
        books: [],
        categories: [],
        filteredBooks: [],
        showCategoryForm: false,
        editingCategory: null,
        categoryForm: { name: '' },
        showBookForm: false,
        editingBook: null,
        bookForm: { categoryId: 0, name: '', author: '', description: '', value: 0, publishDate: '' },
        cartItems: []
      });

      component.ngOnInit();

      expect(component.cartItemCount).toBe(0);
    });

    it('should handle cart with single item', () => {
      const singleItem = [{ book: { id: 1, categoryId: 1, name: 'Book 1', author: 'Author 1', description: 'Desc 1', value: 10, publishDate: '2024-01-01' }, quantity: 1 }];
      mockStateService.getCartItems.and.returnValue(singleItem);
      mockStateService.state$ = of({
        books: [],
        categories: [],
        filteredBooks: [],
        showCategoryForm: false,
        editingCategory: null,
        categoryForm: { name: '' },
        showBookForm: false,
        editingBook: null,
        bookForm: { categoryId: 0, name: '', author: '', description: '', value: 0, publishDate: '' },
        cartItems: singleItem
      });

      component.ngOnInit();

      expect(component.cartItemCount).toBe(1);
    });

    it('should handle large quantities correctly', () => {
      const largeQuantityItem = [{ book: { id: 1, categoryId: 1, name: 'Book 1', author: 'Author 1', description: 'Desc 1', value: 10, publishDate: '2024-01-01' }, quantity: 100 }];
      mockStateService.getCartItems.and.returnValue(largeQuantityItem);
      mockStateService.state$ = of({
        books: [],
        categories: [],
        filteredBooks: [],
        showCategoryForm: false,
        editingCategory: null,
        categoryForm: { name: '' },
        showBookForm: false,
        editingBook: null,
        bookForm: { categoryId: 0, name: '', author: '', description: '', value: 0, publishDate: '' },
        cartItems: largeQuantityItem
      });

      component.ngOnInit();

      expect(component.cartItemCount).toBe(100);
    });
  });

  describe('subscription management', () => {
    it('should subscribe to state changes on init', () => {
      spyOn(mockStateService.state$, 'subscribe');

      component.ngOnInit();

      expect(mockStateService.state$.subscribe).toHaveBeenCalled();
    });

    it('should unsubscribe on destroy', () => {
      spyOn(component['cartSubscription']!, 'unsubscribe');

      component.ngOnDestroy();

      expect(component['cartSubscription']?.unsubscribe).toHaveBeenCalled();
    });

    it('should handle unsubscribe when subscription is undefined', () => {
      (component as any).cartSubscription = undefined;

      expect(() => component.ngOnDestroy()).not.toThrow();
    });
  });

  describe('error handling', () => {
    it('should handle state service errors gracefully', () => {
      mockStateService.state$ = of(null as any);

      expect(() => component.ngOnInit()).not.toThrow();
    });

    it('should handle missing cart items gracefully', () => {
      mockStateService.getCartItems.and.returnValue(null as any);

      expect(() => component.ngOnInit()).not.toThrow();
      expect(component.cartItemCount).toBe(0);
    });

    it('should handle cart items without quantity', () => {
      const invalidCartItems = [{ book: { id: 1, categoryId: 1, name: 'Book 1', author: 'Author 1', description: 'Desc 1', value: 10, publishDate: '2024-01-01' } }];
      mockStateService.getCartItems.and.returnValue(invalidCartItems as any);

      component.ngOnInit();

      expect(component.cartItemCount).toBe(0); // Should handle gracefully
    });
  });

  describe('console logging', () => {
    it('should log cart count updates', () => {
      spyOn(console, 'log');

      component.ngOnInit();

      expect(console.log).toHaveBeenCalledWith('Cart count updated:', 3);
      expect(console.log).toHaveBeenCalledWith('Initial cart count:', 3);
    });

    it('should log initial cart count', () => {
      spyOn(console, 'log');
      mockStateService.getCartItems.and.returnValue([]);

      component.ngOnInit();

      expect(console.log).toHaveBeenCalledWith('Initial cart count:', 0);
    });
  });

  describe('edge cases', () => {
    it('should handle very large cart counts', () => {
      const hugeCart = [{ book: { id: 1, categoryId: 1, name: 'Book 1', author: 'Author 1', description: 'Desc 1', value: 10, publishDate: '2024-01-01' }, quantity: 999999 }];
      mockStateService.getCartItems.and.returnValue(hugeCart);
      mockStateService.state$ = of({
        books: [],
        categories: [],
        filteredBooks: [],
        showCategoryForm: false,
        editingCategory: null,
        categoryForm: { name: '' },
        showBookForm: false,
        editingBook: null,
        bookForm: { categoryId: 0, name: '', author: '', description: '', value: 0, publishDate: '' },
        cartItems: hugeCart
      });

      component.ngOnInit();

      expect(component.cartItemCount).toBe(999999);
    });

    it('should handle negative quantities', () => {
      const negativeQuantity = [{ book: { id: 1, categoryId: 1, name: 'Book 1', author: 'Author 1', description: 'Desc 1', value: 10, publishDate: '2024-01-01' }, quantity: -5 }];
      mockStateService.getCartItems.and.returnValue(negativeQuantity);
      mockStateService.state$ = of({
        books: [],
        categories: [],
        filteredBooks: [],
        showCategoryForm: false,
        editingCategory: null,
        categoryForm: { name: '' },
        showBookForm: false,
        editingBook: null,
        bookForm: { categoryId: 0, name: '', author: '', description: '', value: 0, publishDate: '' },
        cartItems: negativeQuantity
      });

      component.ngOnInit();

      expect(component.cartItemCount).toBe(-5); // Should handle negative values
    });

    it('should handle zero quantity items', () => {
      const zeroQuantity = [{ book: { id: 1, categoryId: 1, name: 'Book 1', author: 'Author 1', description: 'Desc 1', value: 10, publishDate: '2024-01-01' }, quantity: 0 }];
      mockStateService.getCartItems.and.returnValue(zeroQuantity);
      mockStateService.state$ = of({
        books: [],
        categories: [],
        filteredBooks: [],
        showCategoryForm: false,
        editingCategory: null,
        categoryForm: { name: '' },
        showBookForm: false,
        editingBook: null,
        bookForm: { categoryId: 0, name: '', author: '', description: '', value: 0, publishDate: '' },
        cartItems: zeroQuantity
      });

      component.ngOnInit();

      expect(component.cartItemCount).toBe(0);
    });
  });
});
