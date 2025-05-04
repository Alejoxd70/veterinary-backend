import { prisma } from '../lib/db.js'

export const getAllProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      select: {
        name: true,
        description: true,
        imageUrl: true,
        price: true,
        stock: true
      }
    })
    return res.status(200).json(products)
  } catch (error) {
    console.error('Error fetching products')
    res.status(500).json({ error: 'Internal server error' })
  }
}

export const getProduct = async (req, res) => {
  try {
    const { id } = req.params
    // Get product from id
    const product = await prisma.product.findUnique({
      where: { id: Number(id) },
      select: {
        name: true,
        description: true,
        imageUrl: true,
        price: true,
        stock: true
      }
    })
    if (!product) {
      return res.status(404).json({ error: 'Product not found' })
    }
    return res.status(200).json(product)
  } catch (error) {
    console.error('Error fetching product')
    res.status(500).json({ error: 'Internal server error' })
  }
}

export const registerProduct = async (req, res) => {
  try {
    const { name, description, imageUrl, price, stock } = req.body
    // create a new pet
    const newProduct = await prisma.product.create({
      data: {
        name,
        description,
        imageUrl,
        price,
        stock
      },
      select: {
        name: true,
        description: true,
        imageUrl: true,
        price: true,
        stock: true
      }
    })
    return res.status(201).json(newProduct)
  } catch (error) {
    console.error('Error fetching product')
    res.status(500).json({ error: 'Internal server error' })
    console.log(error)
  }
}

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params
    const existingProduct = await prisma.product.findUnique({
      where: { id: Number(id) }
    })
    if (!existingProduct) {
      return res.status(404).json({ error: 'Product not found' })
    }
    const { name, description, imageUrl, price, stock } = req.body
    // update pet from id
    const modifiedProduct = await prisma.product.update({
      where: { id: Number(id) },
      data: {
        name,
        description,
        imageUrl,
        price,
        stock
      },
      select: {
        name: true,
        description: true,
        imageUrl: true,
        price: true,
        stock: true
      }
    })
    return res.status(200).json(modifiedProduct)
  } catch (error) {
    console.error('Error updating product', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params
    const existingProduct = await prisma.product.findUnique({
      where: { id: Number(id) }
    })
    if (!existingProduct) {
      return res.status(404).json({ error: 'Product not found' })
    }
    const removeProduct = await prisma.product.delete({
      where: { id: Number(id) },
      select: {
        name: true,
        description: true,
        imageUrl: true,
        price: true,
        stock: true
      }
    })
    return res.status(200).json(removeProduct)
  } catch (error) {
    console.error('Error fetching product', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
