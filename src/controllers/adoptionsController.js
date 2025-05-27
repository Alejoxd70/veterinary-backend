import { prisma } from '../lib/db.js'

export const getAllAdoptions = async (req, res) => {
  try {
    const adoptions = await prisma.adoption.findMany({
      select: {
        id: true,
        user: {
          select: {
            name: true
          }
        },
        pet: {
          select: {
            name: true
          }
        },
        adoptedAt: true
      }
    })
    return res.status(200).json(adoptions)
  } catch (error) {
    console.error('Error fetching adoptions')
    res.status(500).json({ error: 'Internal server error' })
  }
}

export const getAdoption = async (req, res) => {
  try {
    const { id } = req.params

    // check if id is a number
    if (isNaN(id)) return res.status(400).json({ error: 'Invalid id' })

    // Get pet from id
    const adoption = await prisma.adoption.findMany({
      where: { userId: Number(id) },
      select: {
        id: true,
        user: {
          select: {
            name: true
          }
        },
        pet: {
          select: {
            id: true,
            type: true,
            name: true,
            description: true,
            imageUrl: true,
            telephone: true
          }
        },
        adoptedAt: true
      }
    })
    if (!adoption) {
      return res.status(404).json({ error: 'Adoption not found' })
    }
    return res.status(200).json(adoption)
  } catch (error) {
    console.error('Error fetching adoption')
    res.status(500).json({ error: 'Internal server error' })
  }
}

export const registerAdoption = async (req, res) => {
  try {
    const { userId, petId } = req.body
    // create a new pet
    const newAdoption = await prisma.adoption.create({
      data: {
        userId,
        petId
      },
      select: {
        user: {
          select: {
            name: true
          }
        },
        pet: {
          select: {
            name: true
          }
        },
        adoptedAt: true
      }
    })

    return res.status(201).json(newAdoption)
  } catch (error) {
    console.error('Error fetching adoptions')
    res.status(500).json({ error: 'Internal server error' })
    console.log(error)
  }
}

export const updateAdoption = async (req, res) => {
  try {
    const { id } = req.params
    const existingAdoption = await prisma.adoption.findUnique({
      where: { id: Number(id) }
    })
    if (!existingAdoption) {
      return res.status(404).json({ error: 'Adoption not found' })
    }

    // update pet from id
    const changeAdoption = await prisma.adoption.update({
      where: { id: Number(id) },
      data: {
        userId: req.body.userId || existingAdoption.userId,
        petId: req.body.petId || existingAdoption.petId,
        status: req.body.status || existingAdoption.status
      },
      select: {
        user: {
          select: {
            name: true
          }
        },
        pet: {
          select: {
            name: true
          }
        },
        adoptedAt: true
      }
    })
    return res.status(200).json(changeAdoption)
  } catch (error) {
    console.error('Error updating adoption', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export const deleteAdoption = async (req, res) => {
  try {
    const { id } = req.params
    const existingAdoption = await prisma.adoption.findUnique({
      where: { id: Number(id) }
    })
    if (!existingAdoption) {
      return res.status(404).json({ error: 'Adoption not found' })
    }
    const removeAdoption = await prisma.adoption.delete({
      where: { id: Number(id) },
      select: {
        user: {
          select: {
            name: true
          }
        },
        pet: {
          select: {
            name: true
          }
        },
        adoptedAt: true
      }
    })
    return res.status(200).json(removeAdoption)
  } catch (error) {
    console.error('Error fetching adoption', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
