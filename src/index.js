const express = require('express')

const authController = require('./controllers/auth')

const app = express()

app.use('/auth', authController) // rotas de cadastro e login

app.get('/', (req, res) => {
  return res.json('Api tá de boa...')
})

app.listen(3001, () => {
  console.log('tô ouvindo na porta 3001')
})