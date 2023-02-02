const passport = require('passport');
const jwt = require('jsonwebtoken');
const FacebookStrategy = require('passport-facebook');
const passportJWT = require("passport-jwt");
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

const User = require('../models/userModel')

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
