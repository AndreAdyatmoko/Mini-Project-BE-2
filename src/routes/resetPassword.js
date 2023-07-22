const router = require('express').Router();
const { verify } = require('jsonwebtoken');
const {forgotPassword, resetPassword } = require('../controllers/resetPassword');


router.put('/forgot', forgotPassword);
router.patch('/reset',resetPassword );

module.exports = router;