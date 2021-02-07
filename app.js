var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');                                                                     


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var boardRouter= require('./routes/board');



var app = express();

const maria = require('./bin/maria');
maria.connect();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/board', boardRouter);
app.use(express.static(__dirname+'/public'));
app.use('/uploads', express.static('uploads'));
app.use('/code', express.static('code'));
app.use((req,res,next)=>{
  // 해당미들웨어의 config가 위치한뒤 next()로 다음 미들웨어로 넘어가도록 처리한다.
  next()
})
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
