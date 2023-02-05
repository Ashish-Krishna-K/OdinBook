const express = require('express');
const router = express.Router();

const UserController = require('../controllers/userController');

router.get('/login/facebook/redirect', UserController.fb_login_redirect);

router.get('/login/facebook', UserController.login_with_fb);

router.get('/login/user', UserController.get_logged_in_user);

router.delete('/logout', UserController.logout);

router.post('/search', UserController.search_user);

router.put('/:id/request_list/:requestId/accept', UserController.accept_friend_request);

router.get('/:id/request_list/:requestId', UserController.get_friend_requests_info);

router.post('/:id/friend_request', UserController.post_friend_request);

router.get('/:id/friends', UserController.get_friends_list);

router.get('/:id', UserController.get_user_details);

module.exports = router;
