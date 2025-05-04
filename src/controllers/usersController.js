import bcrypt from 'bcrypt'
import { ZodError } from 'zod'
import { SALT_ROUNDS } from '../config/constants.js'
import { prisma } from '../lib/db.js'
import { userSchema, userLoginSchema } from '../schemas/userSchema.js'
import { generateToken } from '../helpers/generateToken.js'

export const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: {
          select: {
            name: true
          }
        }
      }
    })
    return res.status(200).json(users)
  } catch (error) {
    console.error('Error fetching users')
    res.status(500).json({ error: 'Internal server error' })
  }
}

export const registerUser = async (req, res) => {
  try {
    // validate with userSchema with zod
    userSchema.parse(req.body)

    const { name, email, password } = req.body

    // check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) return res.status(409).json({ error: 'User already exists' })

    // hash the password
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS)

    // create a new user
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        roleId: 1 // 2 default role for new users - 1 for admin
      },
      select: {
        name: true,
        email: true,
        role: {
          select: {
            name: true
          }
        }
      }
    })

    return res.status(201).json(newUser)
  } catch (error) {
    console.error('Error validating user data')
    console.log(error)
    // handle zod validation errors
    if (error instanceof ZodError) {
      const errorMessages = error.issues.map(err => err.message)
      return res.status(400).json({ error: errorMessages })
    }
    return res.status(500).json({ errors: 'Internal server error', error })
  }
}

export const deleteUser = async (req, res) => {
  try {
    const id = parseInt(req.params.id)

    // check if id is a number
    if (isNaN(id)) return res.status(400).json({ error: 'Invalid id' })

    // check if user exists
    const user = await prisma.user.findUnique({
      where: {
        id
      }
    })
    // if user does not exist, return 404
    if (!user) return res.status(404).json({ error: 'User not found' })

    // delete user
    const userDeleted = await prisma.user.delete({
      where: { id },
      select: {
        name: true
      }
    })

    return res.status(200).json({ msg: `User ${userDeleted.name} deleted successfully` })
  } catch (error) {
    console.error('Error deleting user')
    console.log(error)
    // handle zod validation errors
    if (error instanceof ZodError) {
      const errorMessages = error.issues.map(err => err.message)
      return res.status(400).json({ error: errorMessages })
    }
    return res.status(500).json({ errors: 'Error deleting the user', error: error.message })
  }
}

export const editUser = async (req, res) => {
  try {
    const id = parseInt(req.params.id)

    // check if id is a number
    if (isNaN(id)) return res.status(400).json({ error: 'Invalid id' })

    // check if user exists
    const user = await prisma.user.findUnique({
      where: {
        id
      }
    })

    // if user does not exist, return 404
    if (!user) return res.status(404).json({ error: 'User not found' })

    // Validate the data with zod if changes are made
    userSchema.parse({
      name: req.body.name || user.name,
      email: req.body.email || user.email,
      password: req.body.password || user.password
    })

    if (req.body.password) {
      // hash the password
      const hashedPassword = await bcrypt.hash(req.body.password, SALT_ROUNDS)
      req.body.password = hashedPassword
    }

    // update user
    const updatedUser = await prisma.user.update({
      where: { id },
      data: req.body,
      select: {
        name: true,
        email: true,
        role: {
          select: {
            name: true
          }
        }
      }
    })

    return res.status(200).json(updatedUser)
  } catch (error) {
    console.error('Error updating user')
    console.log(error)
    // handle zod validation errors
    if (error instanceof ZodError) {
      const errorMessages = error.issues.map(err => err.message)
      return res.status(400).json({ error: errorMessages })
    }
    return res.status(500).json({ errors: 'Error updating the user', error: error.message })
  }
}

export const loginUser = async (req, res) => {
  try {
    userLoginSchema.parse(req.body)
    const { email, password } = req.body

    // check if user exists
    const user = await prisma.user.findUnique({
      where: {
        email
      },
      select: {
        name: true,
        email: true,
        password: true,
        role: {
          select: {
            name: true
          }
        }
      }
    })
    if (!user) return res.status(401).json({ error: 'User does not exist' })

    // check if password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) return res.status(401).json({ error: 'Invalid password' })

    // remove password form user object
    const { password: _, ...userWithoutPassword } = user

    // create token
    const token = generateToken({ dataUser: userWithoutPassword })

    // create a JWT token and send it to the client
    return res.status(200).json({ msg: 'login successful', user: userWithoutPassword, token })
  } catch (error) {
    console.error('Error validating user data')
    console.log(error)

    // handle zod validation errors
    if (error instanceof ZodError) {
      const errorMessages = error.issues.map(err => err.message)
      return res.status(400).json({ type: 'validation', error: errorMessages })
    }
    return res.status(500).json({ errors: 'Internal server error', error })
  }
}
