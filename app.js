const createError = require('http-errors');
const express = require('express');
const bodyParser = require('body-parser')
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const flash = require('express-flash')
require('./db');
const session = require('express-session')
require("./services/passport")
const passport = require('passport')
//socket.io
const socketio = require('socket.io');
//router
const indexRouter = require('./routes/index');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(bodyParser.json())
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(flash())
app.use(passport.initialize())
app.use(passport.session())

app.use(express.static(path.join(__dirname, 'public')));
//session
app.use(session({secret: 'ssshhhhh',saveUninitialized: true,resave: true}));

app.use('/', indexRouter);

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
  if(err.status == 404){
    res.redirect('/404');
  }else{
    console.log(err);
    res.redirect('/500');
  }
  
});
const host = '0.0.0.0';
const port = process.env.PORT || 3000;
const httpServer= app.listen(port,host, ()=> console.log(`Server running port ${port}`))
const io = socketio(httpServer);

io.on('connection',  function (socket) {
	// Everytime a client logs in, display a connected message
	
   
    socket.join("_room" + socket.handshake.query.room_id);
      
    socket.on('connected', function (data) {
      
    });
})

const socketIoObject = io;
module.exports.ioObject = socketIoObject;
