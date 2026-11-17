import { PrismaClient } from '@prisma/client'
import { hashPassword } from '../src/utils/password'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create admin user
  const adminPassword = await hashPassword('admin123')
  const admin = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: adminPassword,
      role: 'admin',
    },
  })
  console.log('✅ Admin user created:', admin.username)

  // Create cashier user
  const cashierPassword = await hashPassword('cashier123')
  const cashier = await prisma.user.upsert({
    where: { username: 'cashier' },
    update: {},
    create: {
      username: 'cashier',
      password: cashierPassword,
      role: 'cashier',
    },
  })
  console.log('✅ Cashier user created:', cashier.username)

  // Create kitchen user
  const kitchenPassword = await hashPassword('kitchen123')
  const kitchen = await prisma.user.upsert({
    where: { username: 'kitchen' },
    update: {},
    create: {
      username: 'kitchen',
      password: kitchenPassword,
      role: 'kitchen',
    },
  })
  console.log('✅ Kitchen user created:', kitchen.username)

  // Create sample tables
  for (let i = 1; i <= 10; i++) {
    await prisma.table.upsert({
      where: { number: i },
      update: {},
      create: {
        number: i,
        capacity: i <= 4 ? 4 : 6,
        status: 'Available',
      },
    })
  }
  console.log('✅ 10 tables created')

  // Create sample products
  const products = [
    { name: 'Nasi Goreng', category: 'Makanan', price: 15000, status: 'Available' },
    { name: 'Mie Goreng', category: 'Makanan', price: 13000, status: 'Available' },
    { name: 'Ayam Geprek', category: 'Makanan', price: 18000, status: 'Available' },
    { name: 'Es Teh Manis', category: 'Minuman', price: 5000, status: 'Available' },
    { name: 'Es Jeruk', category: 'Minuman', price: 6000, status: 'Available' },
    { name: 'Kopi Hitam', category: 'Minuman', price: 8000, status: 'Available' },
    { name: 'Puding Coklat', category: 'Dessert', price: 10000, status: 'Available' },
    { name: 'Es Krim Vanilla', category: 'Dessert', price: 12000, status: 'Available' },
  ]

  for (const product of products) {
    await prisma.product.upsert({
      where: { name: product.name },
      update: {},
      create: product,
    })
  }
  console.log('✅ Sample products created')

  console.log('🎉 Seeding completed!')
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })