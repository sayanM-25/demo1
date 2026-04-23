const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const { protect, syncUserAdminStatus } = require('../middleware/auth')

const router = express.Router()

function buildToken(userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  })
}

function toSafeUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
  }
}

router.post('/register', async (request, response, next) => {
  try {
    const { name, email, password } = request.body

    if (!name || !email || !password) {
      return response.status(400).json({ message: 'All fields are required.' })
    }

    if (password.length < 6) {
      return response
        .status(400)
        .json({ message: 'Password must be at least 6 characters.' })
    }

    const normalizedEmail = email.trim().toLowerCase()
    const existingUser = await User.findOne({ email: normalizedEmail })

    if (existingUser) {
      return response.status(409).json({ message: 'User already exists.' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase()
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      isAdmin: adminEmail ? normalizedEmail === adminEmail : false,
    })

    response.status(201).json({
      token: buildToken(user._id),
      user: toSafeUser(user),
    })
  } catch (error) {
    next(error)
  }
})

router.post('/login', async (request, response, next) => {
  try {
    const { email, password } = request.body

    if (!email || !password) {
      return response.status(400).json({ message: 'Email and password are required.' })
    }

    const user = await User.findOne({ email: email.trim().toLowerCase() })

    if (!user) {
      return response.status(401).json({ message: 'Invalid email or password.' })
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      return response.status(401).json({ message: 'Invalid email or password.' })
    }

    await syncUserAdminStatus(user)

    response.json({
      token: buildToken(user._id),
      user: toSafeUser(user),
    })
  } catch (error) {
    next(error)
  }
})

router.get('/me', protect, async (request, response) => {
  response.json({
    user: toSafeUser(request.user),
  })
})

module.exports = router
