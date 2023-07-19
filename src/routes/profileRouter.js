const router = require('express').Router();
const { profileController } = require('../controllers');
const changePhoneMid = require('../middlewares/changePhoneMid');
const changeEmailMid = require('../middlewares/changeEmailMid');
const changeUsernameMid = require('../middlewares/changeUsernameMid');

router.patch('/changeUsername', changeUsernameMid, profileController.changeUsername);
router.patch('/changePhone',  changePhoneMid, profileController.changePhone);
router.patch('/changeEmail', changeEmailMid, profileController.changeEmail);

module.exports = router;