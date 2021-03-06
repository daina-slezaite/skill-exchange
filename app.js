require('dotenv').config();

const bodyParser   = require('body-parser');
const cookieParser = require('cookie-parser');
const express      = require('express');
const favicon      = require('serve-favicon');
const hbs          = require('hbs');
const mongoose     = require('mongoose');
const logger       = require('morgan');
const path         = require('path');
const cors         = require('cors');
const session      = require('express-session');
const passport     = require('passport');
 
require('./configs/passport');

mongoose
  .connect(process.env.MONGODB_URI,
    {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    })
  .then(x => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  })
  .catch(err => {
    console.error('Error connecting to mongo', err)
  });

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app = express();

// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Express View engine setup

app.use(require('node-sass-middleware')({
  src:  path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  sourceMap: true
}));
      

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));

app.use(
  cors({
    credentials: true,
    origin: process.env.FRONTEND_APP_URL
  })
);

app.set("trust proxy", 1);

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: false,
  cookie: {
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    secure: process.env.NODE_ENV === 'production',
  }
}));

app.use(passport.initialize());
app.use(passport.session());


// default value for title local
app.locals.title = 'Skill Swap';



const index = require('./routes/index');
app.use('/', index);

const skillRoutes = require('./routes/skill-routes');
app.use('/api', skillRoutes);

const reviewRoutes = require('./routes/review-routes');
app.use('/api', reviewRoutes);

const profileRoutes = require('./routes/profile-routes');
app.use('/api', profileRoutes);

const authRoutes = require('./routes/auth-routes');
app.use('/api', authRoutes);

module.exports = app;
