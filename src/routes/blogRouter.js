const express = require('express');
const router = express.Router();
const {blogController} = require('../controllers');
const {verifyToken} = require('../middlewares/verify');

router.get("/get/:id", blogController.getBlogById);
router.post("/create", verifyToken ,blogController.createBlog);
router.get("/get", blogController.getBlogbyQuery);

module.exports = router;