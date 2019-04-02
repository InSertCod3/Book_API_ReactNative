"use strict";

const express = require('express');
const Fuse = require('fuse.js');
const fs = require('fs');
var readline = require('readline');
const es6Renderer = require('express-es6-template-engine');

// Express app init
const app = express();
app.set('port', (process.env.PORT || 5000)); // App PORT
app.engine('html', es6Renderer);
app.set('views', 'views');
app.set('view engine', 'html');

// Data Parsing
const bookDB = []
readline.createInterface({
    input: fs.createReadStream(__dirname  + '/data/books-test-collection-1.json'),
    terminal: false
}).on('line', function(line) {
    bookDB.push(JSON.parse(line))
});

var fuse_options = {
  shouldSort: true,
  threshold: 0.6,
  location: 0,
  distance: 100,
  maxPatternLength: 32,
  minMatchCharLength: 1,
  keys: [{
    name: 'title',
    weight: 1
  }]
};

var fuse = new Fuse(bookDB, fuse_options);

function paginate (arr, result_limit, page_num) {
    return arr.slice(page_num * result_limit, (page_num + 1) * result_limit);
}

function api_books(req, res){
  /*
  * Returns Appropriate Data from a api request :GET.
    ex. -- http://localhost:5000/books?title=all&result_limit=10&page_num=0
  */
  var _query = req.query.title != undefined ? req.query.title : undefined;
  var _page_num = req.query.page_num != undefined ? req.query.page_num : undefined;
  var _result_limit = req.query.result_limit != undefined ? req.query.result_limit : 100;
  var _result = fuse.search(_query);
  var resp = {status: "ok", result_amount: _result.length, results: paginate(_result, _result_limit, _page_num)};
  if (req.query.title == '' || req.query.title == undefined ){
    resp.status = "error.";
    resp.results = "Require url argument 'title' is Invaild";
  }
  return res.json(resp);
}

// Api Endpoints Register
app.get('/', (req, res) => res.render('index'));
app.get('/books', api_books);

// Start Listen with the server
app.listen(app.get("port"), () => console.log(`Api app listening on port ${app.get("port")}!`))