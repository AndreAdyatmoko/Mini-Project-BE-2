const router = require('express').Router();
const {forgotPassword, resetPassword } = require('../controllers/resetPassword');
const passwordValidatorMiddleware = require('../middlewares/resetPassMid');

router.put('/forgot', forgotPassword);
router.patch('/reset',passwordValidatorMiddleware,resetPassword );

module.exports = router;