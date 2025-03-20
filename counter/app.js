const express = require('express');
const app = express();

const cors = require('cors');

const fs = require('fs');
const counter_router = require('./routes/counter_router.js');

app.use(express.json());

const { readFile } = require('fs');
const { isUtf8 } = require('buffer');
const dotenv = require('dotenv').config();
const PORT = process.env.PORT;

if (!PORT) {
  console.log(' в файле .env не указан номер порта сервера');
  return;
}

app.use(cors());

///////////////////////////////////////////////////////////////////////

////////
app.use('/api/books/counter', counter_router);

app.listen(PORT, () => {
  console.log(`\nсервер запущен на порте ${PORT}`);
});
