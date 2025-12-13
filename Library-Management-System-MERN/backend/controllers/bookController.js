const Book = require('../models/Book');

exports.getBooks = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    const query = search 
      ? {
          $or: [
            { title: { $regex: search, $options: 'i' } },
            { author: { $regex: search, $options: 'i' } },
            { isbn: { $regex: search, $options: 'i' } }
          ]
        } 
      : {};

    const books = await Book.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const count = await Book.countDocuments(query);

    res.json({
      books,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.json(book);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createBook = async (req, res) => {
  try {
    const book = new Book({
      ...req.body,
      addedBy: req.user.id,
      available: req.body.quantity
    });
    await book.save();
    res.status(201).json(book);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateBook = async (req, res) => {
  try {
    const { title, author, isbn, publishedYear, publisher, category, quantity, shelfLocation } = req.body;
    
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    const quantityDifference = quantity - book.quantity;
    
    book.title = title || book.title;
    book.author = author || book.author;
    book.isbn = isbn || book.isbn;
    book.publishedYear = publishedYear || book.publishedYear;
    book.publisher = publisher || book.publisher;
    book.category = category || book.category;
    book.quantity = quantity || book.quantity;
    book.available = book.available + quantityDifference;
    book.shelfLocation = shelfLocation || book.shelfLocation;

    await book.save();
    res.json(book);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    if (book.available !== book.quantity) {
      return res.status(400).json({ 
        message: 'Cannot delete book with active checkouts' 
      });
    }

    await book.remove();
    res.json({ message: 'Book removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};