// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import knex from 'knex'
import { responsesApiStock } from '../../utils/';


const { PORT, DB_USER, DB_HOST, DB_DATABASE, DB_PASSWORD, DB_PORT, DB_TABLE } = process.env

export const port = PORT || 80
export const table = DB_TABLE || 'stock_sku'
export const connection = {
  user: DB_USER || 'sls_cl_ccom_easy_smartpicking',
  host: DB_HOST || 'cl-ccom-easy-smartpicking.cluster-cqpeqdephwqv.us-east-1.rds.amazonaws.com',
  database: DB_DATABASE || 'easy',
  password: DB_PASSWORD || 'K7k4KRv5jE56NpZdrsQ3',
  port: DB_PORT || 3306
}

type Data = {
  count?: number
  content?: any[]
  message?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { size = 10, page = 1, ...searchCriteria } = req.query
  const db = knex({ client: 'mysql2', connection })
  try {
    const pageSize = Number.parseInt(size as string);
    const pageNumber = Number.parseInt(page as string)
    const stock = await db(table).select().where(searchCriteria).limit(pageSize).offset(pageSize * (pageNumber - 1))
    res.status(200)
    res.json(responsesApiStock.buildResponseObject(stock, pageNumber, pageSize, searchCriteria))
  } catch (error) {
    console.log(error)
    res.status(400).json({ message: error as string })
  }
}
