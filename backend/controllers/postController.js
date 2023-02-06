const { body, validationResult } = require("express-validator");

const Post = require('../models/postModel');
const User = require('../models/userModel');
const CommentController = require('../controllers/commentController');
const { createRandomLines } = require("../fakeData");

exports.create_post = [
  body("content")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Content is required")
    .isLength({ max: 1024 })
    .withMessage("Maximum character limit reached")
    .escape(),
  (req, res, next) => {
    const author = req.user.id;
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(406).json(result.errors[0].msg)
    };
    const newPost = new Post({
      post_content: req.body.content,
      time_stamp: Date.now(),
      post_author: author,
    });
    newPost.save((err, post) => {
      if (err) return res.status(400).json(err);
      User.findById(author, (err, user) => {
        if (err) return res.status(400).json(err);
        user.posts_list.push(post.id);
        user.save((err) => {
          if (err) return res.status(400).json(err);
          return res.json(post);
        })
      })
    })
  }
]

exports.get_post = (req, res, next) => {
  Post.findById(req.params.postId)
    .populate("post_author")
    .exec((err, post) => {
      if (err) return res.status(400).json(err);
      if (!post) return res.status(404).json("Post not found. It may have been deleted or moved")
      return res.json(post)
    });
};

exports.like_post = (req, res, next) => {
  const whoLiked = req.user._id;
  const whichPost = req.params.postId;
  Post.findById(whichPost)
    .populate("post_author")
    .exec((err, post) => {
      if (err) return res.status(400).json(err);
      if (!post) return res.status(404).json("Post not found. It may have been deleted or moved");
      const likesArray = post.post_likes;
      const doesExist = post.post_likes.some(id => id.equals(whoLiked));
      if (doesExist) {
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
};

exports.edit_post = [
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
    Post.findById(req.params.postId, (err, post) => {
      if (err) return res.status(400).json(err);
      if (!post) return res.status(404).json("Post not found. It may have been deleted or moved");
      post.post_content = req.body.content;
      post.save((err, updatedPost) => {
        if (err) return res.status(400).json(err);
        return res.json(updatedPost)
      });
    })
  }
];

exports.delete_post = (req, res, next) => {
  Post.findById(req.params.postId, (err, post) => {
    if (err) return res.status(400).json(err);
    if (!post) return res.status(404).json("Post not found. It may have been deleted or moved");
    const comments = post.post_comments;
    const results = Promise.all(comments.map(async (comment) => {
      return await CommentController.helperDeleteComment(post._id, comment);
    }));
    results.then(data => {
      const ind = data.findIndex(({ noIssues }) => noIssues === false);
      if (ind >= 0) return res.status(data[ind].status).json(data[ind].msg);
      Post.findByIdAndDelete(req.params.postId, (err) => {
        if (err) return res.status(400).json(err);
        User.findByIdAndUpdate(req.user._id, { $pull: { posts_list: req.params.postId } })
          .exec((err) => {
            if (err) return res.status(400).json(err);
            return res.json("Post Deleted");
          })

      });
    }).catch(error => {
      console.log(error);
      return res.status(error.status).json(error.msg);
    })
  });
};

exports.get_newsfeed = (req, res, next) => {
  User.findById(req.user.id, (err, currentUser) => {
    const { id, friends_list, posts_list } = currentUser;
    const postsPromise = Promise.all(friends_list.map(async (friend) => {
      const friendDoc = await User.findById(friend, "posts_list")
      const postsCount = friendDoc.posts_list.length;
      if (postsCount <= 0) return null;
      return friendDoc.posts_list[postsCount - 1];
    }));
    postsPromise
      .then(data => {
        if (posts_list.length > 0) {
          const selfLastPost = posts_list[posts_list.length - 1];
          const toSend = data.filter(item => item);
          toSend.unshift(selfLastPost);
          return res.json(toSend);
        }
      }).catch(error => {
        return res.status(error.status).json(error);
      })
  })
};


exports.create_fake_posts = (req, res, next) => {
  User.find({}, "id")
    .exec((err, userList) => {
      if (err) return res.json(err);
      const usersPromise = Promise.all(userList.map(user => {
        const newPost = new Post({
          post_content: createRandomLines(),
          time_stamp: Date.now(),
          post_author: user.id
        });
        return newPost.save();
      }))
      usersPromise.then(data => {
        const usersPromise = Promise.all(data.map(post => {
          return User.findByIdAndUpdate(post.post_author, {
            $push: { posts_list: post.id }
          })
        }))
        usersPromise.then(users => res.json(users))
      }).catch(error => {
        return res.json(error)
      })
    })
};

