const express = require('express');
const router = express.Router();
const {blogController} = require('../controllers');
const {verifyToken} = require('../middlewares/verify');
const {multerUpload} = require('../middlewares/multer');

router.get("/get/:id", blogController.getBlogById);
router.post("/create", verifyToken, multerUpload.single('imgBlog') ,blogController.createBlog);
router.get("/get", blogController.getBlogbyQuery);

module.exports = router;