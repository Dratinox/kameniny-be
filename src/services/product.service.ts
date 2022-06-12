import { prisma } from '../prisma'
import { Product, Prisma } from '@prisma/client'
import { uploadImage } from './image.service'

// Get all products
export const getAllProducts = async (
    categoryId?: number,
    search?: string,
    offset?: number,
    size?: number
): Promise<{ products: Product[]; totalRecords: number }> => {
    const filters = {
        ...(categoryId && { categoryId }),
        ...(search && { title: { contains: search } }),
    }

    const products = await prisma.product.findMany({
        ...(Object.keys(filters).length && { where: filters }),
        ...((offset || offset === 0) && size && { skip: offset, take: size }),
    })
    const count = await prisma.product.count()
    return { products, totalRecords: count }
}

// Get product from database by slug
export const getProductBySlug = async (slug: string): Promise<Product> => {
    const product = await prisma.product.findFirst({
        where: {
            slug,
        },
    })
    return product
}

// Get product from database by id
export const getProductById = async (id: number): Promise<Product> => {
    const product = await prisma.product.findUnique({
        where: {
            id,
        },
    })
    return product
}

export const decreaseProductQuantity = async (
    id: number,
    quantity: number,
    size: string
): Promise<Product> => {
    const product = await prisma.product.findUnique({
        where: {
            id,
        },
    })

    const variation = JSON.parse(product.variation)
    const foundSizeIndex = variation.findIndex((obj) => obj.name === size)

    if (foundSizeIndex != -1) {
        variation[foundSizeIndex].stock = Math.max(
            variation[foundSizeIndex].stock - quantity,
            0
        )
        product.variation = JSON.stringify(variation)

        return await prisma.product.update({
            where: {
                id,
            },
            data: {
                variation: JSON.stringify(variation),
            },
        })
    }

    return product
}

// Create product
export const createProduct = async (
    data: Prisma.ProductCreateInput,
    files: { mainImage: Express.Multer.File[]; gallery: Express.Multer.File[] }
): Promise<Product> => {
    try {
        const { mainImage, gallery } = files
        const mainImageUrl = await uploadImage(mainImage[0])
        const galleryUrls = await Promise.all(
            (gallery || []).map(async (image) => await uploadImage(image))
        )

        const updatedData = { ...data, imageUrl: mainImageUrl }
        const product = await prisma.product.create({
            data: {
                ...data,
                imageUrl: mainImageUrl,
                galleryImages: galleryUrls,
            },
        })
        return product
    } catch (error) {
        console.log(error)
        throw error
    }
}

// Update product
export const updateProduct = async (
    id: number,
    data: Prisma.ProductUpdateInput
): Promise<Product> => {
    const product = await prisma.product.update({
        where: {
            id,
        },
        data,
    })
    return product
}

// Delete product
export const deleteProduct = async (id: number): Promise<Product> => {
    const product = await prisma.product.delete({
        where: {
            id,
        },
    })
    return product
}
