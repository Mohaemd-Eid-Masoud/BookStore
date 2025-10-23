import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Book } from '../book/book.service';
import { Category } from '../category/category.service';
import { BookingService, CartItem } from '../cart/booking.service';

export interface BookstoreState {
  books: Book[];
  categories: Category[];
  filteredBooks: Book[];
  showCategoryForm: boolean;
  editingCategory: Category | null;
  categoryForm: Category;
  showBookForm: boolean;
  editingBook: Book | null;
  bookForm: Book;
  cartItems: CartItem[];
}

@Injectable({
  providedIn: 'root'
})
export class BookstoreStateService {
  private initialState: BookstoreState = {
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
  };

  private stateSubject = new BehaviorSubject<BookstoreState>(this.initialState);
  public state$: Observable<BookstoreState> = this.stateSubject.asObservable();
  private bookingService: BookingService;

  constructor() {
    // Initialize booking service (it will handle localStorage safely)
    this.bookingService = new BookingService();
  }

  get currentState(): BookstoreState {
    return this.stateSubject.value;
  }

  updateState(newState: Partial<BookstoreState>) {
    const updatedState = { ...this.currentState, ...newState };
    this.stateSubject.next(updatedState);
  }

  // Specific update methods for clarity
  setBooks(books: Book[]) {
    this.updateState({ books });
  }

  setCategories(categories: Category[]) {
    this.updateState({ categories });
  }

  setFilteredBooks(filteredBooks: Book[]) {
    this.updateState({ filteredBooks });
  }

  setShowCategoryForm(show: boolean) {
    this.updateState({ showCategoryForm: show });
  }

  setEditingCategory(category: Category | null) {
    this.updateState({ editingCategory: category });
  }

  setCategoryForm(form: Category) {
    this.updateState({ categoryForm: form });
  }

  setShowBookForm(show: boolean) {
    this.updateState({ showBookForm: show });
  }

  setBookForm(form: Book) {
    this.updateState({ bookForm: form });
  }

  setEditingBook(book: Book | null) {
    this.updateState({ editingBook: book });
  }

  setCartItems(items: CartItem[]) {
    this.updateState({ cartItems: items });
  }

  resetCategoryForm() {
    this.updateState({ categoryForm: { name: '' } });
  }

  resetBookForm() {
    const today = new Date().toISOString().split('T')[0];
    this.updateState({ bookForm: { categoryId: 0, name: '', author: '', description: '', value: 0, publishDate: today } });
  }

  getBooks(): Book[] {
    return this.currentState.books;
  }

  getCategories(): Category[] {
    return this.currentState.categories;
  }

  getFilteredBooks(): Book[] {
    return this.currentState.filteredBooks;
  }

  getShowCategoryForm(): boolean {
    return this.currentState.showCategoryForm;
  }

  getEditingCategory(): Category | null {
    return this.currentState.editingCategory;
  }

  getCategoryForm(): Category {
    return this.currentState.categoryForm;
  }

  getShowBookForm(): boolean {
    return this.currentState.showBookForm;
  }

  getEditingBook(): Book | null {
    return this.currentState.editingBook;
  }

  getBookForm(): Book {
    return this.currentState.bookForm;
  }

  getCartItems(): CartItem[] {
    return this.bookingService.getCartItems();
  }

  updateBookInBooks(bookId: number, updatedBook: Book) {
    const updatedBooks = this.currentState.books.map(book =>
      book.id === bookId ? updatedBook : book
    );
    this.updateState({ books: updatedBooks });
  }

  addToCart(book: Book) {
    this.bookingService.addToCart(book);
    this.updateState({ cartItems: this.bookingService.getCartItems() });
  }

  updateCartItemQuantity(bookId: number, quantity: number) {
    this.bookingService.updateQuantity(bookId, quantity);
    this.updateState({ cartItems: this.bookingService.getCartItems() });
  }

  removeFromCart(bookId: number) {
    this.bookingService.removeFromCart(bookId);
    this.updateState({ cartItems: this.bookingService.getCartItems() });
  }

  clearCart() {
    this.bookingService.clearCart();
    this.updateState({ cartItems: this.bookingService.getCartItems() });
  }
}
