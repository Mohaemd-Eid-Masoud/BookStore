import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Book } from '../../services/book/book.service';
import { Category } from '../../services/category/category.service';

@Component({
  selector: 'app-book-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './book-card.component.html',
  styleUrl: './book-card.component.css'
})
export class BookCardComponent {
  @Input() book!: Book;
  @Input() categoryName?: string;
  @Input() isAddingToCart: boolean = false;

  @Output() addToCart = new EventEmitter<Book>();
  @Output() quickView = new EventEmitter<Book>();

  onAddToCart(): void {
    this.addToCart.emit(this.book);
  }

  onQuickView(): void {
    this.quickView.emit(this.book);
  }
}
