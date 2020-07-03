const { Link } = require('../models')

const express = require('express');

const router = express.Router()

router.get('/', async (req, res) => {
  const { accountId } = req
  const links = await Link.findAll({ where: { accountId }})
  return res.jsonOK(links)
})

router.get('/:id', async (req, res) => {
  const { accountId } = req
  const { id } = req.params
  const link = await Link.findOne({ where: { id, accountId } })
  return res.jsonOK(link)
})

router.post('/', async (req, res) => {
  const { accountId, body } = req
  const { label, url, isSocial } = body

  const image = "https://google.com/image.jpg" // imagem temporária

  const newLink = await Link.create( {label, url, isSocial, image, accountId})

  return res.jsonOK(newLink)
})

router.put('/:id', async (req, res) => {
  const id = req.params.id
  const { body, accountId } = req

  const fields = ['label', 'url', 'isSocial']

  // const image = "https://google.com/image.jpg" // imagem temporária

  const link = await Link.findOne({ where: { id, accountId } })
  if(!link) return res.jsonNotFound()

  fields.map( fieldName => {
    const newValue = body[fieldName]
    if (newValue !== undefined) link[fieldName] = newValue
  })

  await link.save()

  return res.jsonOK(link)
})

router.delete('/:id', async (req, res) => {
  const { accountId } = req
  const id = req.params.id

  const link = await Link.findOne({ where: { id, accountId } })
  if(!link) return res.jsonNotFound()

  await link.destroy()

  return res.jsonOK(link)
})

module.exports = router