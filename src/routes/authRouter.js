const {authController} = require('../controllers');
const router = require('express').Router();
const passwordValidatorMiddleware = require('../middlewares/passwordValidator')

router.post('/register', passwordValidatorMiddleware, authController.register);
router.patch('/verify', authController.verifyAccount);
router.post('/login', authController.login);

module.exports = router;
