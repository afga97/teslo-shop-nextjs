import { FC, useContext } from "react";
import {
  Box,
  Button,
  CardActionArea,
  CardMedia,
  Grid,
  Link,
  Typography,
} from "@mui/material";
import NextLink from "next/link";
import { ItemCounter } from "../ui";
import { ICartProduct, IOrderItem } from "../../interfaces";
import { CartContext } from "../../context";

interface Props {
  editable ?: boolean;
  products ?: IOrderItem[];
}

export const CartList: FC<Props> = ({
  products = [],
  editable = false
}) => {

  const { cart = [], removeProduct, updateCartQuantity } = useContext(CartContext);

  const onNewCartQuantity = (product: ICartProduct, newQuantityValue: number) => {
    product.quantity = newQuantityValue;
    updateCartQuantity(product)
  }

  const productsToShow = products.length > 0 ? products : cart;

  return (
    <>
      {productsToShow.map((product) => (
        <Grid
          container
          spacing={2}
          key={product.slug + product.size}
          sx={{ mb: 1 }}
        >
          <Grid item xs={3}>
            <NextLink href={`/product/${product.slug}`} passHref>
              <Link>
                <CardActionArea>
                  <CardMedia
                    image={`/products/${product.image}`}
                    component="img"
                    sx={{ borderRadius: "5px" }}
                  />
                </CardActionArea>
              </Link>
            </NextLink>
          </Grid>
          <Grid item xs={7}>
            <Box display="flex" flexDirection="column">
              <Typography variant="body1">{product.title}</Typography>
              <Typography variant="body1">
                Talla: <strong>{product.size}</strong>
              </Typography>

              {/** Condicionar si se debe mostrar el cambiar las cantidades */}
              {editable ? (
                <ItemCounter
                  counter={product.quantity}
                  maxValue={10}
                  setCounter={(value) => onNewCartQuantity(product as ICartProduct, value)}
                />
              ) : (
                <Typography variant="h5">{product.quantity}</Typography>
              )}
            </Box>
          </Grid>
          <Grid
            item
            xs={2}
            display="flex"
            alignItems="center"
            flexDirection="column"
          >
            <Typography variant="subtitle1">${product.price}</Typography>
            {editable && (
              <Button
                variant="text"
                color="secondary"
                onClick={() => removeProduct(product as ICartProduct)}
              >
                Remover
              </Button>
            )}
          </Grid>
        </Grid>
      ))}
    </>
  );
};
