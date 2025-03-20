const express = require('express');
const mongoose = require('mongoose');
const app = express();
const logger = require('./middleware/logger.js');
const userRouter = require('./routes/user_router.js');
const all_router = require('./routes/all_router.js');
const id_router = require('./routes/id_router.js');
const books_upload_router = require('./routes/books_upload_router.js');
const cors = require('cors');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
//let booksDB = require('../models/books.model.js');

/// блок импорта паспорта
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const session = require('express-session');

mongoose
  .connect(
    'mongodb://denis:chigvintsev@host.docker.internal:500/baza?authSource=admin'
  )
  .then(() => console.log('база подключена'))
  .catch((error) => console.log(error));

app.use(express.json());
app.use(expressLayouts);

// блок паспортных middleware + контроль сессий
app.use(session({ secret: 'cats', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

//три волшебных функции паспорта

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const { v4: uuidv4 } = require('uuid');
const dotenv = require('dotenv').config();
const PORT = process.env.PORT;

if (!PORT) {
  console.log(' в файле .env не указан номер порта сервера');
  return;
}

const books = [];
const users = [];

const store = {
  books: books,
  users: users,
};
exports.store = store;

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/api/users/login');
}

app.use(logger);
app.use(cors());

///////////////////////////////////////////////////////////////////////
app.use('/api/users', userRouter);
app.use('/api/books', checkAuthenticated, all_router);
app.use('/api/books', checkAuthenticated, id_router);
app.use('/api/books', checkAuthenticated, books_upload_router);

app.listen(PORT, () => {
  console.log(`\nсервер запущен на порте ${PORT}`);
});
