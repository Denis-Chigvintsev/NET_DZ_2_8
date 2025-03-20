const express = require('express');
const counter_router = express.Router();
const fs = require('fs');

class Counter {
  constructor(id, counter) {
    this.id = id;
    this.counter = counter;
  }
}

function add_counter(req, res) {
  let counter_el;
  let c;
  let counter_arr = [];
  let counter_str = fs.readFile('./data/counter.txt', 'utf8', (err, data) => {
    if (err) console.log(err);
    counter_str = data;

    if (counter_str) {
      counter_arr = JSON.parse(counter_str);
    } else {
      counter_arr = [];
    }
    let idx = counter_arr.findIndex((el) => el.id == id);
    counter_arr.forEach((el) => {});

    if (idx == -1) {
      counter_el = new Counter(id, 1);
      counter_arr.push(counter_el);
    } else {
      counter_arr[idx].counter = counter_arr[idx].counter + 1;
    }
    fs.writeFile('./data/counter.txt', JSON.stringify(counter_arr), (err) => {
      if (err) console.log(err);

      res.send('OK');
    });
  });
}

function get_counter(req, res) {
  let counter_arr = [];
  let counter_reading;
  let counter_str = fs.readFile('./data/counter.txt', 'utf8', (err, data) => {
    if (err) console.log(err);
    counter_str = data;
    if (counter_str) {
      counter_arr = JSON.parse(counter_str);
    } else {
      counter_arr = [];
    }
    let idx = counter_arr.findIndex((el) => el.id == id);
    if (idx !== -1) {
      counter_reading = counter_arr[idx].counter;
    } else counter_reading = 1;
    //res.status(201);

    res.send(`${counter_reading}`);
  });
}

let id;
counter_router.param('id', (req, res, next, val) => {
  id = val;
  next();
});

counter_router.use(express.json());
counter_router.post('/:id/incr', add_counter);
counter_router.get('/:id', get_counter);

module.exports = counter_router;
