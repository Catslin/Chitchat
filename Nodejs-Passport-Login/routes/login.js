const express = require("express");
const passport = require("passport");
const router = express.Router();

router.get("/", checkNotAuthenticated, (req, res) => {
  res.render("login/login.ejs");
});

router.post(
  "/",
  checkNotAuthenticated,
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
  })
);

// Middleware function
function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/");
  }
  next();
}

module.exports = router;
