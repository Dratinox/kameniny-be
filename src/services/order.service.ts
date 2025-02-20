import { Order } from '@prisma/client'
import { prisma } from '../prisma'
import { PlaceOrderPayload } from '../types/order'
import * as productService from './product.service'

export const getOrders = async (userId: number): Promise<Order> => {
    return await prisma.order.findFirst({
        where: {
            userId,
        },
    })
}

export const getOrder = async (id: number): Promise<Order> => {
    return await prisma.order.findFirst({
        where: {
            id,
        },
    })
}

// TODO: Replace user data in order with User and Address Entity
export const placeOrder = async (
    userId: number,
    payload: PlaceOrderPayload
) => {
    try {
        const { cartItems, paymentMethod, zipCode, ...orderData } = payload

        // For every item in cart update given product stock by id
        await Promise.all(
            cartItems.map(async (cartItem) => {
                await productService.decreaseProductQuantity(
                    cartItem.id,
                    cartItem.quantity,
                    cartItem.selectedProductSize
                )
            })
        )

        return await prisma.order.create({
            data: {
                userId,
                ...orderData,
                items: JSON.stringify(cartItems),
            },
        })
    } catch (error) {
        console.log(error)
        throw error
    }
}

export const cancelOrder = async (id: number) => {
    console.log('TODO')
}

export const updateOrder = async (id: number, status: string) => {
    console.log('TODO')
}
