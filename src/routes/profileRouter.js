const router = require('express').Router();
const { profileController } = require('../controllers');
const changePhoneMid = require('../middlewares/changePhoneMid');
const changeEmailMid = require('../middlewares/changeEmailMid');
const changeUsernameMid = require('../middlewares/changeUsernameMid');
const { multerUpload } = require('../middlewares/multer');
const { verifyToken } = require('../middlewares/verify');
const requireGantiPassword = require('../middlewares/passwordResetValidator');

router.patch('/changeUsername', verifyToken, changeUsernameMid, profileController.changeUsername);
router.patch('/changePhone',  verifyToken, changePhoneMid, profileController.changePhone);
router.patch('/changeEmail', verifyToken, changeEmailMid, profileController.changeEmail);
router.patch('/changeImage', verifyToken, multerUpload.single('imgProfile'), profileController.changeImage);
router.patch('/changePassword',verifyToken, requireGantiPassword, profileController.changePassword);

module.exports = router;