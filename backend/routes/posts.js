const express = require('express');
const router = express.Router();

const PostController = require('../controllers/postController');

router.get('/', function (req, res, next) {
  return res.json({ message: 'not yet implemented' });
});

router.post('/create', )

module.exports = router;
