let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
let cors = require('cors');
let dotenv = require('dotenv').config();

let indexRouter = require('./routes/index');
let fileRouter = require('./routes/files');
let usersRouter = require('./routes/users');
let loginRouter = require('./routes/login');
let classRouter = require('./routes/class');
let classesRouter = require('./routes/classes');
let coursesRouter = require('./routes/courses');
let postsRouter = require('./routes/posts');
let testsRouter = require('./routes/tests');
let stRouter = require('./routes/students_tests');
let sectionRouter = require('./routes/section');
let testResultRouter = require('./routes/test_result');
let questionRouter = require('./routes/questions');
let activitiesRouter = require('./routes/activities');

let app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/login', loginRouter);
app.use('/api/v1/file', fileRouter);
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/courses', coursesRouter);
app.use('/api/v1/class', classRouter);
app.use('/api/v1/classes', classesRouter);
app.use('/api/v1/posts', postsRouter);
app.use('/api/v1/tests', testsRouter);
app.use('/api/v1/students_tests', stRouter);
app.use('/api/v1/sections', sectionRouter);
app.use('/api/v1/test_result', testResultRouter);
app.use('/api/v1/questions', questionRouter);
app.use('/activities', activitiesRouter);

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
