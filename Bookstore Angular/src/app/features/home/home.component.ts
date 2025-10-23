import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BookService, Book } from '../../shared/services/book/book.service';
import { CategoryService, Category } from '../../shared/services/category/category.service'
import { BookingService } from '../../shared/services/cart/booking.service';
import { NotificationService } from '../../shared/services/notification/notification.service'
import { SEOService } from '../../shared/services/seo/seo.service';
import { BookstoreStateService } from '../../shared/services/state/bookstore-state.service';
import { Subject, Subscription, debounceTime, distinctUntilChanged } from 'rxjs';
import { BookCardComponent } from '../../shared/components/book-card/book-card.component';
import { NotificationComponent } from '../../shared/components/notification/notification.component';
import { ConfirmationModalComponent } from '../../shared/components/confirmation-modal/confirmation-modal.component';

// New properties for category browsing
interface CategoryBooks {
  category: Category;
  books: Book[];
  isLoading: boolean;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, BookCardComponent, NotificationComponent, ConfirmationModalComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  // Search properties
  searchQuery: string = '';
  searchType: 'books' | 'categories' = 'books';
  selectedSearchCategory: string = ''; // For single category search
  isSearching: boolean = false;
  showBooksResults: boolean = false;
  showCategoriesResults: boolean = false;

  // Filter properties
  selectedCategory: string = '';
  priceRange: string = '';
  sortBy: string = 'name';
  showAdvancedFilters: boolean = false;

  // Results
  searchResults: Book[] = [];
  categories: Category[] = [];
  filteredBooks: Book[] = [];
  filteredCategories: Category[] = [];

  // Category browsing properties
  selectedBrowseCategory: string = '';
  categoryBooks: CategoryBooks[] = [];
  showCategoryBooks: boolean = false;

  // Load all books for category browsing
  allBooks: Book[] = [];

  // Suggestions
  suggestions: string[] = [];
  showSuggestions: boolean = false;
  addingToCartBookId: number | null = null;

  // Search optimization
  private searchSubject = new Subject<string>();
  private searchSubscription?: Subscription;

  constructor(
    private bookService: BookService,
    private categoryService: CategoryService,
    private bookingService: BookingService,
    private notificationService: NotificationService,
    private seoService: SEOService,
    private stateService: BookstoreStateService
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadAllBooks();
    this.setupSearchSubscription();

    // Set SEO for home page
    this.seoService.setHomePageSEO();
  }

  ngOnDestroy(): void {
    this.searchSubscription?.unsubscribe();
  }

