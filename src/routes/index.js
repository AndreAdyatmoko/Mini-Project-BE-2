const authRouter = require("./authRouter");
const blogRouter = require("./blogRouter");
const categoryRouter = require("./categoryRoutes");
const profileRouter = require("./profileRouter");
const resetPassword = require("./resetPassword");


module.exports = {
    authRouter,
    blogRouter,
    categoryRouter,
    profileRouter,
    resetPassword
}