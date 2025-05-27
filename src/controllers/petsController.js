import { prisma } from '../lib/db.js'

export const getAllPets = async (req, res) => {
  try {
    const pets = await prisma.pet.findMany({
      where: {
        status: 'AVAILABLE'
      },
      select: {
        id: true,
        name: true,
        type: true,
        breed: true,
        description: true,
        age: true,
        imageUrl: true,
        latitude: true,
        longitude: true,
        status: true
      }
    })
    return res.status(200).json(pets)
  } catch (error) {
    console.error('Error fetching pets', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export const getPet = async (req, res) => {
  try {
    const { id } = req.params
    // Get pet from id
    const pet = await prisma.pet.findUnique({
      where: { id: Number(id) },
      select: {
        name: true,
        type: true,
        breed: true,
        description: true,
        age: true,
        imageUrl: true,
        latitude: true,
        longitude: true,
        adopted: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })
    if (!pet) {
      return res.status(404).json({ error: 'Pet not found' })
    }
    return res.status(200).json(pet)
  } catch (error) {
    console.error('Error fetching pet')
    res.status(500).json({ error: 'Internal server error' })
  }
}

export const registerPet = async (req, res) => {
  try {
    const { name, age, type, breed, description, imageUrl } = req.body

    // create a new pet
    const newPet = await prisma.pet.create({
      data: {
        name,
        age,
        type,
        breed,
        description,
        imageUrl
      },
      select: {
        name: true,
        age: true,
        type: true,
        breed: true,
        description: true
      }
    })

    return res.status(201).json(newPet)
  } catch (error) {
    console.error('Error fetching pets')
    res.status(500).json({ error: 'Internal server error' })
    console.log(error)
  }
}

export const updatePet = async (req, res) => {
  try {
    const { id } = req.params
    const existingPet = await prisma.pet.findUnique({
      where: { id: Number(id) }
    })
    if (!existingPet) {
      return res.status(404).json({ error: 'Pet not found' })
    }

    // update pet from id
    const changePet = await prisma.pet.update({
      where: { id: Number(id) },
      data: {
        name: req.body.name || existingPet.name,
        age: req.body.age || existingPet.age,
        type: req.body.type || existingPet.type,
        breed: req.body.breed || existingPet.breed,
        description: req.body.description || existingPet.description,
        imageUrl: req.body.imageUrl || existingPet.imageUrl,
        status: req.body.status || existingPet.status
      },
      select: {
        name: true,
        age: true,
        type: true,
        breed: true,
        description: true
      }
    })
    return res.status(200).json(changePet)
  } catch (error) {
    console.error('Error updating pet', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export const deletePet = async (req, res) => {
  try {
    const { id } = req.params
    const existingPet = await prisma.pet.findUnique({
      where: { id: Number(id) }
    })
    if (!existingPet) {
      return res.status(404).json({ error: 'Pet not found' })
    }
    const removePet = await prisma.pet.delete({
      where: { id: Number(id) },
      select: {
        name: true,
        age: true,
        type: true,
        breed: true,
        description: true
      }
    })
    return res.status(200).json(removePet)
  } catch (error) {
    console.error('Error fetching pet', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
