import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { BookService, Book } from '../../shared/services/book/book.service';
import { CategoryService, Category } from '../../shared/services/category/category.service';
import { BookstoreStateService } from '../../shared/services/state/bookstore-state.service';
import { CardComponent } from '../../shared/components/card/card.component';
import { RouterModule } from '@angular/router';
import { NotificationComponent } from '../../shared/components/notification/notification.component';
import { ConfirmationModalComponent } from '../../shared/components/confirmation-modal/confirmation-modal.component';
import { ConfirmationService } from '../../shared/services/ui/confirmation.service'
import { NotificationService } from '../../shared/services/notification/notification.service'
@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, CardComponent, RouterModule, NotificationComponent, ConfirmationModalComponent],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit, OnDestroy {
  books: Book[] = [];
  categories: Category[] = [];
  filteredBooks: Book[] = [];
  showCategoryForm = false;
  editingCategory: Category | null = null;
  categoryForm: Category = { name: '' };
  showBookForm = false;
  editingBook: Book | null = null;
  bookForm: Book = { categoryId: 0, name: '', author: '', description: '', value: 0, publishDate: '' };
  addingToCartBookId: number | null = null;

  private subscription: Subscription = new Subscription();

  constructor(
    private bookService: BookService,
    private categoryService: CategoryService,
    private stateService: BookstoreStateService,
    private notificationService: NotificationService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.subscription.add(
      this.stateService.state$.subscribe(state => {
        this.books = state.books;
        this.categories = state.categories;
        this.filteredBooks = state.filteredBooks;
        this.showCategoryForm = state.showCategoryForm;
        this.editingCategory = state.editingCategory;
        this.categoryForm = state.categoryForm;
        this.showBookForm = state.showBookForm;
        this.editingBook = state.editingBook;
        this.bookForm = state.bookForm;
      })
    );
    this.loadBooks();
    this.loadCategories();
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

  async deleteCategory(id: number) {
    const category = this.categories.find(c => c.id === id);
    const categoryName = category?.name || 'this category';

    const result = await this.confirmationService.confirmDelete(categoryName);

    if (result.confirmed) {
      this.categoryService.deleteCategory(id).subscribe({
        next: () => {
          this.loadCategories();
          this.notificationService.success(
            'Category Deleted',
            `Category "${categoryName}" has been deleted successfully.`
          );
        },
        error: (err) => {
          console.error('Error deleting category:', err);
          this.notificationService.error(
            'Delete Failed',
            'Failed to delete category. Please try again.'
          );
        }
      });
    }
  }

  submitCategory() {
    if (this.editingCategory) {
      this.categoryService.updateCategory(this.editingCategory.id!, this.categoryForm).subscribe({
        next: () => {
          this.loadCategories();
          this.cancelCategoryEdit();
          this.notificationService.success(
            'Category Updated',
            `Category "${this.categoryForm.name}" has been updated successfully.`
          );
        },
        error: (err) => console.error('Error updating category:', err)
      });
    } else {
      this.categoryService.createCategory(this.categoryForm).subscribe({
        next: () => {
          this.loadCategories();
          this.cancelCategoryEdit();
          this.notificationService.success(
            'Category Created',
            `Category "${this.categoryForm.name}" has been created successfully.`
          );
        },
        error: (err) => console.error('Error creating category:', err)
      });
    }
  }

  editBook(book: Book) {
    this.stateService.setEditingBook(book);
    this.stateService.setBookForm({ ...book });
    this.stateService.setShowBookForm(true);
  }

  async deleteBook(id: number) {
    const book = this.books.find(b => b.id === id);
    const bookName = book?.name || 'this book';

    const result = await this.confirmationService.confirmDelete(bookName);

    if (result.confirmed) {
      this.bookService.deleteBook(id).subscribe({
        next: () => {
          this.loadBooks();
          this.notificationService.success(
            'Book Deleted',
            `Book "${bookName}" has been deleted successfully.`
          );
        },
        error: (err) => {
          console.error('Error deleting book:', err);
          this.notificationService.error(
            'Delete Failed',
            'Failed to delete book. Please try again.'
          );
        }
      });
    }
  }

  submitBook() {
    console.log('Submitting book form:', this.stateService.getBookForm());

    const editingBook = this.stateService.getEditingBook();
    if (editingBook) {
      this.bookService.updateBook(editingBook.id!, this.stateService.getBookForm()).subscribe({
        next: () => {
          this.loadBooks();
          this.stateService.setEditingBook(null);
          this.stateService.resetBookForm();
        },
        error: (err) => console.error('Error updating book:', err)
      });
    } else {
      // Ensure a valid category is selected (categoryId should be > 0)
      if (!this.stateService.getBookForm().categoryId || this.stateService.getBookForm().categoryId <= 0) {
        this.notificationService.warning(
          'Invalid Category',
          'Please select a valid category before saving the book.'
        );
        return;
      }

      this.bookService.createBook(this.stateService.getBookForm()).subscribe({
        next: () => {
          this.loadBooks();
          this.stateService.setEditingBook(null);
          this.stateService.resetBookForm();
          this.notificationService.success(
            'Book Created',
            'Book has been created successfully.'
          );
        },
        error: (err) => {
          console.error('Error creating book:', err);
          this.notificationService.error(
            'Create Failed',
            'Failed to create book. Please try again.'
          );
        }
      });
    }
  }

  openBookForm(book?: Book) {
    this.stateService.setShowBookForm(true);
    if (book) {
      this.stateService.setEditingBook(book);
      // Format publishDate to YYYY-MM-DD for date input
      const formattedBook = {
        ...book,
        publishDate: book.publishDate ? new Date(book.publishDate).toISOString().split('T')[0] : ''
      };
      this.stateService.setBookForm(formattedBook);
    } else {
      this.stateService.setEditingBook(null);
      this.stateService.resetBookForm();
    }
  }

  cancelBookEdit() {
    this.stateService.setShowBookForm(false);
    this.stateService.setEditingBook(null);
    this.stateService.resetBookForm();
  }

  cancelCategoryEdit() {
    this.stateService.setShowCategoryForm(false);
    this.stateService.setEditingCategory(null);
    this.stateService.resetCategoryForm();
  }

  openCategoryForm(category?: Category) {
    this.stateService.setShowCategoryForm(true);
    if (category) {
      this.stateService.setEditingCategory(category);
      this.stateService.setCategoryForm({ ...category });
    } else {
      this.stateService.setEditingCategory(null);
      this.stateService.resetCategoryForm();
    }
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
