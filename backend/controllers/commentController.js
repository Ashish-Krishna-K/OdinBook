const passport = require('passport');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require("express-validator");

const Post = require('../models/postModel');
const User = require('../models/userModel');
const Comment = require('../models/commentModel');

exports.create_comment = [
  passport.authenticate('jwt', { session: false }),
  body("content")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Content is required")
    .isLength({ max: 1024 })
    .withMessage("Maximum character limit reached")
    .escape(),
  (req, res, next) => {
    const author = req.user;
    const parentPost = req.params.postId;
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(406).json(result.errors[0].msg)
    };
    const newComment = new Comment({
      comment_content: req.body.content,
      time_stamp: Date.now(),
      comment_author: author._id,
      parent_post: parentPost,
    });
    newComment.save((err, comment) => {
      if (err) return res.status(400).json(err);
      Post.findById(parentPost, (err, post) => {
        if (err) return res.status(400).json(err);
        if (!post) return res.status(404).json("Post not found. It may have been deleted or moved");
        post.post_comments.push(comment._id);
        post.save((err, thePost) => {
          if (err) return res.status(400).json(err);
          return res.json("Comment added");
        })
      })
    })
  }
];

exports.get_comment = [
  passport.authenticate('jwt', { session: false }),
  (req, res, next) => {
    Comment.findById(req.params.commentId)
      .populate("comment_author", "display_name")
      .exec((err, comment) => {
        if (err) return res.status(400).json(err);
        if (!comment) return res.status(404).json("Comment not found, it may have been deleted or moved.");
        return res.json(comment)
      });
  }
];

exports.like_comment = [
  passport.authenticate('jwt', { session: false }),
  (req, res, next) => {
    const whoLiked = req.user._id;
    const whichComment = req.params.commentId;
    Comment.findById(whichComment)
      .populate("comment_author", "display_name")
      .exec((err, comment) => {
        if (err) return res.status(400).json(err);
        if (!comment) return res.status(404).json("Comment not found, it may have been deleted or moved.");
        const likesArray = comment.comment_likes;
        const doesExist = comment.comment_likes.some(id => id.equals(whoLiked));
        if (doesExist) {
          comment.comment_likes = comment.comment_likes.filter(id => !id.equals(whoLiked));
          comment.save((err, updatedcomment) => {
            if (err) return res.status(400).json(err);
            return res.json(updatedcomment);
          })
        } else {
          comment.comment_likes.push(whoLiked);
          comment.save((err, updatedcomment) => {
            if (err) return res.status(400).json(err);
            return res.json(updatedcomment);
          })
        }
      })
  }
];

exports.edit_comment = [
  passport.authenticate('jwt', { session: false }),
  body("content")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Content is required")
    .isLength({ max: 1024 })
    .withMessage("Maximum character limit reached")
    .escape(),
  (req, res, next) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(406).json(result.errors[0].msg)
    };
    Comment.findById(req.params.commentId, (err, comment) => {
      if (err) return res.status(400).json(err);
      if (!comment) return res.status(404).json("Comment not found, it may have been deleted or moved.");
      comment.comment_content = req.body.content;
      comment.save((err, updatedcomment) => {
        if (err) return res.status(400).json(err);
        return res.json(updatedcomment)
      });
    })
  }
];

exports.delete_comment = [
  passport.authenticate('jwt', { session: false }),
  (req, res, next) => {
    const deleteComment = this.helperDeleteComment(req.params.postId, req.params.commentId);
    deleteComment
      .then(data => {
        if (!data.noIssues) {
          return res.status(data.status).json(data.msg);
        }
        return res.json(data.msg);
      })
      .catch(error => {
        if (!error.noIssues) {
          return res.status(error.status).json(error.msg);
        }
        return res.json(error.msg);
      })
  },
];

exports.helperDeleteComment = async (postId, commentId) => {
  try {
    const post = await Post.findByIdAndUpdate(postId, { $pull: { post_comments: commentId } })
    if (!post) return { noIssues: false, status: 404, msg: "Post not found" };
    const comment = await Comment.findByIdAndDelete(commentId);
    if (!comment) return { noIssues: false, status: 404, msg: "Comment not found" };
    return { noIssues: true, status: 200, msg: "Comment Deleted" };
  } catch (error) {
    return { noIssues: false, status: 400, msg: error }
  }
}