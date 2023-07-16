import { useContext, useEffect } from "react";
import { useRouter } from "next/router";
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  Typography,
} from "@mui/material";
import { CartList, OrdenSummary } from "../../components/cart";
import { ShopLayout } from "../../components/layouts";
import { CartContext } from "../../context";
import { ICartProduct } from "../../interfaces";

const CardPage = () => {
  const { cart = [], isLoaded } = useContext(CartContext);
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && cart.length <= 0) {
      router.push("/cart/empty");
    }
  }, [cart, router, isLoaded])
  

  return (
    <>
      {cart.length > 0 && (
        <ShopLayout
          title="Carrito - 3"
          pageDescription="Carrito de compras de la lista"
        >
          <Typography variant="h1" component="h1">
            Carrito
          </Typography>
          <Grid container>
            <Grid item xs={12} sm={7}>
              <CartList 
                editable={ true }
              />
            </Grid>
            <Grid item xs={12} sm={5}>
              <Card className="summary-card">
                <CardContent>
                  <Typography variant="h2">Orden</Typography>
                  <Divider sx={{ my: 1 }} />
                  <OrdenSummary />
                  
                  <Box sx={{ mt: 3 }}>
                    <Button
                      color="secondary"
                      className="circular-btn"
                      fullWidth
                      href='/checkout/address'
                    >
                      Checkout
                    </Button>
                  </Box>

                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </ShopLayout>
      )}
    </>
  );
};

export default CardPage;
