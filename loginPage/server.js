const mongoose = require('mongoose');

// 连接 MongoDB 数据库
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/chai', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  autoIndex: true
});

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express')
const app = express()
const bcrypt = require('bcryptjs')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')
const User = require('./models/user')

const initializePassport = require('./passport-config')
initializePassport(
  passport,
  email => users.find(user => user.email === email),
  id => users.find(user => user.id === id)
)

const users = []

app.set('view-engine', 'ejs')
app.use(express.urlencoded({ extended: false }))
app.use(flash())
app.use(session({
  secret: 'mysecret',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))
app.use(express.static('public'));

app.get('/', checkAuthenticated, (req, res) => {
  res.render('home.ejs', { name: req.session.username ? req.session.username : 'XXX' });
})

app.get('/login', checkNotAuthenticated, (req, res) => {
  res.render('login.ejs')
})
app.get('/404', checkNotAuthenticated, (req, res) => {
  res.render('404.ejs', { name: req.session.username });
})
app.get('/home', checkNotAuthenticated, (req, res) => {
  res.render('home.ejs', { name: req.session.username });
})

app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
  successRedirect: '/home',
  failureRedirect: '/404',
  failureFlash: true
}))

app.get('/register', checkNotAuthenticated, (req, res) => {
  res.render('home.ejs',{name: req.session.username ? "name is ok" : "error"})
})

app.post('/register', checkNotAuthenticated, async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
    });
    await user.save();
    req.session.username = user.name
    console.log(">> ",req.session.username);
    res.redirect('/home');
  } catch {
    res.redirect('/register');
  }
});

app.delete('/logout', (req, res) => {
  req.logOut()
  res.redirect('/login')
})

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }

  res.redirect('/login')
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/')
  }
  next()
}

app.listen(3000)