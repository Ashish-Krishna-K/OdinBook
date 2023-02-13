const express = require('express');

const router = express.Router();

const UserController = require('../controllers/userController');

router.get('/notification/:id', UserController.get_notification);

router.get('/guest/login', UserController.login_as_guest);

router.get('/login/facebook/redirect', UserController.fb_login_redirect);

router.get('/login/facebook', UserController.login_with_fb);

router.get('/login/user', UserController.get_logged_in_user);

router.delete('/logout', UserController.logout);

router.post('/search', UserController.search_user);

router.put('/friend_request/:requestId/accept', UserController.accept_friend_request);

router.put('/:id/friend_request', UserController.post_friend_request);

router.get('/:id/friends', UserController.get_friends_list);

router.get('/:id/short', UserController.get_user_name);

router.get('/:id', UserController.get_user_details);

module.exports = router;
