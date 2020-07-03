const express = require('express')
const cors = require('cors')
const db = require('./models')
const response = require('./middlewares/response')
const checkJwt = require('./middlewares/jwt')

const authController = require('./controllers/auth')
const linkController = require('./controllers/link')

const app = express()

app.use(cors())
app.use(response)
app.use(checkJwt)

app.use(express.json())
app.use(express.urlencoded())

app.use('/auth', authController) // rotas de cadastro e login
app.use('/link', linkController) // rotas dos links

app.get('/', (req, res) => {
  return res.json('Api tá de boa...')
})

db.sequelize.sync().then(() => {
  app.listen(3001, () => {
    console.log('tô ouvindo na porta 3001')
  })
})