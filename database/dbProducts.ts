import { db } from '.';
import { IProduct } from '../interfaces';
import { Product } from '../models';

export const getProductBySlug = async (slug: string): Promise<IProduct | null > => {
  await db.connect();
  const product = await Product.findOne({ slug }).lean()
  await db.disconnect();
  if (!product) return null 

  // TODO: 
  // procesamiento al momento de subir las imagenes
  product.images = product.images.map( image => {
    return image.includes('http') ? image : `${ process.env.HOST_NAME}products/${ image }`
  });

  return JSON.parse(JSON.stringify(product))
}

interface ProductSlug {
  slug: string
}

export const getAllProductSlugs = async (): Promise<ProductSlug[]> => {
  await db.connect();
  const slugs = await Product.find().select('slug -_id').lean()
  await db.disconnect();
  return slugs
}

export const getProductSearch = async (search: string): Promise<IProduct[]> => {
  let term = search.toString().toLowerCase()
  await db.connect();
  const products = await Product.find({ 
    $text: {$search: term } })
    .select('title images price inStock slug -_id')
    .lean()
  await db.disconnect();
  return products
}

export const getAllProducts = async (): Promise<IProduct[]> => {
  await db.connect();
  const products = await Product.find({})
    .select('title images price inStock slug -_id')
    .skip(0)
    .limit(10)
    .lean()
  await db.disconnect();
  return products
}