var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
require('./instrumentation');
// const { addTraceId } = require('./inst2.js');
const { context, getSpan, getSpanContext, trace } =require( '@opentelemetry/api');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var testRouter = require('./routes/test');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// app.use( (req, res, next) => {
//     const spanContext = getSpanContext(context.active());
//     req.traceId = spanContext && spanContext.traceId;
//     next();
// });
// app.use(addTraceId);

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/test', testRouter);

module.exports = app;
