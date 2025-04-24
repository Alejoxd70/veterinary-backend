import { prisma } from '../lib/db.js'

export const getAllPets = async (req, res) => {
  try {
    const data = await prisma.pet.findMany()
    res.status(200).json({ data })
  } catch (error) {
    res.status(500).json({ error: 'server error' })
  }
}
