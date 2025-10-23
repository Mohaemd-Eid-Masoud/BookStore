const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 82;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory data storage (replace with actual database later)
let books = [
  {
    id: 1,
    categoryId: 1,
    name: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    description: "A classic American novel",
    value: 15.99,
    publishDate: new Date("1925-04-10").toISOString()
  },
  {
    id: 2,
    categoryId: 2,
    name: "To Kill a Mockingbird",
    author: "Harper Lee",
    description: "A novel about racial injustice",
    value: 12.99,
    publishDate: new Date("1960-07-11").toISOString()
  }
];

let categories = [
  { id: 1, name: "Fiction", books: ["The Great Gatsby"] },
  { id: 2, name: "Classic Literature", books: ["To Kill a Mockingbird"] }
];

let nextBookId = 3;
let nextCategoryId = 3;

// Helper function to format dates for display
function formatBookForDisplay(book) {
  return {
    ...book,
    publishDate: book.publishDate ? new Date(book.publishDate).toLocaleDateString() : null
  };
}

// Books endpoints
app.get('/api/Books', (req, res) => {
  const formattedBooks = books.map(formatBookForDisplay);
  res.json(formattedBooks);
});

app.get('/api/Books/:id', (req, res) => {
  const book = books.find(b => b.id === parseInt(req.params.id));
  if (!book) {
    return res.status(404).json({ error: 'Book not found' });
  }
  res.json(formatBookForDisplay(book));
});

app.post('/api/Books', (req, res) => {
  console.log('POST /api/Books - Received data:', req.body);

  const newBook = {
    id: nextBookId++,
    ...req.body
  };

  // Validate required fields
  if (!newBook.name || !newBook.author || !newBook.description || !newBook.value || !newBook.publishDate || !newBook.categoryId) {
    console.log('Validation failed - missing required fields');
    return res.status(400).json({ error: 'All fields are required' });
  }

  // Convert date string to ISO format if needed
  if (newBook.publishDate && typeof newBook.publishDate === 'string') {
    // If it's in YYYY-MM-DD format, convert to ISO string
    if (newBook.publishDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
      newBook.publishDate = new Date(newBook.publishDate).toISOString();
      console.log('Converted date to:', newBook.publishDate);
    }
  }

  books.push(newBook);
  console.log('Created book:', newBook);
  res.status(201).json(newBook);
});

app.put('/api/Books/:id', (req, res) => {
  const bookIndex = books.findIndex(b => b.id === parseInt(req.params.id));
  if (bookIndex === -1) {
    return res.status(404).json({ error: 'Book not found' });
  }

  const updatedBook = { ...books[bookIndex], ...req.body };

  // Convert date string to ISO format if needed
  if (updatedBook.publishDate && typeof updatedBook.publishDate === 'string') {
    // If it's in YYYY-MM-DD format, convert to ISO string
    if (updatedBook.publishDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
      updatedBook.publishDate = new Date(updatedBook.publishDate).toISOString();
    }
  }

  books[bookIndex] = updatedBook;
  res.json(books[bookIndex]);
});

app.delete('/api/Books/:id', (req, res) => {
  const bookIndex = books.findIndex(b => b.id === parseInt(req.params.id));
  if (bookIndex === -1) {
    return res.status(404).json({ error: 'Book not found' });
  }
  const deletedBook = books.splice(bookIndex, 1);
  res.json(deletedBook[0]);
});

// Additional book endpoints
app.get('/api/Books/get-books-by-category/:categoryId', (req, res) => {
  const categoryId = parseInt(req.params.categoryId);
  const filteredBooks = books.filter(book => book.categoryId === categoryId);
  const formattedBooks = filteredBooks.map(formatBookForDisplay);
  res.json(formattedBooks);
});

app.get('/api/Books/search/:bookName', (req, res) => {
  const bookName = req.params.bookName.toLowerCase();
  const filteredBooks = books.filter(book =>
    book.name.toLowerCase().includes(bookName) ||
    book.author.toLowerCase().includes(bookName)
  );
  const formattedBooks = filteredBooks.map(formatBookForDisplay);
  res.json(formattedBooks);
});

app.get('/api/Books/search-book-in-category/:searchedValue/:categoryId', (req, res) => {
  const searchValue = req.params.searchedValue.toLowerCase();
  const categoryId = parseInt(req.params.categoryId);

  const filteredBooks = books.filter(book =>
    book.categoryId === categoryId && (
      book.name.toLowerCase().includes(searchValue) ||
      book.author.toLowerCase().includes(searchValue) ||
      book.description.toLowerCase().includes(searchValue)
    )
  );
  const formattedBooks = filteredBooks.map(formatBookForDisplay);
  res.json(formattedBooks);
});

// Categories endpoints
app.get('/api/Categories', (req, res) => {
  res.json(categories);
});

app.get('/api/Categories/:id', (req, res) => {
  const category = categories.find(c => c.id === parseInt(req.params.id));
  if (!category) {
    return res.status(404).json({ error: 'Category not found' });
  }
  res.json(category);
});

app.post('/api/Categories', (req, res) => {
  const newCategory = {
    id: nextCategoryId++,
    ...req.body
  };
  categories.push(newCategory);
  res.status(201).json(newCategory);
});

app.put('/api/Categories/:id', (req, res) => {
  const categoryIndex = categories.findIndex(c => c.id === parseInt(req.params.id));
  if (categoryIndex === -1) {
    return res.status(404).json({ error: 'Category not found' });
  }
  categories[categoryIndex] = { ...categories[categoryIndex], ...req.body };
  res.json(categories[categoryIndex]);
});

app.delete('/api/Categories/:id', (req, res) => {
  const categoryIndex = categories.findIndex(c => c.id === parseInt(req.params.id));
  if (categoryIndex === -1) {
    return res.status(404).json({ error: 'Category not found' });
  }
  const deletedCategory = categories.splice(categoryIndex, 1);
  res.json(deletedCategory[0]);
});

app.get('/api/Categories/search/:category', (req, res) => {
  const searchTerm = req.params.category.toLowerCase();
  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm)
  );
  res.json(filteredCategories);
});

// Start server
app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});
