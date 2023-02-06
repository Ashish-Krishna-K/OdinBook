const passport = require('passport');
const jwt = require('jsonwebtoken');

const User = require('../models/userModel');

exports.login_with_fb = [
  passport.authenticate('facebook', { scope: ['email'] }),
];

exports.fb_login_redirect = [
  passport.authenticate('facebook', { session: false }),
  (req, res, next) => {
    const redirectTo = req.get('Referer');
    const jsonifiedPayload = JSON.stringify(req.user._id);
    const token = jwt.sign(jsonifiedPayload, process.env.JWT_SECRET);
    return res.redirect(`${redirectTo}login/${token}`)
  }
];

exports.get_logged_in_user = [
  passport.authenticate('jwt', { session: false }),
  (req, res, next) => {
    res.json(req.user);
  }
];

exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) return res.json(err);
  });
  return res.status(204).json("You have logged out!");
};

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

exports.get_user_name  = [
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

exports.post_friend_request = [
  passport.authenticate('jwt', { session: false }),
  (req, res, next) => {
    const currentUser = req.user._id;
    const targetUser = req.body.id;
    User.findById(targetUser, (err, user) => {
      if (err) return res.status(400).json(err);
      if (!user) return res.status(404).json("OOPS! User not found!");
      if (!user.friends_list.includes(currentUser)) {
        user.friend_requests.push(currentUser);
        user.save((err) => {
          if (err) return res.status(400).json(err);
          return res.status(200).json("Friend Request sent");
        });
      }
    })
  }
];

exports.get_friends_list = [
  passport.authenticate('jwt', { session: false }),
  (req, res, next) => {
    User.findById(req.user._id)
      .populate("friends_list", "display_name")
      .exec((err, user) => {
        if (err) return res.status(400).json(err);
        return res.json(user.friends_list);
      })
  }
];

exports.accept_friend_request = [
  passport.authenticate('jwt', { session: false }),
  (req, res, next) => {
    const currentUser = req.user._id;
    const targetUser = req.params.requestId;
    User.findById(currentUser, (err, user) => {
      if (err) return res.status(400).json(err);
      const isFriend = user.friends_list.includes(targetUser);
      if (!isFriend) {
        user.friend_requests.pull(targetUser);
        user.friends_list.push(targetUser);
      } else {
        user.friend_requests.pull(targetUser);
      }
      user.save((err) => {
        if (err) return res.status(400).json(err);
        User.findById(targetUser, (err, user) => {
          if (err) return res.status(400).json(err);
          if (!user) return res.status(404).json("User not found");
          const isAlreadyFriend = user.friends_list.includes(currentUser);
          if (!isAlreadyFriend) {
            user.friend_requests.pull(targetUser);
            user.friends_list.push(targetUser);
          } else {
            user.friend_requests.pull(targetUser);
          }
          user.save((err) => {
            if (err) return res.status(400).json(err);
            return res.json("Friend request accepted");
          })
        })
      })
    })
  }
];
