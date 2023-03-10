/* eslint-disable camelcase */
const { body, validationResult } = require('express-validator');

const Post = require('../models/postModel');
const User = require('../models/userModel');
const CommentController = require('./commentController');
const Notification = require('../models/notificationModel');
const { createRandomLines } = require('../fakeData');

exports.create_post = [
  body('content')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Content is required')
    .isLength({ max: 1024 })
    .withMessage('Maximum character limit reached')
    .escape(),
  async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(406).json(result.errors[0].msg);
    }
    try {
      const authUser = await req.user;
      const author = authUser.id;
      const newPost = new Post({
        post_content: req.body.content,
        time_stamp: Date.now(),
        post_author: author
      });
      const savedPost = await newPost.save();
      const user = await User.findById(author).exec();
      user.posts_list.push(savedPost.id);
      await user.save();
      return res.json(savedPost);
    }
    catch (err) {
      if (err) return res.status(400).json(err.stack);
    }
  }
];

exports.get_post = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId)
      .populate('post_author', 'uid display_name status_online')
      .exec();
    if (!post) return res.status(404).json('Post not found. It may have been deleted or moved');
    return res.json(post);
  }
  catch (err) {
    if (err) return res.status(400).json(err.stack);
  }
};

exports.like_post = async (req, res) => {
  try {
    const authUser = await req.user;
    const currentUser = authUser.id;
    const targetPost = req.params.postId;
    const post = await Post.findById(targetPost).populate('post_author').exec();
    if (!post) return res.status(404).json('Post not found. It may have been deleted or moved');
    const doesExist = post.post_likes.some((id) => id.equals(currentUser));
    if (doesExist) {
      post.post_likes = post.post_likes.filter((id) => !id.equals(currentUser));
    }
    else {
      post.post_likes.push(currentUser);
    }
    const savedPost = await post.save();
    const postAuthor = await User.findById(savedPost.post_author.id).exec();
    const newNoti = new Notification({
      type: 'like_post',
      message: 'has liked your post',
      for: post.post_author.id,
      from: currentUser,
      time_stamp: Date.now()
    });
    const noti = await newNoti.save();
    postAuthor.notifications.push(noti.id);
    await postAuthor.save();
    return res.json(savedPost);
  }
  catch (err) {
    if (err) return res.status(400).json(err.stack);
  }
};

exports.edit_post = [
  body('content')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Content is required')
    .isLength({ max: 1024 })
    .withMessage('Maximum character limit reached')
    .escape(),
  async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(406).json(result.errors[0].msg);
    }
    try {
      const post = await Post.findById(req.params.postId).exec();
      if (!post) return res.status(404).json('Post not found. It may have been deleted or moved');
      post.post_content = req.body.content;
      const updatedPost = await post.save();
      return res.json(updatedPost);
    }
    catch (err) {
      if (err) return res.status(400).json(err.stack);
    }
  }
];

exports.delete_post = async (req, res) => {
  try {
    const authUser = await req.user;
    const currentUser = authUser.id;
    const post = await Post.findById(req.params.postId).exec();
    if (!post) return res.status(404).json('Post not found. It may have been deleted or moved');
    const comments = post.post_comments;
    const aPromise = async (comment) => CommentController.helperDeleteComment(post.id, comment);
    const commentsPromise = comments.map(aPromise);
    const results = Promise.all(commentsPromise);
    results.then((data) => {
      const ind = data.findIndex(({ noIssues }) => noIssues === false);
      if (ind >= 0) return res.status(data[ind].status).json(data[ind].msg);
      Post.findByIdAndDelete(req.params.postId, (err) => {
        if (err) return res.status(400).json(err);
        User.findByIdAndUpdate(currentUser, { $pull: { posts_list: req.params.postId } })
          .exec((error) => {
            if (error) return res.status(400).json(error);
            return res.json('Post Deleted');
          });
      });
    }).catch((error) => {
      console.log(error);
      return res.status(error.status).json(error.msg);
    });
  }
  catch (err) {
    if (err) return res.status(400).json(err.stack);
  }
};

exports.get_newsfeed = async (req, res) => {
  try {
    const authUser = await req.user;
    const currentUserID = authUser.id;
    const currentUser = await User.findById(currentUserID).exec();
    const { friends_list, posts_list } = currentUser;
    const postsPromise = Promise.all(friends_list.map(async (friend) => {
      const friendDoc = await User.findById(friend, 'posts_list');
      const postsCount = friendDoc.posts_list.length;
      if (postsCount <= 0) return null;
      return friendDoc.posts_list[postsCount - 1];
    }));
    postsPromise
      .then((data) => {
        if (posts_list.length > 0) {
          const selfLastPost = posts_list[posts_list.length - 1];
          const toSend = data.filter((item) => item);
          toSend.unshift(selfLastPost);
          return res.json(toSend);
        }
      }).catch((error) => res.status(error.status).json(error));
  }
  catch (err) {
    return res.status(400).json(err.stack);
  }
};

exports.create_fake_posts = (req, res) => {
  User.find({}, 'id')
    .exec((err, userList) => {
      if (err) return res.json(err);
      const usersPromise = Promise.all(userList.map((user) => {
        const newPost = new Post({
          post_content: createRandomLines(),
          time_stamp: Date.now(),
          post_author: user.id
        });
        return newPost.save();
      }));
      usersPromise.then((data) => {
        const lotsOfPromises = data.map((post) => User.findByIdAndUpdate(post.post_author, {
          $push: { posts_list: post.id }
        }));
        const anotherUserPromise = Promise.all(lotsOfPromises);
        anotherUserPromise.then((users) => res.json(users));
      }).catch((error) => res.json(error));
    });
};
