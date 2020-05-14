var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var mongo = require('mongodb');
var promise = require('bluebird');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var productsRouter = require('./routes/products');
var fileUploadRouter = require('./routes/upload');
var categoryRouter = require('./routes/category');
var loginRouter = require('./routes/login');


var app = express();
app.use(cors());

const config = process.env.NODE_ENV === "prod"
  ? require("./application.prod.json")
  : require("./application.dev.json");

const url = config.db.url;
const dbName = config.db.dbName;


//mongo.connect(url, { promiseLibrary : promise })
mongo.connect(url, { useUnifiedTopology: true, useNewUrlParser: true, })
  .catch(err => console.error(err.stack))
  .then(db => {
    console.log('mongodb connection success(app.js)');
    app.locals.db = db.db(dbName);
    //console.log(app.locals.db);
  });


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/imageFiles', express.static('uploadfiles'));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/products', productsRouter);
app.use('/upload', fileUploadRouter);
app.use('/category', categoryRouter);
app.use('/login', loginRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
