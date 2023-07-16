import { createContext } from 'react'
import { ICartProduct, ShippingAddress } from '../../interfaces'


interface Context {
  isLoaded: boolean;
  cart ?: ICartProduct[];

  shippingAddress ?: ShippingAddress

  updateProductCart: (product: ICartProduct[]) => void
  updateCartQuantity: (product: ICartProduct) => void
  removeProduct: (product: ICartProduct) => void
  updateAddress: (address: ShippingAddress) => void
  createOrder : () => Promise<{ hasError: boolean; message?: string}>
}

export const CartContext = createContext({} as Context)