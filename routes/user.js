const express = require("express");
const router = express.Router();
const user = require("../models/user.js");
const WrapAsync = require("../utils/WrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const usercontroller= require("../controllers/users.js");

router.route("/signup")
.get((req, res) => {res.render("users/signup.ejs");})
.post(WrapAsync(usercontroller.signup)
);

router.route("/login")
.get(usercontroller.rendersingupform)
.post(saveRedirectUrl,passport.authenticate("local", { failureRedirect: "/login",failureFlash: true }),   usercontroller.login);


router.get("/logout", usercontroller.logout );

module.exports = router;