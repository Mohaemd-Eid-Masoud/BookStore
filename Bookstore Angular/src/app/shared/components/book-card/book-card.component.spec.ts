import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BookCardComponent } from './book-card.component';
import { Book } from '../../services/book/book.service';

describe('BookCardComponent', () => {
  let component: BookCardComponent;
  let fixture: ComponentFixture<BookCardComponent>;

  const mockBook: Book = {
    id: 1,
    categoryId: 1,
    name: 'Test Book',
    author: 'Test Author',
    description: 'Test Description',
    value: 19.99,
    publishDate: '2024-01-01'
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookCardComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(BookCardComponent);
    component = fixture.componentInstance;
    component.book = mockBook;
    component.categoryName = 'Test Category';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display book information correctly', () => {
    const compiled = fixture.nativeElement;

    expect(compiled.querySelector('.book-title').textContent).toContain('Test Book');
    expect(compiled.querySelector('.book-author span').textContent).toContain('Test Author');
    expect(compiled.querySelector('.price').textContent).toContain('$19.99');
    expect(compiled.querySelector('.book-category').textContent).toContain('Test Category');
  });

  it('should emit addToCart event when add to cart button is clicked', () => {
    spyOn(component.addToCart, 'emit');

    const addToCartBtn = fixture.nativeElement.querySelector('.add-to-cart-btn');
    addToCartBtn.click();

    expect(component.addToCart.emit).toHaveBeenCalledWith(mockBook);
  });

  it('should emit quickView event when quick view button is clicked', () => {
    spyOn(component.quickView, 'emit');

    const quickViewBtn = fixture.nativeElement.querySelector('.quick-view-btn');
    quickViewBtn.click();

    expect(component.quickView.emit).toHaveBeenCalledWith(mockBook);
  });

  it('should handle books without category name', () => {
    component.categoryName = undefined;
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.book-category')).toBeNull();
  });

  it('should handle long book titles and descriptions', () => {
    const longBook: Book = {
      ...mockBook,
      name: 'A Very Long Book Title That Should Be Truncated When Displayed In The Card Component',
      description: 'A very long description that should be truncated with ellipsis when it exceeds the maximum length allowed in the book card component display area.'
    };

    component.book = longBook;
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const titleElement = compiled.querySelector('.book-title');
    const descriptionElement = compiled.querySelector('.book-description');

    expect(titleElement.textContent.length).toBeLessThanOrEqual(60); // Approximate truncation
    expect(descriptionElement.textContent).toContain('...');
  });

  it('should disable add to cart button when loading', () => {
    component.isAddingToCart = true;
    fixture.detectChanges();

    const addToCartBtn = fixture.nativeElement.querySelector('.add-to-cart-btn');
    expect(addToCartBtn.disabled).toBe(true);
    expect(addToCartBtn.classList.contains('loading')).toBe(true);
    expect(addToCartBtn.textContent).toContain('Adding...');
  });

  it('should show spinner when adding to cart', () => {
    component.isAddingToCart = true;
    fixture.detectChanges();

    const spinner = fixture.nativeElement.querySelector('.loading-spinner');
    expect(spinner).toBeTruthy();
    expect(spinner.querySelector('.fa-spinner')).toBeTruthy();
  });

  it('should format price correctly', () => {
    const compiled = fixture.nativeElement;
    const priceElement = compiled.querySelector('.price');
    expect(priceElement.textContent).toBe('$19.99');
  });

  it('should format date correctly', () => {
    const compiled = fixture.nativeElement;
    const dateElement = compiled.querySelector('.date');
    expect(dateElement.textContent).toContain('Jan 2024');
  });

  it('should handle books without required fields gracefully', () => {
    const incompleteBook = { id: 1, name: 'Incomplete Book' } as Book;
    component.book = incompleteBook;
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.book-title')).toBeTruthy();
    expect(compiled.querySelector('.add-to-cart-btn')).toBeTruthy();
  });
});
