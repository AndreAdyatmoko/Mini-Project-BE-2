const authController = require("./authController");
const blogController = require("./blogControllers")
const blogCategoryController = require("./blogCategoryController");
const profileController = require("./profileControllers");
const resetPassword= require("./resetPassword")

module.exports = { authController, blogController, blogCategoryController, profileController, resetPassword };
