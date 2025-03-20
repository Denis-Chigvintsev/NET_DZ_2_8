// под id пониммаем , что здесь мы берем те маршруты которые идут с :/id

const express = require('express');
const id_router = express.Router();
const app = require('../app.js');

id_router.use(express.static(`${__dirname}`));

const BooksDB = require('../models/books.model.js');

////////////////////////////блок функций и ниже блок маршрутов///////////////
let counter;
async function getCounter(id) {
  counter = await fetch(
    `http://host.docker.internal:100/api/books/counter/${id}`
  );
  counter = await counter.json();
}

function getBookByID(req, res) {
  const { books } = app.store;
  let counter_ejs;
  getCounter(id);

  BooksDB.find({ id: id })
    .then((i_book) => {
      counter_ejs = { counter: counter };
      if (!i_book) {
        res.status(404);
        res.send('404 | данные не найдены');
      } else {
        setTimeout(() => {
          counter_ejs = { counter: counter };
          res.render('book_info.ejs', { i_book, counter_ejs });
        }, 500);
      }
    })
    .catch((error) => console.log(error));
  /*
  if (!i_book) {
    res.status(404);
    res.send('404 | данные не найдены');
  } else {
    setTimeout(() => {
      counter_ejs = { counter: counter };
      res.render('book_info.ejs', { i_book, counter_ejs });
    }, 500);
  }
  */
}
//res.render('index.ejs', { books });

function editBookByID(req, res) {
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

  //const newBookDB = new BooksDB(req.body);
  if (!req.body.favorite) {
    req.body.favorite = false;
  }

  BooksDB.findOneAndUpdate({ id: id }, req.body)
    .then(res.redirect(`/api/books/${id}`))
    .catch((error) => res.send('404 | ошибка'));
}

function deleteBookByID(req, res) {
  const { books } = app.store;
  BooksDB.findOneAndDelete({ id: id })
    .then(res.send('OK'))
    .catch(() => res.send('404 | ошибка'));
  let idx = books.findIndex((el) => el.id == id);
}
let id;
////блок маршрутов
id_router.param('id', (req, res, next, val) => {
  id = val;

  next();
});

function edit_form(req, res) {
  BooksDB.find({ id: id })
    .then((i_book) => {
      if (!i_book) {
        res.status(404);
        res.send('404 | данные не найдены');
      } else {
        res.render('edit_book', { i_book });
      }
    })
    .catch((error) => console.log(error));
}

id_router.get('/:id', getBookByID); ///

id_router.get('/:id/edit_form', edit_form);
id_router.post('/:id', editBookByID); ///
id_router.delete('/:id', deleteBookByID); ///

module.exports = id_router;
