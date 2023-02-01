const express = require('express');
const router = express.Router();

const CommentController = require('../controllers/commentController');

router.get('/', function (req, res, next) {
  return res.json({ message: 'not yet implemented' });
});

module.exports = router;
