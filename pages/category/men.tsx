import { Typography } from "@mui/material"
import { ShopLayout } from "../../components/layouts"
import { ProductList } from "../../components/products"
import { FullScreenLoading } from "../../components/ui"
import { useProducts } from "../../hooks"
import { IProduct } from "../../interfaces"

const MenPage = () => {
  const { products, isLoading } = useProducts<IProduct[]>("/products/?gender=men");

  return (
    <ShopLayout
      title="Teslo-Shop - Men"
      pageDescription="Encuentra los mejores productos para mans"
    >
      <Typography variant="h1" component="h1">
        Men
      </Typography>
      <Typography variant="h2" sx={{ mb: 1 }}>
        Productos para hombres
      </Typography>
      {isLoading ? <FullScreenLoading /> : <ProductList products={products} />}

    </ShopLayout>
  )
}

export default MenPage