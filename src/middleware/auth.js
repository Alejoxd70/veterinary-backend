import jwt from 'jsonwebtoken'

export const verifyAuth = (req, res, next) => {
  const token = req.headers.authorization

  if (!token) return res.status(401).json({ error: 'No token provided' })

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded
    console.log(decoded)
    next()
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' })
  }
}
