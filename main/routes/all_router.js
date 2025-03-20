const express = require('express');
const passport = require('passport');

const all_router = express.Router();
const app = require('../app.js');
const { v4: uuidv4 } = require('uuid');
// под all_имеется ввиду когда запросы идут без :/id

const cors = require('cors');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');

const BooksDB = require('../models/books.model.js');

all_router.use(expressLayouts);

all_router.use(express.urlencoded({ extended: false }));

all_router.use(express.static(`${__dirname}`));

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

/////блок функций
function getAllBooks(req, res) {
  console.log('getAll');

  const { books } = app.store;
  res.send(books);
  res.render('index.ejs', { books });
}
function postNewBook(req, res) {
  const { books } = app.store;
  const {
    title,
    description,
    authors,
    favorite,
    fileCover,
    fileName,
    fileBook,
  } = req.body;
  if (!req.body.favorite) {
    req.body.favorite = false;
  }
  req.body.id = uuidv4();

  const newBookDB = new BooksDB(req.body);
  newBookDB
    .save()
    .then(() => res.redirect(`/api/books/${newBookDB.id}`))
    .catch((error) => console.log(error));

  const newBook = new Book(
    title,
    description,
    authors,
    favorite,
    fileCover,
    fileName,
    fileBook
  );

  // console.log(  );

  books.push(newBook);
  //res.status(201);
  //res.send(newBook);
}

all_router.use(express.static(`${__dirname}`));

all_router.get('/', (req, res) => {
  BooksDB.find({})
    .then((books) => {
      //let { books } = app.store;

      res.render('index.ejs', { books });
    })
    .catch((error) => console.log(error));
});

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/api/users/login');
}

////

all_router.get('/add_book', checkAuthenticated, (req, res) => {
  //res.status = 200;
  res.render('add_book.ejs');
});
all_router.post('/add_book', (req, res) => {
  //res.status = 200;
  const { books } = app.store;
  const {
    title,
    description,
    authors,
    favorite,
    fileCover,
    fileName,
    fileBook,
  } = req.body;

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
  req.body.id = uuidv4();

  const newBookDB = new BooksDB(req.body);
  newBookDB
    .save()
    .then(() => res.redirect('/'))
    .catch((error) => console.log(error));
});

////блок маршрутов
all_router.get('/', checkAuthenticated, getAllBooks); //
all_router.post('/', checkAuthenticated, postNewBook); //

module.exports = all_router;
