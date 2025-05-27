import jwt from 'jsonwebtoken'

export const verifyAuth = (req, res, next) => {
  let token
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1]
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      req.user = decoded
      console.log(decoded)
      return next()
    } catch (error) {
      res.status(401).json({ error: 'Invalid token' })
    }
  }

  if (!token) return res.status(401).json({ error: 'No token provided' })

  next()
}
