import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Book {
  id?: number;
  categoryId: number;
  name: string;
  author: string;
  description: string;
  value: number;
  publishDate: string;
}

@Injectable({ providedIn: 'root' })
export class BookService {
  private apiUrl = 'http://localhost:82/api/Books';  // Updated for consistency

  constructor(private http: HttpClient) {}

  getBooks(): Observable<Book[]> {
    return this.http.get<Book[]>(this.apiUrl);
  }

  getBook(id: number): Observable<Book> {
    return this.http.get<Book>(`${this.apiUrl}/${id}`);
  }

  createBook(book: Book): Observable<Book> {
    return this.http.post<Book>(this.apiUrl, book);
  }

  updateBook(id: number, book: Book): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, book);
  }

  deleteBook(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Additional methods for your API
  getBooksByCategory(categoryId: number): Observable<Book[]> {
    return this.http.get<Book[]>(`${this.apiUrl}/get-books-by-category/${categoryId}`);
  }

  searchBooks(bookName: string): Observable<Book[]> {
    return this.http.get<Book[]>(`${this.apiUrl}/search/${bookName}`);
  }

  searchBooksWithCategory(searchedValue: string): Observable<Book[]> {
    return this.http.get<Book[]>(`${this.apiUrl}/search-book-with-category/${searchedValue}`);
  }

  searchBooksInCategory(searchedValue: string, categoryId: number): Observable<Book[]> {
    return this.http.get<Book[]>(`${this.apiUrl}/search-book-in-category/${searchedValue}/${categoryId}`);
  }
}
