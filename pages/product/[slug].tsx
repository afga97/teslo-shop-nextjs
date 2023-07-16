import { useContext, useState } from "react";
import { NextPage, GetStaticPaths, GetStaticProps } from "next";
import { useRouter } from "next/router"
import { Box, Button, Chip, Grid, Typography } from "@mui/material";
import { ShopLayout } from "../../components/layouts";
import { ProductSlideshow, SizeSelector } from "../../components/products";
import { ItemCounter } from "../../components/ui";
import { ICartProduct, IProduct, ISize } from "../../interfaces";
import { getAllProductSlugs, getProductBySlug } from "../../database";
import { CartContext } from "../../context";

// import { initialData } from "../../database/products";
// import { useProducts } from "../../hooks"
// const product = initialData.products[0]
interface Props {
  product: IProduct;
}

const PageProductSlug: NextPage<Props> = ({ product }) => {
  const router = useRouter()
  // const { products: product, isLoading } = useProducts<IProduct>(`/products/${router.query.slug}`)
  const { cart, updateProductCart } = useContext(CartContext);
  const [itemProductCart, setItemProductCart] = useState<ICartProduct>({
    _id: product._id,
    price: product.price,
    slug: product.slug,
    title: product.title,
    gender: product.gender,
    image: product.images[0],
    quantity: 0
  })

  const setProductSize = (size: ISize) => {
    setItemProductCart({ ...itemProductCart, size })
  }

  const setQuantityItem = (quantity: number) => {
    setItemProductCart({ ...itemProductCart, quantity })
  }

  const addProductInCart = () => {
    let productsCart = cart?.length ? [ ...cart] : []
    let productFind = cart?.find(item => item._id == itemProductCart._id && item.size == itemProductCart.size)
    if (productFind) {
      productFind.quantity += itemProductCart.quantity
      productsCart = [ ...productsCart ]
    } else {
      productsCart = [ ...productsCart, itemProductCart ]
    }
    updateProductCart(productsCart)
    router.push('/cart')
  };

  return (
    <ShopLayout title={product.title} pageDescription={product.description}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={7}>
          <ProductSlideshow images={product.images} />
        </Grid>
        <Grid item xs={12} sm={5}>
          <Box display="flex" flexDirection="column">
            <Typography variant="h1" component="h1">
              {product.title}
            </Typography>
            <Typography variant="subtitle1" component="h2">
              ${product.price}
            </Typography>

            <Box sx={{ my: 2 }}>
              <Typography variant="subtitle2">Cantidad</Typography>
              <ItemCounter
                counter={itemProductCart.quantity}
                setCounter={setQuantityItem}
                maxValue={ product.inStock }
              />
              <SizeSelector
                selectedSize={ itemProductCart.size }
                sizes={product.sizes}
                setSizeProduct={ setProductSize }
              />
            </Box>

            {product.inStock === 0 ? (
              <Chip
                label="No hay disponibles"
                color="error"
                variant="outlined"
              />
            ) : (
              <Button
                color="secondary"
                className="circular-btn"
                onClick={addProductInCart}
              >
                { itemProductCart.size 
                  ? 'Agregar al carrito'
                  : 'Seleccione una talla'
                }
              </Button>
            )}

            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle2">Descripcion</Typography>
              <Typography variant="body2">{product.description}</Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ShopLayout>
  );
};

// export const getServerSideProps: GetServerSideProps = async ({ params }) => {
//   const { slug } = params as { slug: string }
//   const product = await getProductBySlug(slug)

//   if (!product) {
//     return {
//       redirect: {
//         destination: '/',
//         permanent: false
//       }
//     }
//   }

//   return {
//     props: { product }
//   }
// }

export const getStaticPaths: GetStaticPaths = async (ctx) => {
  const slugs = await getAllProductSlugs();
  console.log("SLUGS", slugs)
  return {
    paths: slugs.map(({ slug }) => ({
      params: { slug },
    })),
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params as { slug: string };
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {
      product,
    },
    revalidate: 60 * 60 * 24,
  };
};

export default PageProductSlug;
