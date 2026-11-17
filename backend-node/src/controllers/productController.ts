import { Request, Response, NextFunction } from 'express'
import { prisma } from '../utils/prisma'
import { hashPassword, verifyPassword } from '../utils/password'
import {
  productCreateSchema,
  productUpdateSchema,
  productStatusSchema,
} from '../utils/validation'
import { upload, deleteFile, getFileUrl } from '../utils/upload'

export const getProducts = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const products = await prisma.product.findMany({
      include: {
        options: {
          include: { choices: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    })
    res.json(products)
  } catch (error) {
    next(error)
  }
}

export const getProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id)
    const product = await prisma.product.findUnique({
      where: { id },
      include: { options: { include: { choices: true } } },
    })
    if (!product) {
      return res.status(404).json({ error: 'Product not found' })
    }
    res.json(product)
  } catch (error) {
    next(error)
  }
}

export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = productCreateSchema.safeParse(req.body)
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.flatten() })
    }

    let imageUrl: string | null = null
    if (req.file) {
      imageUrl = getFileUrl(req.file.filename)
    }

    const product = await prisma.product.create({
      data: {
        ...parsed.data,
        imageUrl,
      },
      include: { options: { include: { choices: true } } },
    })

    res.status(201).json(product)
  } catch (error) {
    next(error)
  }
}

export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id)
    const parsed = productUpdateSchema.safeParse(req.body)
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.flatten() })
    }

    const existing = await prisma.product.findUnique({ where: { id } })
    if (!existing) {
      return res.status(404).json({ error: 'Product not found' })
    }

    let imageUrl = existing.imageUrl
    if (req.file) {
      if (existing.imageUrl) {
        deleteFile(existing.imageUrl)
      }
      imageUrl = getFileUrl(req.file.filename)
    }

    const product = await prisma.product.update({
      where: { id },
      data: {
        ...parsed.data,
        imageUrl,
      },
      include: { options: { include: { choices: true } } },
    })

    res.json(product)
  } catch (error) {
    next(error)
  }
}

export const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id)
    const product = await prisma.product.findUnique({ where: { id } })
    if (!product) {
      return res.status(404).json({ error: 'Product not found' })
    }

    if (product.imageUrl) {
      deleteFile(product.imageUrl)
    }

    await prisma.product.delete({ where: { id } })
    res.json({ message: 'Product deleted successfully' })
  } catch (error) {
    next(error)
  }
}

export const updateProductStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id)
    const parsed = productStatusSchema.safeParse(req.body)
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.flatten() })
    }

    const product = await prisma.product.update({
      where: { id },
      data: { status: parsed.data.status },
    })

    res.json({ message: 'Status updated', status: product.status })
  } catch (error) {
    next(error)
  }
}