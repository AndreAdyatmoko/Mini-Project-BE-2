const router = require("express").Router();
const { blogCategoryController } = require("../controllers");

router.post("/createCategory", blogCategoryController.createCategory);
router.get("/getCategory", blogCategoryController.getCategory);

module.exports = router;