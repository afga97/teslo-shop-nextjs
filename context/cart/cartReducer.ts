import { ICartProduct, ShippingAddress } from "../../interfaces";
import { STATE } from "./";

type CART_ACTIONS =
  | { type: "[Cart] Update Product", payload: ICartProduct[] }
  | {
      type: "[Cart] - LoadCart from cookies | storage",
      payload: ICartProduct[];
    }
  | { type: "[Cart] Change product quantity", payload: ICartProduct }
  | { type: "[Cart] Remove product cart", payload: ICartProduct }
  | { type: "[Cart] LoadAddress from cookies", payload: ShippingAddress }
  | { type: "[Cart] Update address", payload: ShippingAddress }
  | { type: "[Cart] Orden Complete" }


export const cartReducer = (state: STATE, action: CART_ACTIONS): STATE => {
  switch (action.type) {
    case "[Cart] - LoadCart from cookies | storage":
      return { ...state, isLoaded: true, cart: [...action.payload] };
    case "[Cart] Update Product":
      return { ...state, cart: [...action.payload] };
    case "[Cart] Change product quantity":
      return {
        ...state,
        cart: state?.cart?.map((product) => {
          if (product._id !== action.payload._id) return product;
          if (product.size !== action.payload.size) return product;
          return action.payload;
        }),
      };
    case "[Cart] Remove product cart":
      return {
        ...state,
        cart: state?.cart?.filter(
          (product) =>
            !(
              product._id === action.payload._id &&
              product.size === action.payload.size
            )
        ),
      };
    case "[Cart] Orden Complete":
      return {
        ...state, cart: []
      }
    case "[Cart] Update address":
    case "[Cart] LoadAddress from cookies":
      return {
        ...state,
        shippingAddress: { ...action.payload }
      };
    default:
      return state;
  }
};
