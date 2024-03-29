import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../../database'
import { Product } from '../../../models'
import { IProduct } from '../../../interfaces'
import { isValidObjectId } from 'mongoose'

type Data = 
| { message: string }
| IProduct[] | IProduct

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  switch (req.method) {
    case 'GET':
      return getProducts(req, res)
    case 'PUT':
      return updateProduct(req, res)
    case 'POST':
    return createProduct(req, res)
    default:
      return res.status(500).json({ message: 'Bad request'})
  }
}

const getProducts = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  await db.connect()
  const products = await Product.find()
    .sort({ title: 'asc' })
    .lean()

  const updatedProducts: any = products.map( product => {
    product.images = product.images.map( image => {
        return image.includes('http') ? image : `${ process.env.HOST_NAME}products/${ image }`
    });
    return updatedProducts;
  })

  await db.disconnect()

  res.status(200).json(updatedProducts)
}
const updateProduct = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  
  const { _id = '', images = [] } = req.body as IProduct

  if (!isValidObjectId(_id)) {
    return res.status(400).json({ message: 'El id del producto no es válido'})
  }

  if (images.length < 2 ) {
    return res.status(400).json({ message: 'Es necesario al menos 2 imagenes'})
  }

  // TODO: posiblemente tendremos un localhost:3000/products/asasa.jpg

  try {
    await db.connect()
    const product = await Product.findById(_id)

    if (!product) {
      await db.disconnect()
      return res.status(400).json({ message: 'No existe un producto con el ID'})
    }
    // TODO: eliminar fotos en Cloudinary

    await product.update(req.body);
    await db.disconnect()

    return res.status(200).json(product)
  } catch (error) {
    await db.disconnect()
    return res.status(500).json({ message: 'Ocurrio un error al actualizar'})
  }

}

const createProduct = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { images = [] } = req.body as IProduct

  if (images.length < 2 ) {
    return res.status(400).json({ message: 'Es necesario al menos 2 imagenes'})
  }

  try {
    await db.connect()
    const productExist = await Product.findOne({ slug: req.body.slug })
    if (productExist) {
      return res.status(400).json({ message: 'Ya existe un producto con el slug' })
    }
    const product = new Product(req.body)
    await product.save()
    await db.disconnect()

    res.status(201).json(product)
  } catch (error) {
    return res.status(500).json({ message: 'Ocurrio un error al crear el producto'})

  }

}

