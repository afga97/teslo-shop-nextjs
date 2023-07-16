import type { NextApiRequest, NextApiResponse } from 'next'
import { Order, Product, User } from '../../../models';
import { db } from "../../../database";

type Data = {
  numberOfOrders: number;
  paidOrders: number; // is paid en true
  notPaidOrders: number;
  numberOfClients: number; // rol solo clients
  numberOfProducts: number;
  productsWithNoInventory: number; // 0
  lowInventory: number; // Productos con 10 o menos en stock
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

  await db.connect()
  // const countnumberOfOrders = await Order.count().lean()
  // const countPaidOrders = await Order.find({ isPaid: true }).count().lean()
  // const countClients = await User.find({ role: 'client' }).count().lean()
  // const countNumberOfProducts = await Product.count().lean()
  // const countProductsWithNoInventory = await Product.find({ inStock: 0 }).count().lean()
  // const countLowInventory = await Product.find({ inStock: { $lte: 10 }}).count()
  const [
    countnumberOfOrders, countPaidOrders,
    countClients, countNumberOfProducts,
    countProductsWithNoInventory, countLowInventory
  ] = await Promise.all([
    Order.count().lean(),
    Order.find({ isPaid: true }).count().lean(),
    User.find({ role: 'client' }).count().lean(),
    Product.count().lean(),
    Product.find({ inStock: 0 }).count().lean(),
    Product.find({ inStock: { $lte: 10 }}).count()
  ])
  await db.disconnect()

  res.status(200).json({ 
    numberOfOrders: countnumberOfOrders,
    paidOrders: countPaidOrders, 
    notPaidOrders: countnumberOfOrders - countPaidOrders,
    numberOfClients: countClients,
    numberOfProducts: countNumberOfProducts,
    productsWithNoInventory: countProductsWithNoInventory,
    lowInventory: countLowInventory
  })
}