import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../../database'
import { Product } from '../../../models'
import { IProduct } from '../../../interfaces'

type Data = 
| { mesagge: string }
| IProduct[]

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  switch (req.method) {
    case 'GET':
      return getProducts(req, res)
    case 'PUT':
      
    case 'POST':
  
    default:
      return res.status(500).json({ mesagge: 'Bad request'})
  }
}

const getProducts = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  await db.connect()
  const products = await Product.find()
    .sort({ title: 'asc' })
    .lean()
  await db.disconnect()

  res.status(200).json(products)
}
