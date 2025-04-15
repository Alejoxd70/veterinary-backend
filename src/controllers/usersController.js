import { prisma } from '../lib/db.js'

const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany()
    res.status(200).json(users)
  } catch (error) {
    console.error('Error fetching users')
    res.status(500).json({ error: 'Internal server error' })
  }
}

export {
  getAllUsers
}
