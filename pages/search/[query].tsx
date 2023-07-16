import { NextPage, GetServerSideProps } from "next";

import { Typography } from "@mui/material";
import { ShopLayout } from "../../components/layouts";
import { ProductList } from "../../components/products";
import { IProduct } from "../../interfaces";
import { getAllProducts, getProductSearch } from "../../database";

interface Props {
  products: IProduct[],
  searchTerm: string
}

const SearchPage: NextPage<Props> = ({ products, searchTerm }) => {
  // const { products, isLoading } = useProducts<IProduct[]>("/products");
  return (
    <ShopLayout
      title="Teslo-Shop - Search"
      pageDescription="Encuentra los mejores productos de Teslo aqui"
    >
      <Typography variant="h1" component="h1">
        Buscar producto
      </Typography>
      <Typography variant="h2" sx={{ mb: 3, mt: 1 }} textTransform='capitalize'>
        Busqueda: { searchTerm }
      </Typography>
      <ProductList products={products} />
    </ShopLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const { query = '' } = params as { query: string }
  let message = query
  if (query.length == 0) {
    return {
      redirect: {
        destination: '/',
        permanent: true
      }
    }
  }
  let products = await getProductSearch(query)
  if (products.length == 0) {
    products = await getAllProducts()
    message = `No se encontraron resultados para la búsqueda: ${query}, te sugerimos algunos.`
  }

  return {
    props: {
      products,
      searchTerm: message
    }
  }
}

export default SearchPage;
