'use strict';

var fs = require('fs');
var co = require('co');
var thunkify = require('thunkify');

co.fs = co.fs || {};
co.fs.readFile = thunkify(fs.readFile);

co(function*() {
  var data = yield co.fs.readFile('a.txt');
  console.log('a.txt:', data.toString().trim());
})();

co.fs.readFile('a.txt')
(function (err, data) {
  console.log('a.txt:', data.toString().trim());
});
