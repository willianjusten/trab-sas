// Setup Requirements
var express      = require('express');
var app          = express();
var port         = process.env.PORT || 8080;
var mongoose     = require('mongoose');
var passport     = require('passport');
var flash        = require('connect-flash');
var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');
var configDB     = require('./config/database.js');
var libnmap      = require('node-libnmap');
var iptables     = require('iptables');

// Config DB
mongoose.connect(configDB.url);

// Require passport config
require('./config/passport')(passport);

// Setup express applications
app.use(morgan('dev'));
app.use(cookieParser());

// Define bodyParser and setups
app.use(bodyParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Define view engine (maybe change to jade later)
app.set('view engine', 'ejs');


// Setup for passport
app.use(session({secret: 'trabalhofinaldesas'})); // this is just for session
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Call routes
require('./app/routes.js')(app, passport);

// Define assets
app.use(express.static(__dirname + '/assets'));
app.use("/styles", express.static(__dirname + '/assets/styles'));
app.use("/images", express.static(__dirname + '/assets/images'));
app.use("/fonts", express.static(__dirname + '/assets/fonts'));
app.use("/js", express.static(__dirname + '/assets/js'));

// Init server at port
app.listen(port);
console.log('Server uses port: ' + port);
