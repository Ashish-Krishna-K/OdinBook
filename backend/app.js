require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');

mongoose.set('strictQuery', false);
const mongoDb = process.env.MONGOURL;
mongoose.connect(mongoDb, { useUnifiedTopology: true, useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'mongo connection error'));

const passport = require('passport');
const FacebookStrategy = require('passport-facebook');
const passportJWT = require('passport-jwt');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const postsRouter = require('./routes/posts');
const commentsRouter = require('./routes/comments');

const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

const User = require('./models/userModel');

passport.use(new FacebookStrategy(
  {
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: `${process.env.SERVER_DOMAIN}api/users/login/facebook/redirect`,
    profileFields: ['id', 'displayName', 'email', 'picture.type(large)']
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const user = await User.findOne({ uid: profile.id }).exec();
      if (user) return done(null, user);
      const newUser = new User({
        uid: profile.id,
        email: profile.emails[0].value,
        display_name: profile.displayName || profile.username,
        status_online: true
      });
      const saved = await newUser.save();
      return done(null, saved);
    }
    catch (error) {
      if (error) return done(error);
    }
  }
));

passport.use(new JWTStrategy(
  {
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET
  },
  async (jwtPayload, done) => {
    const id = JSON.parse(jwtPayload);
    try {
      const user = User.findById(id, '-friends_list -friend_requests -posts_list').exec();
      if (!user) return done(null, false, 'User Not Found');
      return done(null, user);
    }
    catch (error) {
      if (error) return done(error);
    }
  }
));

const app = express();

app.use(
  cors({
    origin: '*', // allow to server to accept request from different origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
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
app.use('/api/posts', passport.authenticate('jwt', { session: false }), postsRouter);
app.use('/api/posts/:postId/comments', passport.authenticate('jwt', { session: false }), commentsRouter);

app.use((req, res) => {
  res.status(404).json({
    message: "OOPS, Something went wrong! We can't find what you're looking for."
  });
});

module.exports = app;
