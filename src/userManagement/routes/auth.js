const { Router } = require('express');
const { body } = require('express-validator/check');

const { AuthService } = require('../services/auth');
const { asyncHandler } = require('../../utils/express/asyncHandler');
const { validateMiddleware } = require('../../utils/express/validateMiddleware');

const router = Router();

const validators = [body('password').exists(), body('name').exists()];

router.post('/signup', validators, validateMiddleware, asyncHandler(AuthService.signUp));
router.post('/signin', validators, validateMiddleware, asyncHandler(AuthService.signIn));
router.post('/logout', AuthService.verify, asyncHandler(AuthService.logOut));

module.exports = router;
