const express = require('express')
const app = express()
const mongoose = require('mongoose')
const User = require('./models/user')
const signup = require('./routes/signup')

mongoose.connect('mongodb://127.0.0.1:27017/chit', {
  useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true
})

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))
app.use(express.static('public'));


app.get('/',(req,res) => {
    res.render('login')
})

app.post('/signup', async (req, res) => {
  const { username, email, password } = req.body
  try {
    const user = await User.create({ username, email, password })
    user.save()
    res.send(`Your username is ${user.username}, your email is ${user.email}, and your password is ${user.password}`)
  } catch (error) {
    console.error(error)
    res.status(500).send('Server Error')
  }
})

app.listen(5000)
