const passport = require('passport');
const jwt = require('jsonwebtoken');

const User = require('../models/userModel');
const { createFakeUsers } = require('../fakeData');

exports.login_with_fb = [
  passport.authenticate('facebook', { scope: ['email'] }),
];

exports.fb_login_redirect = (req, res, next) => {
  passport.authenticate('facebook', { session: false }, async (err, user, msg) => {
    if (err) return res.status(400).redirect(`${process.env.CLIENT_DOMAIN}login`);
    if (!user) return res.status(401).redirect(`${process.env.CLIENT_DOMAIN}login`);
    user.status_online = true;
    try {
      const savedUser = await user.save();
      const jsonifiedPayload = JSON.stringify(savedUser.id);
      const token = jwt.sign(jsonifiedPayload, process.env.JWT_SECRET);
      return res.redirect(`${process.env.CLIENT_DOMAIN}login/${token}`);
    } catch (error) {
      if (error) return res.status(400).redirect(`${process.env.CLIENT_DOMAIN}login`);
    }
  })(req, res, next)
};

exports.get_logged_in_user = [
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    try {
      const user = await req.user
      return res.json(user);
    } catch (error) {
      return res.json(error.stack);
    }
  }
];

exports.logout = [
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    try {
      const requestedUser = await req.user;
      const thisUser = await User.findById(requestedUser.id).exec();
      if (!thisUser) {
        req.logout((err) => {
          if (err) return res.json(err);
        });
      }
      thisUser.status_online = false;
      const loggedOffUser = await thisUser.save();
      req.logout((err) => {
        if (err) return res.json(err);
      });
    } catch (error) {
      if (error) return res.status(400).json(error.stack);
    }
  }
];

exports.login_as_guest = async (req, res, next) => {
  const guestId = "63e0ceafc3f4f4d5abf3874e";
  try {
    const user = await User.findById(guestId, "uid email display_name status_online").exec();
    if (!user) return res.status(404).json("OOPS, something went wrong. This action can't be completed.");
    user.status_online = true;
    const savedUser = await user.save();
    const payload = JSON.stringify(savedUser.id);
    const token = jwt.sign(payload, process.env.JWT_SECRET);
    const result = { token, savedUser };
    return res.json(result);
  } catch (err) {
    if (err) return res.status(400).json(err.stack);    
  }
};

exports.search_user = [
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    try {
      const users = await User.find({ "display_name": { "$regex": req.body.q, "$options": "i" } }, "display_name status_online").exec();
      if (!users || users.length === 0) return res.status(404).json("No user found");
      return res.json(users);
    } catch (err) {
      if (err) return res.status(400).json(err.stack);
    }
  }
];

exports.get_user_details = [
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    try {
      const user = await User.findById(req.params.id).exec();
      if (!user) return res.status(404).json("User not found");
      return res.json(user);
    } catch (err) {
      if (err) return res.status(400).json(err.stack);      
    }
  }
];

exports.get_user_name = [
  passport.authenticate('jwt', { session: false }),
  async(req, res, next) => {
    try {
      const user = await User.findById(req.params.id, "display_name status_online").exec();
      if (!user) return res.status(404).json("User not found");
      return res.json(user);
    } catch (error) {
      if (err) return res.status(400).json(err.stack);
    }
  }
];

exports.post_friend_request = [
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    try {
      const authUser = await req.user;
      const currentUserID = authUser.id;
      const targetUserID = req.params.id;
      const targetUser = await User.findById(targetUserID).exec();
      if (!targetUser) return res.status(404).json("OOPS! User not found!");
      if (targetUser.friends_list.includes(currentUserID)) {
        return res.status(200).json("You are already friends with this user!");
      }
      targetUser.friend_requests.push(currentUser);
      const savedTargetUser = await targetUser.save();
      return res.status(200).json("Friend Request sent");
    } catch (err) {
      if (err) return res.status(400).json(err.stack);      
    }
  }
];

exports.get_friends_list = [
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    try {
      const user = await User.findById(req.params.id)
        .populate("friends_list", "display_name status_online")
        .exec();
      return res.json(user.friends_list);
    } catch (err) {
      if (err) return res.status(400).json(err.stack);
    }
  }
];

exports.accept_friend_request = [
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    try {
      const authUser = await req.user;
      const currentUserID = authUser.id;
      const targetUserID = req.params.requestId;
      const currentUser = await User.findById(currentUserID).exec();
      const isFriend = currentUser.friends_list.includes(targetUserID);
      if (!isFriend) {
        currentUser.friend_requests.pull(targetUserID);
        currentUser.friends_list.push(targetUserID);
      } else {
        currentUser.friend_requests.pull(targetUserID);
      }
      const savedCurrentUser = await currentUser.save();
      const targetUser = User.findById(targetUserID).exec();
      if (!targetUser) return res.status(404).json("User not found");
      const isAlreadyFriend = targetUser.friends_list.includes(currentUserID);
      if (!isAlreadyFriend) {
        targetUser.friend_requests.pull(currentUserID);
        targetUser.friends_list.push(currentUserID);
      } else {
        targetUser.friend_requests.pull(currentUserID);
      }
      const savedTargetUser = await targetUser.save();
      return res.json("Friend request accepted");
    } catch (err) {
      if (err) return res.status(400).json(err.stack);
    }
  }
];
