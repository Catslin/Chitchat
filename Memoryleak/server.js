const express = require("express");
const Article = require("./models/article");
const articleRouter = require("./routes/articles");
const loginRouter = require("./routes/login");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const flash = require("express-flash");
const bcrypt = require("bcryptjs");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("./models/user");
const registerRouter = require("./routes/register.js");
const app = express();

mongoose.connect("mongodb://127.0.0.1:27017/chai", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

// Passport configuration
passport.use(
  new LocalStrategy(
    { usernameField: "email" },
    async (email, password, done) => {
      const user = await User.findOne({ email: email });
      if (!user) {
        return done(null, false, { message: "No user with that email" });
      }
      try {
        if (await bcrypt.compare(password, user.password)) {
          return done(null, user);
        } else {
          return done(null, false, { message: "Password incorrect" });
        }
      } catch (err) {
        return done(err);
      }
    }
  )
);
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));
app.use(express.static("public"));
app.use(flash());
app.use(
  session({
    secret: "key",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// app.get("/articles", async (req, res) => {
//   const articles = await Article.find().sort({ createdAt: "desc" });
//   res.render("login/index", { articles: articles });
// });

// Routes
app.get("/", checkAuthenticated, async (req, res) => {
  const articles = await Article.find().sort({ createdAt: "desc" });
  const user = await User.findUserByName(req.user.name);
  const userId = user._id;
  User.findOne({ name: req.user.name })
    .populate("articles")
    .then(() => {
      res.render("articles/index.ejs", {
        name: req.user.name,
        articles: articles,
        id: userId
      });
    })
    .catch((err) => {
      console.log(err);
      res.redirect("/login");
    });
});

app.delete("/logout", (req, res) => {
  req.logOut();
  res.redirect("/login");
});

// Middleware functions
function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

// Use login and register routers
app.use("/login", loginRouter);
app.use("/register", registerRouter);
app.use("/articles", articleRouter);

app.listen(5000);
