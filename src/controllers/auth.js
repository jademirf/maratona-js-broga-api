const express = require('express')
const bcrypt = require('bcrypt')
const { Account } = require('../models')
const { accountSignUp } = require('../validators/account')
const { getMessage } = require('../helpers/validator')

const router = express.Router()

const saltRounds = 10

router.post('/sign-in', (req, res) => {
  return res.jsonOK(null)
})

router.post('/sign-up', accountSignUp, async (req, res) => {

  const user = req.body

  const account = await Account.findOne({ where: { email: user.email } })
  if (account) return res.jsonBadRequest(null, getMessage('account.signup.email_exists'))

  user.password = bcrypt.hashSync(req.body.password, saltRounds)

  // const user = {
  //   email:'jademir@teste.com',
  //   password: bcrypt.hashSync('123456', saltRounds)
  // }
  const result = await Account.create(user)

  return res.jsonOK(result, getMessage('account.signup.success'))
})

module.exports = router

