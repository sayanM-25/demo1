const jwt = require('jsonwebtoken')
const User = require('../models/User')

async function syncUserAdminStatus(user) {
  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase()
  const shouldBeAdmin = Boolean(adminEmail && user.email === adminEmail)

  if (user.isAdmin !== shouldBeAdmin) {
    user.isAdmin = shouldBeAdmin
    await user.save()
  }

  return user
}

async function protect(request, response, next) {
  const authorization = request.headers.authorization

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return response.status(401).json({ message: 'Authentication required.' })
  }

  try {
    const token = authorization.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(decoded.userId)

    if (!user) {
      return response.status(401).json({ message: 'User not found.' })
    }

    await syncUserAdminStatus(user)
    request.user = user.toObject()
    delete request.user.password
    next()
  } catch (_error) {
    return response.status(401).json({ message: 'Invalid or expired token.' })
  }
}

function requireAdmin(request, response, next) {
  if (!request.user?.isAdmin) {
    return response.status(403).json({ message: 'Admin access required.' })
  }

  next()
}

module.exports = {
  protect,
  requireAdmin,
  syncUserAdminStatus,
}
