const express = require('express');

const router = express.Router();

const PostController = require('../controllers/postController');
const CommentController = require('../controllers/commentController');

/* GET home page. */
router.get('/', (req, res) => res.json({ message: 'not yet implemented' }));

router.post('/fake/create/:id', CommentController.create_fake_comments);

router.post('/fake/create', PostController.create_fake_posts);

module.exports = router;