  private setupSearchSubscription(): void {
    this.searchSubscription = this.searchSubject
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe((query: string) => {
        if (query.trim()) {
          this.generateSuggestions(query);
          this.performSearch();
        } else {
          this.clearResults();
        }
      });
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (data: Category[]) => {
        this.categories = data;
      },
      error: (error: any) => {
        console.error('Error loading categories:', error);
      }
    });
  }

  loadAllBooks(): void {
    this.bookService.getBooks().subscribe({
      next: (data: Book[]) => {
        this.allBooks = data;
      },
      error: (error: any) => {
        console.error('Error loading books:', error);
      }
    });
  }

  loadBooksByCategory(categoryId: number): void {
    this.showCategoryBooks = true;
    this.showBooksResults = false;
    this.showCategoriesResults = false;

    const category = this.categories.find(c => c.id === categoryId);
    if (!category) return;

    // Clear previous category books and add only the new one
    this.categoryBooks = [{
      category: category,
      books: [],
      isLoading: true
    }];

    // Filter books by category
    const booksInCategory = this.allBooks.filter(book => book.categoryId === categoryId);

    // Simulate loading delay for better UX
    setTimeout(() => {
      this.categoryBooks[0].books = booksInCategory;
      this.categoryBooks[0].isLoading = false;
    }, 300);
  }

  setSearchType(type: 'books' | 'categories'): void {
    this.searchType = type;
    // Clear all results and states when switching search types
    this.clearResults();
    this.showCategoryBooks = false;
    this.categoryBooks = [];
    this.selectedBrowseCategory = '';
  }

  onSearchInput(): void {
    this.searchSubject.next(this.searchQuery);
  }

  performSearch(): void {
    if (!this.searchQuery.trim()) {
      this.clearResults();
      return;
    }

    this.isSearching = true;

    if (this.searchType === 'books') {
      this.searchBooks();
    } else {
      this.searchCategories();
    }
  }

  searchBooks(): void {
    this.showCategoriesResults = false;

    // Use single category search if a category is selected, otherwise use general search
    if (this.selectedSearchCategory) {
      this.bookService.searchBooksInCategory(this.searchQuery, parseInt(this.selectedSearchCategory)).subscribe({
        next: (data: Book[]) => {
          this.searchResults = data;
          this.applyFilters();
          this.showBooksResults = true;
          this.isSearching = false;
        },
        error: (error: any) => {
          console.error('Error searching books in category:', error);
          this.isSearching = false;
          this.searchResults = [];
          this.filteredBooks = [];
          this.showBooksResults = true;
        }
      });
    } else {
      // Use the search with category method for more comprehensive search
      this.bookService.searchBooksWithCategory(this.searchQuery).subscribe({
        next: (data: Book[]) => {
          this.searchResults = data;
          this.applyFilters();
          this.showBooksResults = true;
          this.isSearching = false;
        },
        error: (error: any) => {
          console.error('Error searching books:', error);
          this.isSearching = false;
          this.searchResults = [];
          this.filteredBooks = [];
          this.showBooksResults = true;
        }
      });
    }
  }

  searchCategories(): void {
    this.showBooksResults = false;

    this.categoryService.searchCategories(this.searchQuery).subscribe({
      next: (data: Category[]) => {
        this.filteredCategories = data;
        this.showCategoriesResults = true;
        this.isSearching = false;
      },
      error: (error: any) => {
        console.error('Error searching categories:', error);
        this.isSearching = false;
        this.filteredCategories = [];
        this.showCategoriesResults = true;
      }
    });
  }

  applyFilters(): void {
    let filtered = [...this.searchResults];

    // Apply category filter
    if (this.selectedCategory) {
      filtered = filtered.filter(book => book.categoryId.toString() === this.selectedCategory);
    }

    // Apply price filter
    if (this.priceRange) {
      filtered = filtered.filter(book => {
        const price = book.value;
        switch (this.priceRange) {
          case '0-20': return price >= 0 && price <= 20;
          case '20-50': return price > 20 && price <= 50;
          case '50-100': return price > 50 && price <= 100;
          case '100+': return price > 100;
          default: return true;
        }
      });
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (this.sortBy) {
        case 'name': return a.name.localeCompare(b.name);
        case 'author': return a.author.localeCompare(b.author);
        case 'price': return a.value - b.value;
        case 'publishDate': return new Date(a.publishDate).getTime() - new Date(b.publishDate).getTime();
        default: return 0;
      }
    });

    this.filteredBooks = filtered;
  }

  generateSuggestions(query: string): void {
    if (query.length < 2) {
      this.suggestions = [];
      return;
    }

    // Generate suggestions based on search type
    if (this.searchType === 'books') {
      this.generateBookSuggestions(query);
    } else {
      this.generateCategorySuggestions(query);
    }
  }

  generateBookSuggestions(query: string): void {
    // Get sample suggestions from existing books or create common suggestions
    const commonSuggestions = [
      'fiction', 'mystery', 'romance', 'science fiction', 'biography',
      'history', 'self-help', 'cooking', 'travel', 'children'
    ];

    this.suggestions = commonSuggestions
      .filter(suggestion => suggestion.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 5);
  }

  generateCategorySuggestions(query: string): void {
    const commonCategories = [
      'Fiction', 'Non-Fiction', 'Science', 'History', 'Biography',
      'Children', 'Cooking', 'Travel', 'Health', 'Technology'
    ];

    this.suggestions = commonCategories
      .filter(category => category.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 5);
  }

  selectSuggestion(suggestion: string): void {
    this.searchQuery = suggestion;
    this.showSuggestions = false;
    this.performSearch();
  }

  toggleAdvancedFilters(): void {
    this.showAdvancedFilters = !this.showAdvancedFilters;
  }

  getCategoryName(categoryId: number): string {
    const category = this.categories.find(cat => cat.id === categoryId);
    return category ? category.name : '';
  }

  clearResults(): void {
    this.showBooksResults = false;
    this.showCategoriesResults = false;
    this.searchResults = [];
    this.filteredBooks = [];
    this.filteredCategories = [];
    this.suggestions = [];
    this.showSuggestions = false;
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.selectedCategory = '';
    this.selectedSearchCategory = '';
    this.priceRange = '';
    this.sortBy = 'name';
    this.clearResults();
    this.loadCategories();
  }

  onSearchCategoryChange(): void {
    // Clear previous results immediately when category changes
    this.clearResults();

    // When category selection changes, perform search if there's a query
    if (this.searchQuery.trim()) {
      this.isSearching = true;
      this.performSearch();
    }
  }

  updatePlaceholder(): string {
    return this.searchType === 'books'
      ? 'books by title, author, or description'
      : 'categories by name';
  }

  addToCart(book: Book): void {
    this.addingToCartBookId = book.id || null;

    console.log('Adding to cart:', book.name);
    this.stateService.addToCart(book);

    // Show custom success notification
    this.notificationService.success(
      'Added to Cart!',
      `"${book.name}" by ${book.author} has been added to your cart.`
    );

    // Debug: Check cart state
    console.log('Cart count after adding:', this.stateService.getCartItems().length);

    // Clear loading state after a brief delay
    setTimeout(() => {
      this.addingToCartBookId = null;
    }, 1000);
  }

  onBookCardAddToCart(book: Book): void {
    this.addToCart(book);
  }

  browseCategory(categoryId: number): void {
    // Clear all search-related states when browsing categories
    this.clearResults();
    this.selectedBrowseCategory = categoryId.toString();
    this.loadBooksByCategory(categoryId);
  }

  onCategoryClick(category: Category): void {
    this.browseCategory(category.id!);
  }

  onQuickView(book: Book): void {
    // For now, just show a notification. Could be enhanced to show a modal or navigate to book detail
    this.notificationService.info(
      'Quick View',
      `"${book.name}" by ${book.author} - ${book.description.substring(0, 100)}...`
    );
  }

  backFromCategory(): void {
    this.showCategoryBooks = false;
    this.categoryBooks = [];
    this.selectedBrowseCategory = '';
  }

  // Get category-specific icon
  getCategoryIcon(categoryName: string): string {
    const name = categoryName.toLowerCase();
    const iconMap: { [key: string]: string } = {
      'fiction': 'fa-book-open',
      'non-fiction': 'fa-book',
      'science': 'fa-atom',
      'history': 'fa-scroll',
      'biography': 'fa-user',
      'children': 'fa-child',
      'cooking': 'fa-utensils',
      'travel': 'fa-plane',
      'health': 'fa-heart',
      'technology': 'fa-laptop-code',
      'mystery': 'fa-search',
      'romance': 'fa-heart',
      'self-help': 'fa-lightbulb',
      'art': 'fa-palette',
      'music': 'fa-music',
      'sports': 'fa-football-ball',
      'religion': 'fa-praying-hands',
      'politics': 'fa-flag',
      'business': 'fa-briefcase',
      'education': 'fa-graduation-cap'
    };

    // Find exact match first, then partial match
    for (const [key, icon] of Object.entries(iconMap)) {
      if (name.includes(key)) {
        return icon;
      }
    }
    // Default icon
    return 'fa-folder-open';
  }

  // Get total books in current category
  getTotalBooksInCategory(): number {
    return this.categoryBooks.reduce((total, categoryBook) => total + categoryBook.books.length, 0);
  }

  // Track by function for ngFor performance
  trackByBookId(index: number, book: Book): number {
    return book.id || index;
  }
}
