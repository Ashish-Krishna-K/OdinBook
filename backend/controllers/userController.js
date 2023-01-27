const passport = require('passport');
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
    const pic = `https://graph.facebook.com/${profile.id}/picture?width=200&height=200&access_token=${accessToken}`;
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
  passport.authenticate('facebook', { scope: ['email'] })
]

exports.fb_login_redirect = (req, res, next) => {
  passport.authenticate('facebook', (err, user, msg) => {
    if (err) { return res.status(400).json(err) }
    return res.json(user);
  })(req, res, next)
}