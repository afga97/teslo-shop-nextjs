import { Typography } from "@mui/material";
import { ShopLayout } from "../../components/layouts"
import { ProductList } from "../../components/products"
import { FullScreenLoading } from "../../components/ui"
import { useProducts } from "../../hooks";
import { IProduct } from "../../interfaces"

const KidPage = () => {
  const { products, isLoading } = useProducts<IProduct[]>("/products/?gender=kid");

  return (
    <ShopLayout
      title="Teslo-Shop - Kid"
      pageDescription="Encuentra los mejores productos para kids"
    >
      <Typography variant="h1" component="h1">
        Kids
      </Typography>
      <Typography variant="h2" sx={{ mb: 1 }}>
        Productos para niños
      </Typography>
      {isLoading ? <FullScreenLoading /> : <ProductList products={products} />}
    </ShopLayout>
  )
}

export default KidPage