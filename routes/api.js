'use strict';
const Book = require('../models/Book');
const mongoose = require('mongoose');

module.exports = function (app) {

  app.route('/api/books')
    .get(async (req, res) => {
      try {
        const books = await Book.getAllBooks();
        res.json(books);
      } catch (err) {
        res.status(500).send('Server error');
      }
    })

    .post(async (req, res) => {
      const title = req.body.title;
      if (!title) {
        return res.send('missing required field title');
      }
      try {
        const newBook = await Book.addBook(title);
        res.json(newBook);
      } catch (err) {
        res.status(500).send('Server error');
      }
    })

    .delete(async (req, res) => {
      try {
        const message = await Book.deleteAllBooks();
        res.send(message); // 'complete delete successful'
      } catch (err) {
        res.status(500).send('Server error');
      }
    });

  app.route('/api/books/:id')
    .get(async (req, res) => {
      const bookId = req.params.id;
      try {
        const book = await Book.getBookById(bookId);
        if (!book) {
          return res.send('no book exists');
        }
        res.json(book);
      } catch (err) {
        res.send('no book exists');
      }
    })

    .post(async (req, res) => {
      const bookId = req.params.id;
      if(!mongoose.Types.ObjectId.isValid(bookId)){
        return res.send('no book exists');
      }
      const comment = req.body.comment;
      if (!comment) {
        return res.send('missing required field comment');
      }
      try {
        const updatedBook = await Book.addComment(bookId, comment);
        res.json(updatedBook);
      } catch (err) {
        if (err.message === 'no book exists') {
          res.send('no book exists');
        } else {
          res.status(500).send('Server error');
        }
      }
    })

    .delete(async (req, res) => {
      const bookId = req.params.id;
      if(!mongoose.Types.ObjectId.isValid(bookId)){
        return res.send('no book exists');
      }
      try {
        const book = await Book.deleteBookById(bookId);
        if (!book) {
          return res.send('no book exists');
        }
        res.send('delete successful');
      } catch (err) {
        console.error(err);
        res.status(500).send('Error deleting book');
      }
    });

};
