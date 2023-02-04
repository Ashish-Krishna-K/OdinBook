const express = require('express');
const router = express.Router({ mergeParams: true });

const CommentController = require('../controllers/commentController');

router.get('/', function (req, res, next) {
  return res.json({ message: 'not yet implemented' });
});

router.get('/:commentId', CommentController.get_comment);

router.put('/:commentId/like', CommentController.like_comment);

router.put('/:commentId/edit', CommentController.edit_comment);

router.delete('/:commentId', CommentController.delete_comment);

router.post('/create', CommentController.create_comment);

module.exports = router;
