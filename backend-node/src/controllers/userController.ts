import { Request, Response, NextFunction } from 'express'
import { prisma } from '../utils/prisma'
import { hashPassword, verifyPassword } from '../utils/password'
import {
  userCreateSchema,
  userUpdateSchema,
} from '../utils/validation'
import { upload, deleteFile, getFileUrl } from '../utils/upload'

export const getUsers = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: { id: true, username: true, role: true, imageUrl: true, createdAt: true },
    })
    res.json(users)
  } catch (error) {
    next(error)
  }
}

export const getUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id)
    const user = await prisma.user.findUnique({
      where: { id },
      select: { id: true, username: true, role: true, imageUrl: true, createdAt: true },
    })
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }
    res.json(user)
  } catch (error) {
    next(error)
  }
}

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = userCreateSchema.safeParse(req.body)
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.flatten() })
    }

    const existing = await prisma.user.findUnique({ where: { username: parsed.data.username } })
    if (existing) {
      return res.status(400).json({ error: 'Username already registered' })
    }

    let imageUrl: string | null = null
    if (req.file) {
      imageUrl = getFileUrl(req.file.filename)
    }

    const hashedPassword = await hashPassword(parsed.data.password)

    const user = await prisma.user.create({
      data: {
        username: parsed.data.username,
        password: hashedPassword,
        role: parsed.data.role,
        imageUrl,
      },
      select: { id: true, username: true, role: true, imageUrl: true, createdAt: true },
    })

    res.status(201).json(user)
  } catch (error) {
    next(error)
  }
}

export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id)
    const parsed = userUpdateSchema.safeParse(req.body)
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.flatten() })
    }

    const user = await prisma.user.findUnique({ where: { id } })
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    if (parsed.data.username && parsed.data.username !== user.username) {
      const existing = await prisma.user.findUnique({ where: { username: parsed.data.username } })
      if (existing) {
        return res.status(400).json({ error: 'Username already registered' })
      }
    }

    let imageUrl = user.imageUrl
    if (req.file) {
      if (user.imageUrl) {
        deleteFile(user.imageUrl)
      }
      imageUrl = getFileUrl(req.file.filename)
    }

    const updateData: Record<string, unknown> = {}
    if (parsed.data.username) updateData.username = parsed.data.username
    if (parsed.data.role) updateData.role = parsed.data.role
    if (parsed.data.password) updateData.password = await hashPassword(parsed.data.password)
    if (imageUrl !== user.imageUrl) updateData.imageUrl = imageUrl

    const updated = await prisma.user.update({
      where: { id },
      data: updateData,
      select: { id: true, username: true, role: true, imageUrl: true, createdAt: true },
    })

    res.json(updated)
  } catch (error) {
    next(error)
  }
}

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id)
    const user = await prisma.user.findUnique({ where: { id } })
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    if (user.imageUrl) {
      deleteFile(user.imageUrl)
    }

    await prisma.user.delete({ where: { id } })
    res.json({ message: 'User deleted' })
  } catch (error) {
    next(error)
  }
}

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, password } = req.body
    if (!username || !password) {
      return res.status(400).json({ error: 'Username dan password wajib diisi' })
    }

    const user = await prisma.user.findUnique({ where: { username } })
    if (!user) {
      return res.status(400).json({ error: 'Username tidak ditemukan' })
    }

    const valid = await verifyPassword(password, user.password)
    if (!valid) {
      return res.status(400).json({ error: 'Password salah' })
    }

    res.json({
      message: 'Login Berhasil',
      username: user.username,
      role: user.role,
      id: user.id,
    })
  } catch (error) {
    next(error)
  }
}