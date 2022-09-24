import { Grid } from "@mui/material"
import { FC } from "react"
import { ProductCard } from './';
import { IProduct } from "../../interfaces"

interface Props {
  products: IProduct[]
}

export const ProductList: FC<Props> = ({ products }) => {
  return (
    <Grid container spacing={4}>
      {
        products.map( product => (
          <ProductCard product={product} key={ product.slug } />
        ))
      }
    </Grid>
  )
}
