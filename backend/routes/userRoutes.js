const express = require('express');
const userControllers = require('../controllers/userControllers');
const fileUpload = require('../middleware/fileUpload');
const {check} = require('express-validator');

const router = express.Router();

router.post('/signup', fileUpload.single('image'), [check('username').isLength({min: 1}).withMessage('Username is empty.'), check('email').normalizeEmail().isEmail().withMessage('Email is invalid.'), check('password').isLength({min: 8}).withMessage('Password must be at least 8 characters.')], userControllers.signup);
router.post('/login', userControllers.login);

module.exports = router;