const express = require('express')

const app = express()

app.get('/', (req, res) => {
  retunr res.json('Api tá de boa...')
})

app.listen(3001, () => {
  console.log('tô ouvindo na porta 3001')
})