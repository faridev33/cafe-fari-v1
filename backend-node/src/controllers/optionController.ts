import { Request, Response, NextFunction } from 'express'
import { prisma } from '../utils/prisma'
import { optionsSaveSchema } from '../utils/validation'

export const getOptions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const productId = parseInt(req.params.productId)
    const options = await prisma.productOption.findMany({
      where: { productId },
      include: { choices: true },
      orderBy: { id: 'asc' },
    })
    res.json(options)
  } catch (error) {
    next(error)
  }
}

export const saveOptions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const productId = parseInt(req.params.productId)
    const parsed = optionsSaveSchema.safeParse(req.body)
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.flatten() })
    }

    // Delete old options for this product
    await prisma.optionChoice.deleteMany({
      where: { option: { productId } },
    })
    await prisma.productOption.deleteMany({
      where: { productId },
    })

    // Create new options
    for (const opt of parsed.data) {
      const newOption = await prisma.productOption.create({
        data: {
          productId,
          name: opt.name,
          choices: {
            create: opt.choices.map((c) => ({ name: c.name, extraPrice: c.extraPrice })),
          },
        },
        include: { choices: true },
      })
    }

    const options = await prisma.productOption.findMany({
      where: { productId },
      include: { choices: true },
    })

    res.json({ message: 'Options saved successfully', options })
  } catch (error) {
    next(error)
  }
}