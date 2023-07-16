import type { NextApiRequest, NextApiResponse } from "next";
// import { getSession } from "next-auth/react";
import { getToken } from 'next-auth/jwt';
import { db } from "../../../database";
import { IOrder } from "../../../interfaces";
import { Order, Product } from "../../../models";

type Data = { message: string } | IOrder;


export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

  switch (req.method) {
    case 'POST':
      return createOrder(req, res)
    default:
      res.status(400).json({ message: 'Bad request'})
  }
  res.status(200).json({ message: 'Example' })
}

const createOrder = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  
  const { orderItems, total } = req.body as IOrder

  // Verificar la sesion del usuario
  const session: any = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!session) {
    return res.status(401).json({ message: 'No se encuentra autenticado para realizar esta acción'})
  }

  // Crear arreglo con los productos de la ordern
  const prodoctsIds = orderItems.map( product => product._id)

  await db.connect()
  const dataProducts = await Product.find({ _id: { $in: prodoctsIds }});
  
  try {
    const subtotal = orderItems.reduce((acum, currentVal) => {
      const currentPrice = dataProducts.find( prod => prod.id === currentVal._id)!.price
      if (!currentPrice){
        throw new Error('Verifique el carrito de nuevo, producto no existe');
      }
      return  acum + (currentPrice * currentVal.quantity)
    }, 0)

    const taxRate = Number(process.env.NEXT_PUBLIC_TAX_RATE || 0)
    const backendTotal = (subtotal * taxRate) + subtotal
    
    if (total !== backendTotal) {
      throw new Error('El total no coincide con los calculos realizados')
    }
    const userId = session.user.id;
    const newOrder = new Order({ ...req.body, isPaid: false, user: userId });
    newOrder.total = Math.round( total * 100 ) / 100;
    await newOrder.save()
    await db.disconnect()
    return res.status(201).json(JSON.parse(JSON.stringify(newOrder)))
  } catch (error: any) {
    await db.disconnect();
    console.log(error)
    res.status(400).json({
      message: error?.message || 'Ocurrio un error al registrar la orden'
    })
  }
}
