import { z } from 'zod'

export const productCreateSchema = z.object({
  name: z.string().min(1, 'Nama produk wajib diisi'),
  category: z.string().min(1, 'Kategori wajib diisi'),
  price: z.number().positive('Harga harus lebih dari 0'),
  status: z.enum(['Available', 'Out of Stock']).default('Available'),
})

export const productUpdateSchema = productCreateSchema.partial()

export const productStatusSchema = z.object({
  status: z.enum(['Available', 'Out of Stock']),
})

export const userCreateSchema = z.object({
  username: z.string().min(3, 'Username minimal 3 karakter'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
  role: z.enum(['admin', 'cashier', 'kitchen']),
})

export const userUpdateSchema = z.object({
  username: z.string().min(3).optional(),
  role: z.enum(['admin', 'cashier', 'kitchen']).optional(),
  password: z.string().min(6).optional(),
})

export const tableCreateSchema = z.object({
  number: z.number().int().positive('Nomor meja harus positif'),
  capacity: z.number().int().positive('Kapasitas harus positif'),
  status: z.enum(['Available', 'Occupied']).default('Available'),
})

export const tableUpdateSchema = z.object({
  status: z.enum(['Available', 'Occupied']),
})

export const orderCreateSchema = z.object({
  tableId: z.string().min(1, 'Table ID wajib diisi'),
  customerName: z.string().min(1, 'Nama pelanggan wajib diisi'),
  totalPrice: z.number().nonnegative('Total harga tidak boleh negatif'),
  paymentMethod: z.string().min(1, 'Metode pembayaran wajib diisi'),
  paymentStatus: z.enum(['UNPAID', 'PAID']).default('UNPAID'),
  items: z.array(z.record(z.any())).min(1, 'Minimal 1 item'),
})

export const orderUpdateItemsSchema = z.object({
  items: z.array(z.record(z.any())),
  totalPrice: z.number().nonnegative(),
})

export const optionChoiceSchema = z.object({
  name: z.string().min(1),
  extraPrice: z.number().default(0),
})

export const optionCreateSchema = z.object({
  name: z.string().min(1),
  choices: z.array(optionChoiceSchema).min(1),
})

export const optionsSaveSchema = z.array(optionCreateSchema)