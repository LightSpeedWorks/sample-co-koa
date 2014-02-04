// app.js -- koa アプリケーション

var util = require('util');
var slice = Array.prototype.slice;

var koa = require('koa');
var app = koa();

var co = require('co');
co.fs = require('co-fs');

function fmt() {
  return util.format.apply(util, arguments);
}
function logIgnore() {
  console.log('\u001b[90m' + util.format.apply(util, arguments) + '\u001b[m');
}
function logError() {
  console.log('\u001b[31m' + util.format.apply(util, arguments) + '\u001b[m');
}
function logOk() {
  console.log('\u001b[32m' + util.format.apply(util, arguments) + '\u001b[m');
}

// logger, x-response-time header
app.use(function *logger(next) {
  var start = new Date;
  logIgnore(this.method, this.url);
  yield next;
  var ms = new Date - start;
  this.set('X-Response-Time', ms + 'ms');
  if (this.$myError)
    logError('%s %s - %sms - %s', this.method, this.url, ms, this.$myError);
  else
    logOk('%s %s - %sms', this.method, this.url, ms);
});

var contents;

// response
app.use(function *hello() {
  try {
    if (Math.random() > 0.5) {
      var b = yield co.fs.readFile('b.txt');
      this.body = 'hello world ' + contents + ' ' + b.toString().trim();
    }
    else {
      this.body = 'hello world ' + contents;
    }
  } catch(e) {
    this.body = 'hello world <font color=red>' + e + '</font>';
    this.$myError = e;
  }
});

co(function *() {
  var port = 3000;

  var a = yield co.fs.readFile('a.txt');
  contents = a.toString().trim();

  app.listen(port, function () {
    logOk('listening port ', port);
  });
})();
