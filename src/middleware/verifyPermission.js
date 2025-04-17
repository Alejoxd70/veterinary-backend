import jsw from 'jsonwebtoken'
import { prisma } from '../lib/db.js'

export const verifyPermission = ({ permission }) => {
  return async (req, res, next) => {
    const token = req.headers.authorization

    if (!token) return res.status(401).json({ error: 'No token provided' })

    try {
      const decoded = jsw.verify(token, process.env.JWT_SECRET)
      req.user = decoded

      // get user role from database
      const user = await prisma.user.findUnique({
        where: {
          email: decoded.email
        },
        include: {
          role: {
            include: {
              permissions: {
                include: {
                  permission: true
                }
              }
            }
          }
        }
      })

      const userPermissions = user.role.permissions.map(p => p.permission.name)
      console.log(userPermissions)

      if (!userPermissions.includes(permission)) {
        return res.status(403).json({ error: 'You do not have permission required' })
      }

      next()
    } catch (error) {
      return res.status(401).json({ error: 'Invalid token' })
    }
  }
}
