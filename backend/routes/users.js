const express = require('express');
const router = express.Router();

const UserController = require('../controllers/userController');

router.get('/', function (req, res, next) {
  return res.json({ message: 'not yet implemented' });
});

router.get('/login/facebook', UserController.login_with_fb);

router.get('/login/facebook/redirect', UserController.fb_login_redirect);

router.post('/search', UserController.search_user);

module.exports = router;
