import {
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  Link,
  Typography,
} from "@mui/material";
import NextLink from "next/link";
import CreditCardOffOutlined from "@mui/icons-material/CreditCardOffOutlined";
import CreditScoreOutlined from "@mui/icons-material/CreditScoreOutlined";
import { CartList, OrdenSummary } from "../../components/cart";
import { ShopLayout } from "../../components/layouts";

const OrderPage = () => {
  return (
    <ShopLayout
      title="Resumen de la orden 1221212"
      pageDescription="Resumen de la orden"
    >
      <Typography variant="h1" component="h1">
        Orden: ABC123
      </Typography>

      {/* <Chip
        sx={{ my: 2 }}
        label='Pendiente de pago'
        variant='outlined'
        color='error'
        icon={ <CreditCardOffOutlined />}
      /> */}

      <Chip
        sx={{ my: 2 }}
        label="Orden pagada"
        variant="outlined"
        color="success"
        icon={<CreditScoreOutlined />}
      />

      <Grid container>
        <Grid item xs={12} sm={7}>
          <CartList />
        </Grid>
        <Grid item xs={12} sm={5}>
          <Card className="summary-card">
            <CardContent>
              <Typography variant="h2">Resumen (3 productos)</Typography>

              <Box display="flex" justifyContent="space-between">
                <Typography variant="subtitle1">
                  Dirección de entrega
                </Typography>
                <NextLink href="/checkout/address" passHref>
                  <Link underline="always">Editar</Link>
                </NextLink>
              </Box>

              <Typography>Andres Giraldo</Typography>
              <Typography>Cll 32 6 - 12</Typography>
              <Typography>Medellín</Typography>
              <Typography>+1 2332232</Typography>

              <Divider sx={{ my: 1 }} />

              <Box display="flex" justifyContent="end">
                <NextLink href="/cart" passHref>
                  <Link underline="always">Editar</Link>
                </NextLink>
              </Box>

              <OrdenSummary />
              <Box sx={{ mt: 3 }}>
                <h1>Pagar</h1>
              </Box>
              
              <Chip
                sx={{ my: 2 }}
                label="Orden pagada"
                variant="outlined"
                color="success"
                icon={<CreditScoreOutlined />}
              />
              
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </ShopLayout>
  );
};

export default OrderPage;
