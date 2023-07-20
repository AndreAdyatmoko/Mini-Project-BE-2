const router = require('express').Router();
const { profileController } = require('../controllers');
const changePhoneMid = require('../middlewares/changePhoneMid');
const changeEmailMid = require('../middlewares/changeEmailMid');
const changeUsernameMid = require('../middlewares/changeUsernameMid');
const { multerUpload } = require('../middlewares/multer');
const { verifyToken } = require('../middlewares/verify');
const passwordValidatorMiddleware = require('../middlewares/passwordValidator')

router.patch('/changeUsername', changeUsernameMid, profileController.changeUsername);
router.patch('/changePhone',  changePhoneMid, profileController.changePhone);
router.patch('/changeEmail', changeEmailMid, profileController.changeEmail);
router.patch('/changeImage', verifyToken, multerUpload.single('imgProfile'), profileController.changeImage);
router.patch('/changePassword',verifyToken, profileController.changePassword);

module.exports = router;