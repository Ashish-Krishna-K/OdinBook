const passport = require('passport');
const jwt = require('jsonwebtoken');
const FacebookStrategy = require('passport-facebook');
const User = require('../models/userModel');

passport.use(new FacebookStrategy(
  {
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: '/api/users/login/facebook/redirect',
    profileFields: ['id', 'displayName', 'email', 'picture.type(large)'],
  },
  (accessToken, refreshToken, profile, done) => {
    const pic = `https://graph.facebook.com/${profile.id}/picture?width=200&height=200&access_token=${process.env.FACEBOOK_CLIENT_TOKEN}`;
    User.findOne({ uid: profile.id })
      .exec((err, user) => {
        if (err) { return done(err) };
        if (user) return done(null, user);
        const newUser = new User({
          uid: profile.id,
          email: profile.emails[0].value,
          display_name: profile.displayName || profile.username,
          display_picture: pic,
        });
        newUser.save((err, user) => {
          if (err) { return done(err) };
          return done(null, user)
        });
      });
  }
))

exports.login_with_fb = [
  passport.authenticate('facebook', { scope: ['email'] }),
]

exports.fb_login_redirect = (req, res, next) => {
  passport.authenticate('facebook', { session: false }, (err, user, msg) => {
    if (err) { return res.status(400).json(err) }
    const tokenizePayload = JSON.stringify(user._id);
    const token = jwt.sign(tokenizePayload, process.env.JWT_SECRET);
    return res.redirect(`${process.env.CLIENT_DOMAIN}/login/${token}`)
  })(req, res, next)
}

exports.search_user = (req, res, next) => {
  User.find({ "display_name": { "$regex": req.body.q, "$options": "i" } }, "display_name uid")
    .exec((err, user) => {
      if (err) return res.status(400).json(err);
      if (!user || user.length === 0) return res.status(404).json("No user found");
      return res.json(user);
    })
}