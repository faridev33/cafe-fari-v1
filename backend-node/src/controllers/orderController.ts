import { Request, Response, NextFunction } from 'express'
import { prisma } from '../utils/prisma'
import { orderCreateSchema, orderUpdateItemsSchema } from '../utils/validation'

export const createOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = orderCreateSchema.safeParse(req.body)
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.flatten() })
    }

    const order = await prisma.order.create({
      data: {
        tableId: parsed.data.tableId,
        customerName: parsed.data.customerName,
        totalPrice: parsed.data.totalPrice,
        paymentMethod: parsed.data.paymentMethod,
        paymentStatus: parsed.data.paymentStatus,
        cookingStatus: 'QUEUED',
        items: parsed.data.items,
      },
    })

    res.status(201).json({ message: 'Order created', order })
  } catch (error) {
    next(error)
  }
}

export const getOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status } = req.query

    // Auto delete unpaid orders older than 1 hour
    if (status === 'UNPAID' || !status) {
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000)
      const expiredOrders = await prisma.order.findMany({
        where: {
          paymentStatus: 'UNPAID',
          createdAt: { lt: oneHourAgo },
        },
      })

      if (expiredOrders.length > 0) {
        console.log(`Menghapus ${expiredOrders.length} pesanan kadaluarsa...`)
        await prisma.order.deleteMany({
          where: {
            paymentStatus: 'UNPAID',
            createdAt: { lt: oneHourAgo },
          },
        })
      }
    }

    const where: Record<string, unknown> = {}
    if (status) {
      where.paymentStatus = status
    }

    const orders = await prisma.order.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    })

    res.json(orders)
  } catch (error) {
    next(error)
  }
}

export const updateOrderItems = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id)
    const parsed = orderUpdateItemsSchema.safeParse(req.body)
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.flatten() })
    }

    const order = await prisma.order.findUnique({ where: { id } })
    if (!order) {
      return res.status(404).json({ error: 'Order not found' })
    }

    const updated = await prisma.order.update({
      where: { id },
      data: {
        items: parsed.data.items,
        totalPrice: parsed.data.totalPrice,
      },
    })

    res.json({ message: 'Order updated successfully', order: updated })
  } catch (error) {
    next(error)
  }
}

export const payOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id)
    const order = await prisma.order.findUnique({ where: { id } })
    if (!order) {
      return res.status(404).json({ error: 'Order not found' })
    }

    const updated = await prisma.order.update({
      where: { id },
      data: { paymentStatus: 'PAID' },
    })

    res.json({ message: 'Payment success', order: updated })
  } catch (error) {
    next(error)
  }
}

export const getOrderStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { tableId } = req.params
    const order = await prisma.order.findFirst({
      where: { tableId },
      orderBy: { createdAt: 'desc' },
    })

    if (!order) {
      return res.json({ status: 'No Order' })
    }

    res.json(order)
  } catch (error) {
    next(error)
  }
}

export const updateCookingStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id)
    const { status } = req.body

    const validStatuses = ['QUEUED', 'COOKING', 'DONE']
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid cooking status' })
    }

    const order = await prisma.order.findUnique({ where: { id } })
    if (!order) {
      return res.status(404).json({ error: 'Order not found' })
    }

    const updated = await prisma.order.update({
      where: { id },
      data: { cookingStatus: status },
    })

    res.json({ message: 'Cooking status updated', order: updated })
  } catch (error) {
    next(error)
  }
}