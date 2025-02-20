import * as productService from '../../services/product.service'
import { Request } from '../../helpers/constants'
import { Response } from 'express'

export const getAllProducts = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const productResponse = await productService.getAllProducts(
            +req.query?.category || null,
            (req.query?.search as string) || null,
            +req.query?.offset || 0,
            +req.query?.size || null
        )
        res.status(200).json(productResponse)
    } catch (error) {
        res.status(500).json(error)
    }
}

export const getProductBySlug = async (req: Request, res: Response) => {
    const { slug } = req.params
    try {
        const product = await productService.getProductBySlug(slug)
        res.status(200).json(product)
    } catch (error) {
        res.status(500).json(error)
    }
}

export const getProductById = async (req: Request, res: Response) => {
    const { id } = req.params
    try {
        const product = await productService.getProductById(+id)
        res.status(200).json(product)
    } catch (error) {
        res.status(500).json(error)
    }
}

// Turn product name into lower case and replace spaces and special symbols with dashes
const sluggify = (name: string) =>
    name
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '')

export const createProduct = async (req: Request, res: Response) => {
    const { title, description, price, categoryId, variation } = req.body
    try {
        const product = await productService.createProduct(
            {
                title,
                description,
                price: +price,
                slug: sluggify(title),
                categoryId: +categoryId,
                variation,
            },
            req.files as {
                mainImage: Express.Multer.File[]
                gallery: Express.Multer.File[]
            }
        )
        res.status(201).json(product)
    } catch (error) {
        res.status(500).json(error)
    }
}

export const updateProduct = async (req: Request, res: Response) => {
    const { id } = req.params
    const { title, description, price, slug, image, variation } = req.body
    try {
        const product = await productService.updateProduct(+id, {
            title,
            description,
            price,
            slug,
            variation: JSON.stringify(variation),
        })
        res.status(200).json(product)
    } catch (error) {
        res.status(500).json(error)
    }
}

// Delete product by id
export const deleteProduct = async (req: Request, res: Response) => {
    const { id } = req.params
    try {
        await productService.deleteProduct(+id)
        res.status(200).json({ message: 'Product deleted' })
    } catch (error) {
        res.status(500).json(error)
    }
}
