const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/user");

const router = express.Router();

router.get("/", checkNotAuthenticated, (req, res) => {
  res.render("login/register.ejs");
});

router.post("/", checkNotAuthenticated, async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      articles: [
        {
          title: `${req.body.name} article ${new Date().toLocaleString()}`,
          description: "User-added and default article display",
        },
        {
          title: `${req.body.email} call ${new Date().toLocaleString()}`,
          description: "User-added and default article display",
        },
      ],
    });
    await user.save();
    res.redirect("/login");
  } catch (error) {
    console.log(error);
    req.flash("error_message", "Registration failed. Please try again.");
    res.redirect("/register");
  }
});

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/");
  }
  next();
}

module.exports = router;
