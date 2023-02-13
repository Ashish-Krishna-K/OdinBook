const { body, validationResult } = require('express-validator');

const Post = require('../models/postModel');
const User = require('../models/userModel');
const Comment = require('../models/commentModel');
const Notification = require('../models/notificationModel');
const { createRandomLines } = require('../fakeData');

exports.create_comment = [
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
      const authorId = authUser.id;
      const parentPost = req.params.postId;
      const newComment = new Comment({
        comment_content: req.body.content,
        time_stamp: Date.now(),
        comment_author: authorId,
        parent_post: parentPost
      });
      const savedComment = await newComment.save();
      const post = await Post.findById(parentPost).exec();
      if (!post) return res.status(404).json('Post not found. It may have been deleted or moved');
      post.post_comments.push(savedComment.id);
      await post.save();
      const postAuthor = await User.findById(post.post_author).exec();
      const newNoti = new Notification({
        type: 'comment',
        message: 'has left a comment on your post!',
        for: postAuthor.id,
        from: authorId,
        time_stamp: Date.now()
      });
      const noti = await newNoti.save();
      postAuthor.notifications.push(noti);
      await postAuthor.save();
      return res.json('Comment added');
    }
    catch (err) {
      if (err) return res.status(400).json(err.stack);
    }
  }
];

exports.get_comment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId)
      .populate('comment_author', 'uid display_name status_online')
      .exec();
    if (!comment) return res.status(404).json('Comment not found, it may have been deleted or moved.');
    return res.json(comment);
  }
  catch (err) {
    if (err) return res.status(400).json(err.stack);
  }
};

exports.like_comment = async (req, res) => {
  try {
    const authUser = await req.user;
    const currentUser = authUser.id;
    const targetComment = req.params.commentId;
    const comment = await Comment.findById(targetComment)
      .populate('comment_author', 'uid display_name status_online')
      .exec();
    if (!comment) return res.status(404).json('Comment not found, it may have been deleted or moved.');
    const doesExist = comment.comment_likes.some((id) => id.equals(currentUser));
    if (doesExist) {
      comment.comment_likes = comment.comment_likes.filter((id) => !id.equals(currentUser));
    }
    else {
      comment.comment_likes.push(currentUser);
      const commentAuthor = await User.findById(comment.comment_author.id).exec();
      const newNoti = new Notification({
        type: 'like_comment',
        message: 'has liked your comment!',
        for: commentAuthor.id,
        from: currentUser,
        time_stamp: Date.now()
      });
      const noti = await newNoti.save();
      commentAuthor.notifications.push(noti.id);
    }
    const likedComment = await comment.save();
    return res.json(likedComment);
  }
  catch (err) {
    if (err) return res.status(400).json(err.stack);
  }
};

exports.edit_comment = [
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
      const comment = await Comment.findById(req.params.commentId).exec();
      if (!comment) return res.status(404).json('Comment not found, it may have been deleted or moved.');
      comment.comment_content = req.body.content;
      const updatedcomment = await comment.save();
      return res.json(updatedcomment);
    }
    catch (err) {
      if (err) return res.status(400).json(err.stack);
    }
  }
];

exports.delete_comment = (req, res) => {
  const deleteComment = this.helperDeleteComment(req.params.postId, req.params.commentId);
  deleteComment
    .then((data) => {
      if (!data.noIssues) {
        return res.status(data.status).json(data.msg);
      }
      return res.json(data.msg);
    })
    .catch((error) => {
      if (!error.noIssues) {
        return res.status(error.status).json(error.msg);
      }
      return res.json(error.msg);
    });
};

exports.helperDeleteComment = async (postId, commentId) => {
  try {
    const post = await Post.findByIdAndUpdate(postId, { $pull: { post_comments: commentId } });
    if (!post) return { noIssues: false, status: 404, msg: 'Post not found' };
    const comment = await Comment.findByIdAndDelete(commentId);
    if (!comment) return { noIssues: false, status: 404, msg: 'Comment not found' };
    return { noIssues: true, status: 200, msg: 'Comment Deleted' };
  }
  catch (error) {
    return { noIssues: false, status: 400, msg: error };
  }
};

exports.create_fake_comments = (req, res) => {
  Post.find({}, 'id')
    .exec((err, postsList) => {
      if (err) return res.json(err);
      const postsPromise = Promise.all(postsList.map((post) => {
        const newComment = new Comment({
          comment_content: createRandomLines(),
          time_stamp: Date.now(),
          comment_author: req.params.id,
          parent_post: post.id
        });
        return newComment.save();
      }));
      postsPromise.then((data) => {
        const dataPromises = data.map((cmnt) => Post.findByIdAndUpdate(cmnt.parent_post, {
          $push: { post_comments: cmnt.id }
        }));
        const anotherPromise = Promise.all(dataPromises);
        anotherPromise.then((posts) => res.json(posts));
      }).catch((error) => res.json(error));
    });
};
