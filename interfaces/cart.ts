import { IProduct, ISize } from "./";


type ProductBasic = Omit<
  IProduct, 
  "images" | "inStock" | "sizes" | "tags" | "description" |
  "createdAt" | "updatedAt" | "type"
>;

export interface ICartProduct extends ProductBasic {
  image: string;
  size ?: ISize;
  quantity: number;
}

export interface ShippingAddress {
  address: string;
  address2?: string;
  city: string;
  country: string;
  firstName: string;
  lastName: string;
  phone: string;
  zip: string;
}