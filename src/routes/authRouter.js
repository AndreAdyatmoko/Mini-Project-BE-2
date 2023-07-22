const {authController} = require('../controllers');
const router = require('express').Router();
const passwordValidatorMiddleware = require('../middlewares/passwordValidator')
const {verifyToken} = require('../middlewares/verify')

router.post('/register', passwordValidatorMiddleware, authController.register);
router.patch('/verify/:id/:token', authController.verifyEmail);
router.post('/login', authController.login);

module.exports = router;
