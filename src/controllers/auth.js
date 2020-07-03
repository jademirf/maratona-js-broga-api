const express = require('express')
const bcrypt = require('bcrypt')
const { Account } = require('../models')
const { accountSignUp, accountSignIn } = require('../validators/account')
const { getMessage } = require('../helpers/messages')
const { generateJwt, generateRefreshJwt, verifyRefreshJwt, getTokenFromHeaders } = require('../helpers/jwt')

const router = express.Router()

const saltRounds = 10

router.post('/sign-in', accountSignIn, async (req, res) => {
  const { email, password } = req.body
  const account = await Account.findOne({ where: { email } })
  if (!account) return res.jsonBadRequest(null, getMessage('account.signin.invalid'))

  // validate password
  const passMatch = account ? bcrypt.compareSync(password, account.password) : null
  if(!passMatch) return res.jsonBadRequest(null, getMessage('account.signin.invalid'))

  const payload = {
    id: account.id
  }
  const payloadRefresh = {
    id: account.id,
    version: account.jwtVersion
  }

  const token = generateJwt(payload)
  const refreshToken = generateRefreshJwt(payloadRefresh)

  return res.jsonOK(account, getMessage('account.signin.success'), { token, refreshToken})
})

router.post('/sign-up', accountSignUp, async (req, res) => {

  const user = req.body

  const account = await Account.findOne({ where: { email: user.email } })
  if (account) return res.jsonBadRequest(null, getMessage('account.signup.email_exists'))

  user.password = bcrypt.hashSync(req.body.password, saltRounds)

  const result = await Account.create(user)

  const payload = {
    id: result.id
  }
  const payloadRefresh = {
    id: account.id,
    version: result.jwtVersion
  }

  
  const token = generateJwt(payload)
  const refreshToken = generateRefreshJwt(payloadRefresh)

  return res.jsonOK(result, getMessage('account.signup.success'), { token, refreshToken})
})

router.post('/refresh', async (req, res) => {
  const token = getTokenFromHeaders(req.headers)

  if(!token) {
    return res.jsonUnauthorized(null, 'Invalid token')
  }

  try {
    const decoded = verifyRefreshJwt(token)
    const account = await Account.findByPk(decoded.id)

    if (!account) return res.jsonUnauthorized(null, 'Invalid Token')

    if (decoded.version !== account.jwtVersion) {
      return res.jsonUnauthorized(null, 'Invalid Token')
    }

    const meta = { 
      token: generateJwt({ id: account.id })
    }
    return res.jsonOK(null, null, meta)
  } catch {
    return res.jsonUnauthorized(null, 'Invalid Token')
  }
})

module.exports = router

