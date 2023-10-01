const express = require('express')
const User = require('../models/user')
const router = express.Router()

router.post('/', async (req, res) => {
  const { name, email, password } = req.body
  try {
    const user = await User.create({ name, email, password })
    res.send(`Your username is ${user.name}, your email is ${user.email}, and your password is ${user.password}`)
  } catch (error) {
    console.error(error)
    res.status(500).send('Server Error')
  }
})

module.exports = router