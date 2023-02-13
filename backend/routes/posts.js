const express = require('express');

const router = express.Router();

const PostController = require('../controllers/postController');

router.get('/newsfeed', PostController.get_newsfeed);

router.get('/:postId', PostController.get_post);

router.put('/:postId/like', PostController.like_post);

router.put('/:postId/edit', PostController.edit_post);

router.delete('/:postId', PostController.delete_post);

router.post('/create', PostController.create_post);

module.exports = router;
