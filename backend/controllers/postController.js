const passport = require('passport');
const jwt = require('jsonwebtoken');
const passportJWT = require("passport-jwt");
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

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

const Post = require('../models/postModel');
