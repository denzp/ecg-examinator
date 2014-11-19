var express = require('express');
var app = express();

var options = {
  dotfiles: 'ignore',
  etag: false
};

app.use(express.static('.', options));

app.listen(3000, 'localhost');
console.log('Manual tests:');
console.log('  http://localhost:3000/specs/manual/index.html');
