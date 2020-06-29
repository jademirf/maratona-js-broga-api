const express = require('express')
const bcrypt = require('bcrypt')
const { Account } = require('../models')

const router = express.Router()

const saltRounds = 10

router.get('/sign-in', (req, res) => {
  return res.json('Sign in')
})

router.get('/sign-up', async (req, res) => {

  const user = {
    email:'jademir@teste.com',
    password: bcrypt.hashSync('123456', saltRounds)
  }
  const result = await Account.create(user)

  return res.json(result)
})

module.exports = router

