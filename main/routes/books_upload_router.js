const express = require('express');
const multer = require('multer');
const add_book_from_file = require('../other_external_functions/add_book_from_file');
const books_upload_router = express.Router();
const path = require('path');

////конфигурирую storage
const storageConfig = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
books_upload_router.use(multer({ storage: storageConfig }).single('filedata'));

function confirmation(req, res) {
  let filedata = req.file;
  if (!filedata) res.send('Ошибка при загрузке файла');
  else {
    res.send('Файл загружен');
    let fileName = path.join(
      `${path.resolve('./uploads')}/${req.file.filename}`
    );

    setTimeout(() => {
      add_book_from_file(fileName);
    }, 0);
  }
}
/// ниже сам роутинг
books_upload_router.post('/upload', confirmation); //

module.exports = books_upload_router;
