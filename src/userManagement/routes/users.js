const { Router } = require('express');

const { UserService } = require('../services/user');
const { AuthService } = require('../services/auth');
const { asyncHandler } = require('../../utils/express/asyncHandler');

const router = Router();

router.route('/')
    .get(AuthService.verify, asyncHandler(UserService.get));

module.exports = router;
