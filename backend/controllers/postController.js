const passport = require('passport');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require("express-validator");

const Post = require('../models/postModel');
const User = require('../models/userModel');

exports.create_post = [
  passport.authenticate('jwt', { session: false }),
  body("content")
    .trim()
    .isLength({min: 1})
    .withMessage("Content is required")
    .isLength({max: 1024})
    .withMessage("Maximum character limit reached")
    .escape(),
  (req, res, next) => {
    console.log(req.body);
    const author = req.user;
    const result = validationResult(req);
    if(!result.isEmpty()) {
      return res.status(406).json(result.errors[0].msg)
    };
    const newPost = new Post({
      post_content: req.body.content,
      time_stamp: Date.now(),
      post_author: author._id,
    });
    newPost.save((err, post) => {
      if (err) return res.status(400).json(err);
      author.posts_list.push(post._id);
      author.save((err) => {
        if (err) return res.status(400).json(err);
      })
      return res.json(post)
    })
  }
]

exports.get_post = [
  passport.authenticate('jwt', {session: false}),
  (req, res, next) => {
    Post.findById(req.params.postId)
    .populate("post_author")
    .exec((err, post) => {
      if (err) return res.status(400).json(err);
      return res.json(post)
    });
  }
];

exports.like_post = [
  passport.authenticate('jwt', {session: false}),
  (req, res, next) => {
    const whoLiked = req.user._id;
    const whichPost = req.params.postId;
    Post.findById(whichPost)
      .populate("post_author")
      .exec((err, post) => {
        const likesArray = post.post_likes;
        const doesExist = post.post_likes.some(id => id.equals(whoLiked));
        if(doesExist) {
          post.post_likes = post.post_likes.filter(id => !id.equals(whoLiked));
          post.save((err, updatedPost) => {
            if (err) return res.status(400).json(err);
            return res.json(updatedPost);
          })
        } else {
          post.post_likes.push(whoLiked);
          post.save((err, updatedPost) => {
            if (err) return res.status(400).json(err);
            return res.json(updatedPost);
          })
        }
      })
  }
];

exports.edit_post = [];

exports.delete_post = [];
