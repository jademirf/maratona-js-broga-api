const { verifyJwt } = require('../helpers/jwt')

const checkJwt = (req, res, next) => {
  let token = req.headers['authorization']

  token = token ? token.split(' ')[1] : null

  if(!token) {
    return res.jsonUnauthorized(null, 'Invalid token')
  }

  try{
    const decoded = verifyJwt(token)
    req.accountId = decoded.id
    next()
  } catch {
    return res.jsonUnauthorized(null, 'Invalid token')
  }

}

module.exports = checkJwt