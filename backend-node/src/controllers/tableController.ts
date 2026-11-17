import { Request, Response, NextFunction } from 'express'
import { prisma } from '../utils/prisma'
import { tableCreateSchema, tableUpdateSchema } from '../utils/validation'

export const getTables = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const tables = await prisma.table.findMany({
      orderBy: { number: 'asc' },
    })
    res.json(tables)
  } catch (error) {
    next(error)
  }
}

export const createTable = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = tableCreateSchema.safeParse(req.body)
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.flatten() })
    }

    const existing = await prisma.table.findUnique({ where: { number: parsed.data.number } })
    if (existing) {
      return res.status(400).json({ error: 'Nomor meja sudah ada' })
    }

    const table = await prisma.table.create({
      data: parsed.data,
    })

    res.status(201).json(table)
  } catch (error) {
    next(error)
  }
}

export const updateTableStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id)
    const parsed = tableUpdateSchema.safeParse(req.body)
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.flatten() })
    }

    const table = await prisma.table.findUnique({ where: { id } })
    if (!table) {
      return res.status(404).json({ error: 'Meja tidak ditemukan' })
    }

    const updated = await prisma.table.update({
      where: { id },
      data: { status: parsed.data.status },
    })

    res.json({ message: 'Status updated', status: updated.status })
  } catch (error) {
    next(error)
  }
}

export const deleteTable = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id)
    const table = await prisma.table.findUnique({ where: { id } })
    if (!table) {
      return res.status(404).json({ error: 'Meja tidak ditemukan' })
    }

    await prisma.table.delete({ where: { id } })
    res.json({ message: 'Table deleted' })
  } catch (error) {
    next(error)
  }
}