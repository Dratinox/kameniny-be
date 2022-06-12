import { PrismaClient, Prisma } from '@prisma/client'

const prisma = new PrismaClient()

const productData: Prisma.ProductCreateInput[] = [
    {
        title: 'Tricko',
        description: 'Tricko - z bavlny',
        price: 1500,
        imageUrl: '',
        slug: 'tricko',
        stock: 2,
    },
    {
        title: 'Sroubky',
        description: 'Sroubky - krabicka',
        price: 100,
        imageUrl: '',
        slug: 'sroubky',
        stock: 100,
    },
]

const userData: Prisma.UserCreateInput[] = [
    {
        email: 'admin@example.com',
        password:
            '$2a$12$OuPDDpnGwL4baaBQgd.Q7uI.y4CXvMNMu7v3eIGFcjRVtPRRi7vJ6',
        isAdmin: true,
    },
    {
        email: 'user@example.com',
        password:
            '$2a$12$OuPDDpnGwL4baaBQgd.Q7uI.y4CXvMNMu7v3eIGFcjRVtPRRi7vJ6',
    },
]

const categoryData: Prisma.CategoryCreateInput[] = [
    {
        name: 'Trika',
    },
    {
        name: 'Sroubky',
    },
]

async function main() {
    console.log(`Start seeding ...`)
    await prisma.product.deleteMany()
    await prisma.user.deleteMany()
    for (const data of productData) {
        const product = await prisma.product.create({
            data,
        })
        console.log(`Created product with id: ${product.id}`)
    }

    for (const data of userData) {
        const user = await prisma.user.create({
            data,
        })
        console.log(`Created user with id: ${user.id}`)
    }

    for (const data of categoryData) {
        const category = await prisma.category.create({
            data,
        })
        console.log(`Created category with id: ${category.id}`)
    }
    console.log(`Seeding finished.`)
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
