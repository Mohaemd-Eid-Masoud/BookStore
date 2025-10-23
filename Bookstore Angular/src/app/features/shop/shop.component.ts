import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { BookService, Book } from '../../shared/services/book/book.service';
import { CategoryService, Category } from '../../shared/services/category/category.service';
import { BookstoreStateService } from '../../shared/services/state/bookstore-state.service';
import { NotificationService } from '../../shared/services/notification/notification.service';
import { SEOService } from '../../shared/services/seo/seo.service';
import { CardComponent } from '../../shared/components/card/card.component';
import { RouterModule } from '@angular/router';
import {NotificationComponent} from '../../shared/components/notification/notification.component';
import { ConfirmationModalComponent } from '../../shared/components/confirmation-modal/confirmation-modal.component';
@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [CommonModule, FormsModule, CardComponent, RouterModule, NotificationComponent, ConfirmationModalComponent],
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css']
})
export class ShopComponent implements OnInit, OnDestroy {
  books: Book[] = [];
  categories: Category[] = [];
  filteredBooks: Book[] = [];
  addingToCartBookId: number | null = null;

  private subscription: Subscription = new Subscription();

  constructor(
    private bookService: BookService,
    private categoryService: CategoryService,
    private stateService: BookstoreStateService,
    private notificationService: NotificationService,
    private seoService: SEOService
  ) {}

  ngOnInit() {
    this.subscription.add(
      this.stateService.state$.subscribe(state => {
        this.books = state.books;
        this.categories = state.categories;
        this.filteredBooks = state.filteredBooks;
      })
    );
    this.loadBooks();
    this.loadCategories();

    // Set SEO for shop page
    this.seoService.setMetaData({
      title: 'Shop Books Online | Browse Our Complete Catalog | Bookstore',
      description: 'Browse and shop our complete catalog of books. Find fiction, non-fiction, textbooks, and more. Fast shipping and great prices on all books.',
      keywords: 'shop books, buy books online, book catalog, bookstore catalog, online bookstore'
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  loadBooks() {
    this.bookService.getBooks().subscribe({
      next: (data) => this.stateService.setBooks(data),
      error: (err) => console.error('Error loading books:', err)
    });
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe({
      next: (data) => this.stateService.setCategories(data),
      error: (err) => console.error('Error loading categories:', err)
    });
  }

  filterBooksByCategory(categoryId: number) {
    this.stateService.setFilteredBooks(this.books.filter(book => book.categoryId === categoryId));
    this.scrollToSection('books');
  }

  addToCart(book: Book) {
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

  scrollToSection(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
