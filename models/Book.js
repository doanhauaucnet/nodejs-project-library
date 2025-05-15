const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    comments: [String],
});

// Get all books with comment count
BookSchema.statics.getAllBooks = async function () {
    const books = await this.find({});
    return books.map(book => ({
        _id: book._id,
        title: book.title,
        commentcount: book.comments.length,
    }));
};

// Add a new book
BookSchema.statics.addBook = async function (title) {
    const book = new this({ title, comments: [] });
    return await book.save();
};

// Get a book by ID
BookSchema.statics.getBookById = async function (id) {
    return await this.findById(id);
};

// Add comment to a book
BookSchema.statics.addComment = async function (id, comment) {
    const book = await this.findById(id);
    if (!book) throw new Error('no book exists');
    book.comments.push(comment);
    return await book.save();
};

// Delete one book by ID
BookSchema.statics.deleteBookById = async function (id) {
    const deleted = await this.findByIdAndDelete(id);
    return deleted; // returns null if not found
};

// Delete all books
BookSchema.statics.deleteAllBooks = async function () {
    await this.deleteMany({});
    return 'complete delete successful';
};

module.exports = mongoose.model('Book', BookSchema);
