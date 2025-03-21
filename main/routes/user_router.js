const express = require('express');
const userRouter = express.Router();
const { v4: uuidv4 } = require('uuid');
const app = require('../app.js');
const Users = require('../models/users.model.js');
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const session = require('express-session');
const flash = require('express-flash');
const bcrypt = require('bcryptjs');
let flag1;
let checked_user;

userRouter.use(flash());

passport.use(
  new localStrategy({ usernameField: 'login' }, (login, password, done) => {
    let selected_user; /*"это предварительный user после проверки пароля он станет checked user"*/

    Users.find({ login: login })
      .then((i_user) => {
        selected_user = i_user;

        if (!selected_user.toString()) {
          done(null, false, { message: 'неправильное username' });
        } else {
          let isPassCorrect;

          bcrypt.compare(
            password,
            selected_user[0].password,
            (err, response) => {
              isPassCorrect = response;
            }
          );

          setTimeout(() => {
            if (
              selected_user.toString() &&
              selected_user[0].password &&
              isPassCorrect
            ) {
              checked_user = selected_user;
              return done(null, checked_user);
            } else {
              done(null, false, { message: 'неправильное password' });
            }
          }, 500);
        }
      })
      .catch((error) => console.log('ошибка', error));
  })
);

class User {
  constructor(user_ID, email = 'test@mail.ru') {
    this.user_ID = user_ID;
    this.email = email;
  }
}

////

function get_signup(req, res) {
  res.render('signup.ejs', { layout: false });
}
async function post_signup(req, res) {
  req.body.id = uuidv4();

  const salt = await bcrypt.genSalt();
  await bcrypt
    .hash(req.body.password, salt)
    .then((hash) => (req.body.password = hash));

  const newUserDB = new Users(req.body);
  flag1 = 0;

  Users.find({ login: req.body.login })
    .then((el) => {
      if (el.toString() == '') {
        flag1 = 1; //// мы не нашли запись с таким login и установили flag1=1-- такого пользователя раньше не было
      }

      if (flag1 == 0) {
        //// если запись имеется, то есть flag1=0 то мы пользователя возвращаем на signup
        res.redirect('/api/users/signup');
      } else {
        /// а если записи нет то есть flag1=1 то заносим польщзователя в базу
        newUserDB
          .save()
          .then(() => {
            //res.send(newUserDB.id);
          })
          .catch((error) => {
            console.log(error);
          });
        res.redirect('/api/users/login');
      }
    })
    .catch((error) => console.log(error));
}

function get_login(req, res) {
  res.render('login.ejs', { layout: false });
}

async function get_user_profile(req, res) {
  Users.find({ id: checked_user[0].id }).then((i_user) => {
    res.render('user_profile.ejs', { i_user });
  });
}

function edit_user_profile(req, res) {
  Users.find({ id: checked_user[0].id }).then((i_user) => {
    res.render('edit_user_profile.ejs', { i_user });
  });
}
async function post_user_profile(req, res) {
  req.body.id = checked_user[0].id;

  Users.findOneAndUpdate({ id: checked_user[0].id }, req.body)
    .then(() => res.redirect(`/api/users/user_profile`))
    .catch((error) => res.send('404 | ошибка'));
}

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/api/users/login');
}

userRouter.use(
  session({ secret: 'denis', resave: false, saveUninitialized: true })
);
userRouter.use(express.urlencoded({ exteded: false }));
userRouter.use(passport.initialize());
userRouter.use(passport.session());

passport.serializeUser((checked_user, done) => {
  done(null, checked_user[0].id);
});

passport.deserializeUser((id, done) => {
  const checked_user = Users.find({ id: id });

  done(null, checked_user);
});

async function delete_user_profile(req, res) {
  Users.findOneAndDelete({ id: checked_user[0].id })
    .then(() => {
      req.logout((err) => {
        if (err) {
          return next(err);
        }
        res.redirect('/api/users/signup');
      });
    })
    //res.render('signup');

    .catch(() => res.send('404 | ошибка - перезагрузите страницу'));
}

////////

//userRouter.post('/', postNewUser); ////
userRouter.get('/signup', get_signup);
userRouter.post('/signup', post_signup);
userRouter.get('/login', get_login);
//userRouter.post('/login', post_login);
userRouter.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect('/api/users/login');
  });
});

userRouter.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/api/books',
    failureRedirect: '/api/users/login',
  })
);

userRouter.get('/user_profile', checkAuthenticated, get_user_profile);
userRouter.get('/edit_user_profile/:id', checkAuthenticated, edit_user_profile);
userRouter.post(
  '/edit_user_profile/:id',
  checkAuthenticated,
  post_user_profile
);
userRouter.delete(
  '/delete_user_profile/:id',
  checkAuthenticated,
  delete_user_profile
);

module.exports = userRouter;
