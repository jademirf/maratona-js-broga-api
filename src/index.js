const express = require('express')
const db = require('./models')

const authController = require('./controllers/auth')

const app = express()

app.use(express.json())
app.use(express.urlencoded())

app.use('/auth', authController) // rotas de cadastro e login

app.get('/', (req, res) => {
  return res.json('Api tá de boa...')
})

db.sequelize.sync().then(() => {
  app.listen(3001, () => {
    console.log('tô ouvindo na porta 3001')
  })
})