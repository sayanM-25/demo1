const express = require('express')
const Contact = require('../models/Contact')
const { protect, requireAdmin } = require('../middleware/auth')

const router = express.Router()

router.post('/', async (request, response, next) => {
  try {
    const { name, email, message } = request.body

    if (!name || !email || !message) {
      return response.status(400).json({ message: 'All contact form fields are required.' })
    }

    const contact = await Contact.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      message: message.trim(),
    })

    response.status(201).json({
      message: 'Contact submission saved successfully.',
      contact,
    })
  } catch (error) {
    next(error)
  }
})

router.get('/', protect, requireAdmin, async (_request, response, next) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 })
    response.json({ contacts })
  } catch (error) {
    next(error)
  }
})

module.exports = router
