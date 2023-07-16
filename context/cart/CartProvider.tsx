import { FC, useEffect, useReducer } from "react";
import Cookie from 'js-cookie'
import { ICartProduct, IOrder, IOrderItem, ShippingAddress } from "../../interfaces";
import { CartContext, cartReducer } from './'
import Cookies from "js-cookie";
import { tesloClientApi } from "../../api";
import axios from "axios";



export interface STATE {
  isLoaded: boolean
  cart ?: ICartProduct[]
  shippingAddress ?: ShippingAddress
}

export const INITIAL_STATE: STATE = {
  isLoaded: false,
  cart: undefined,
  shippingAddress: undefined 
}

export const CartProvider: FC<{ children: JSX.Element }> = ({ children }) => {

  const [state, dispatch] = useReducer(cartReducer, INITIAL_STATE)

  useEffect( () => {
    try {
      const productsCart = Cookie.get('cart') ? JSON.parse(Cookie.get('cart')!): []
      dispatch({ type: '[Cart] - LoadCart from cookies | storage', payload: productsCart })
    } catch (error) {
      dispatch({ type: '[Cart] - LoadCart from cookies | storage', payload: [] })
    }
  }, [])

  useEffect(() => {
    if ( Cookie.get('firstName') ){ 
      const dataShippingAdress: ShippingAddress = {
        address: Cookies.get('address') || '', 
        address2 : Cookies.get('address2') || '',
        city: Cookies.get('city') || '',
        country: Cookies.get('country') || '',
        firstName: Cookies.get('firstName') || '',
        lastName: Cookies.get('lastName') || '',
        phone: Cookies.get('phone') || '',
        zip: Cookies.get('zip') || ''
      }
      dispatch({ type: '[Cart] LoadAddress from cookies', payload: dataShippingAdress })
    }
  }, [])
  

  useEffect(() => {
    if (state.isLoaded) {
      Cookie.set('cart', JSON.stringify( state.cart ))
    }
  }, [state.cart])

  
  const updateProductCart = (products: ICartProduct[]) => {
    dispatch({ type: '[Cart] Update Product', payload: products })
  }

  const updateCartQuantity = (product: ICartProduct) => {
    dispatch({ type: '[Cart] Change product quantity', payload: product })
  }

  const removeProduct = (product: ICartProduct) => {
    dispatch({ type: '[Cart] Remove product cart', payload: product })
  }

  const updateAddress = (address: ShippingAddress) => {
    Cookies.set('address', address.address)
    Cookies.set('address2', address?.address2 || '')
    Cookies.set('city', address.city)
    Cookies.set('country', address.country)
    Cookies.set('firstName', address.firstName)
    Cookies.set('lastName', address.lastName)
    Cookies.set('phone', address.phone)
    Cookies.set('zip', address.zip)
    dispatch({ type: '[Cart] Update address', payload: address })
  }

  const createOrder = async (): Promise<{ hasError: boolean; message?: string}> => {

    if (!state.shippingAddress) {
      throw new Error('No hay una dirección de entrega');
    }

    const subtotal = state.cart?.reduce((acum, currentVal) => acum + (currentVal.price * currentVal.quantity), 0);
    const taxEnvironment = Number(process.env.NEXT_PUBLIC_TAX_RATE)
    const body: IOrder = {
      orderItems: state.cart?.map(p => ({
        ...p, 
        size: p.size!
      }))|| [] as IOrderItem[],
      shippingAddress: state.shippingAddress,
      numberOfItems: state.cart?.length,
      tax: taxEnvironment,
      isPaid: false,
      subTotal: subtotal,
      total: (subtotal! * taxEnvironment + subtotal!),
    }
    try {
      const { data } = await tesloClientApi.post('/orders', body)
      dispatch({ type: '[Cart] Orden Complete'})
      Cookies.remove('cart')
      return { hasError: false, message: data._id! }
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        return { hasError: true, message: error.response?.data.message }
      }
      return { hasError: true, message: 'Ocurrio un error al crear la orden' }
    }
  }

  return (
    <CartContext.Provider
      value={{ 
        ...state,
        removeProduct,
        updateCartQuantity,
        updateProductCart,
        updateAddress,

        createOrder
      }}
    >
      { children }
    </CartContext.Provider>
  )
}