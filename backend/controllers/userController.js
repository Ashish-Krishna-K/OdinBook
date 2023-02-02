/*
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

*/

const passport = require('passport');
const jwt = require('jsonwebtoken');

const User = require('../models/userModel');

exports.login_with_fb = [
  passport.authenticate('facebook', { scope: ['email'] }),
];

exports.fb_login_redirect = (req, res, next) => {
  passport.authenticate('facebook', { session: false }, (err, user, msg) => {
    if (err) { return res.status(400).json(err) }
    const tokenizePayload = JSON.stringify(user._id);
    const token = jwt.sign(tokenizePayload, process.env.JWT_SECRET);
    return res.redirect(`${process.env.CLIENT_DOMAIN}/login/${token}`)
  })(req, res, next)
};

exports.get_logged_in_user = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user, msg) => {
    if (err) return res.status(400).json(err);
    console.log(72, err, user, msg);
    if (!user) return res.status(404).json(msg);
    return res.json(user)
  })(req, res, next)
}

exports.search_user = [
  passport.authenticate('jwt', { session: false }),
  (req, res, next) => {
    User.find({ "display_name": { "$regex": req.body.q, "$options": "i" } }, "display_name uid")
      .exec((err, results) => {
        if (err) return res.status(400).json(err);
        if (!results || results.length === 0) return res.status(404).json("No user found");
        return res.json(results);
      })
  }
];

exports.get_user_details = [
  passport.authenticate('jwt', { session: false }),
  (req, res, next) => {
    User.findById(req.params.id, (err, user) => {
      if (err) return res.status(400).json(err);
      if (!user) return res.status(404).json("User not found");
      return res.json(user);
    })
  }
];

exports.post_friend_request = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user, msg) => {
    if (err) return res.status(400).json(err);
    const { _id } = user;
    User.findById(req.body.id, (err, user) => {
      if (err) return res.status(400).json(err);
      if (!user) return res.status(404).json(msg);
      user.friend_requests.push(_id);
      user.save((err) => {
        if (err) return res.status(400).json(err);
        return res.status(200).json("Friend Request sent");
      });
    })
  })(req, res, next)
};

exports.get_friends_list = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user, msg) => {
    if (err) return res.status(400).json(err);
    User.findById(user._id)
      .populate("friends_list", "display_name")
      .exec((err, user) => {
        if (err) return res.status(400).json(err);
        return res.json(user.friends_list);
      })
  })(req, res, next)
}

exports.get_friend_requests_info = [
  passport.authenticate('jwt', { session: false }),
  (req, res, next) => {
    User.findById(req.params.requestId, "display_name")
      .exec((err, user) => {
        if (err) return res.status(400).json(err);
        if (!user) return res.status(404).json("User not found");
        return res.json(user);
      })
  }
];

exports.accept_friend_request = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user, msg) => {
    if (err) return res.status(400).json(err);
    if (!user) return res.status(404).json(msg);
    const currentUser = user._id;
    const targetUser = req.params.requestId
    User.findById(currentUser, (err, user) => {
      if (err) return res.status(400).json(err);
      if (!targetUser) return res.status(404).json("User not found");
      user.friend_requests = user.friend_requests.filter(id => !id.equals(targetUser));
      if (!user.friends_list.includes(targetUser)) {
        user.friends_list.push(targetUser);
      }
      user.save((err, updatedCurrentUser) => {
        if (err) return res.status(400).json(err);
        User.findById(targetUser, (err, user) => {
          if (err) return res.status(400).json(err);
          if (!user) return res.status(404).json(msg);
          if (!user.friends_list.includes(updatedCurrentUser._id)) {
            user.friends_list.push(updatedCurrentUser._id);
          }
          user.save((err) => {
            if (err) return res.status(400).json(err);
            return res.status(200).json("Friend request accepted")
          })
        })
      })
    })
  })(req, res, next)
};
