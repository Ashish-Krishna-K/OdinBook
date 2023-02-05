require('dotenv').config();
const express = require('express');
const cors = require('cors')
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
const mongoDb = process.env.MONGOURL;
mongoose.connect(mongoDb, { useUnifiedTopology: true, useNewUrlParser: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "mongo connection error"));

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const postsRouter = require('./routes/posts');
const commentsRouter = require('./routes/comments');

const passport = require('passport');
const jwt = require('jsonwebtoken');
const FacebookStrategy = require('passport-facebook');
const passportJWT = require("passport-jwt");
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

const User = require('./models/userModel')

passport.use(new FacebookStrategy(
  {
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: '/api/users/login/facebook/redirect',
    profileFields: ['id', 'displayName', 'email', 'picture.type(large)'],
  },
  (accessToken, refreshToken, profile, done) => {
    User.findOne({ uid: profile.id })
      .exec((err, user) => {
        if (err) { return done(err) };
        if (user) return done(null, user);
        const newUser = new User({
          uid: profile.id,
          email: profile.emails[0].value,
          display_name: profile.displayName || profile.username,
        });
        newUser.save((err, user) => {
          if (err) { return done(err) };
          return done(null, user)
        });
      });
  }
));

passport.use(new JWTStrategy({
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET
},
  (jwtPayload, done) => {
    User.findById(JSON.parse(jwtPayload), (err, user) => {
      if (err) return done(err);
      if (!user) return done(null, false, "User Not Found")
      return done(null, user);
    })
  }
));


const app = express();

app.use(
  cors({
    origin: "*", // allow to server to accept request from different origin
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true // allow session cookie from browser to pass through
  })
);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());

app.use('/api', indexRouter);
app.use('/api/users', usersRouter);
app.use('/api/posts', postsRouter);
app.use('/api/posts/:postId/comments', commentsRouter);

app.use((req, res, next) => {
  res.status(404).json({
    message: "OOPS, Something went wrong! We can't find what you're looking for."
  })
})

module.exports = app;
