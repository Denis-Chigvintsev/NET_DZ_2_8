const fs = require('fs');
const os = require('os');

function logger(req, res, next) {
  const now = new Date().toLocaleString();

  const { url, method } = req;
  const data = `${now} ${method} ${url}`;

  fs.appendFile('log.txt', `${data} +${os.EOL}`, (err) => {
    if (err) {
      console.log(err);
    }
  });
  next();
}

module.exports = logger;
