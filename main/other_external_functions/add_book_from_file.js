const fs = require('fs');
const app = require('../app');
const path = require('path');

const { v4: uuidv4 } = require('uuid');
const { isUtf8 } = require('buffer');

class Book {
  constructor(
    title,
    description,
    authors,
    favorite,
    fileCover,
    fileName,
    fileBook,
    id = uuidv4()
  ) {
    this.title = title;
    this.description = description;
    this.authors = authors;
    this.favorite = favorite;
    this.fileCover = fileCover;
    this.fileName = fileName;
    this.fileBook = fileBook;
    this.id = id;
  }
}
function add_book_from_file(fileName) {
  const { books } = app.store;

  fs.readFile(`${fileName}`, 'Utf8', (err, data) => {
    if (err) {
      console.log(err);
    } else {
      let data1 = JSON.parse(data);
      let {
        title,
        description,
        authors,
        favorite,
        fileCover,
        fileName,
        fileBook,
      } = data1;
      const newBook = new Book(
        title,
        description,
        authors,
        favorite,
        fileCover,
        fileName,
        fileBook
      );
      books.push(newBook);
    }
  });
}
module.exports = add_book_from_file;
