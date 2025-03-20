const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const booksSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },

  authors: {
    type: String,
    default: '',
  },

  favorite: {
    type: Boolean,
    default: false,
  },

  fileCover: {
    type: String,
    default: '',
  },

  fileName: {
    type: String,
    default: '',
  },

  fileBook: {
    type: String,
    default: '',
  },
  id: { type: String, default: uuidv4() },
});

module.exports = mongoose.model('BooksDB', booksSchema);
