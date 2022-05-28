import { Router } from 'express'
import * as multer from 'multer'

import Validator from '../../middlewares/validator'
import AuthGuard from '../../middlewares/authenticate'
import {
    getAllProducts,
    getProductBySlug,
    createProduct,
    updateProduct,
    deleteProduct,
} from './products.controller'

const router = Router()
const storage = multer.memoryStorage()
const upload = multer({ storage })

/* List of products */
router.get('/products', getAllProducts)

/* Get a single product */
router.get('/products/:slug', Validator.validate('slug'), getProductBySlug)

/* Create a product */
const galleryUpload = upload.fields([
    { name: 'mainImage', maxCount: 1 },
    { name: 'gallery', maxCount: 8 },
])
router.post('/products', galleryUpload, AuthGuard.verifyToken, createProduct)

/* Edit a specific product */
router.put(
    '/products/:id',
    AuthGuard.verifyToken,
    AuthGuard.adminOnly,
    Validator.validate('idParam'),
    updateProduct
)

/* Delete a product */
router.delete(
    '/products/:id',
    AuthGuard.verifyToken,
    AuthGuard.adminOnly,
    Validator.validate('idParam'),
    deleteProduct
)

export default router
