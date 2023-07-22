const router = require("express").Router();
const { blogCountryController } = require("../controllers");

router.post("/create", blogCountryController.createCountry);
router.get("/get", blogCountryController.getCountry);

module.exports = router;