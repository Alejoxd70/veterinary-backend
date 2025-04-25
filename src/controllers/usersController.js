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
    if (!user) return res.status(401).json({ error: 'User does not exist ' })

    // check if password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) return res.status(401).json({ error: 'Invalid password' })

    // remove password form user object
    const { password: _, ...userWithoutPassword } = user

    // create token
    const token = generateToken({ dataUser: userWithoutPassword })

    // TODO: create a JWT token and send it to the client
    return res.status(200).json({ msg: 'login successful', user: userWithoutPassword, token })
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
