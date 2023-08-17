import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../database";

import { IProduct } from './../../../interfaces/';
import { Product } from "../../../models";

type Data = { message: string } | IProduct;

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch (req.method) {
    case "GET":
      return getProductBySlug(req, res)
    default:
      res.status(200).json({ message: "Metodo no valido" });
  }
}


const getProductBySlug = async (
  req: NextApiRequest,
  res: NextApiResponse<Data>
) => {
  const { slug } = req.query;
  await db.connect();

  const productItem: IProduct = await Product.findOne({ slug }).lean();
  await db.disconnect();
  productItem.images = productItem.images.map(image => {
    return image.includes('http') ? image : `${process.env.HOST_NAME}products/${image}`
  });
  if (!productItem) {
    await db.disconnect();
    return res.status(404).json({ message: 'No hay un prodcuto con el slug' + slug });
  }
  res.status(200).json(productItem)
};

