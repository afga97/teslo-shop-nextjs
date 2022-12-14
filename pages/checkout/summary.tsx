import { Box, Button, Card, CardContent, Divider, Grid, Link, Typography } from "@mui/material";
import NextLink from 'next/link'
import { CartList, OrdenSummary } from "../../components/cart";
import { ShopLayout } from "../../components/layouts";

const SummaryPage = () => {
  return (
    <ShopLayout
      title="Resumen de orden"
      pageDescription="Resumen de la orden"
    >
      <Typography variant="h1" component="h1">
        Resumen de la orden
      </Typography>
      <Grid container>
        <Grid item xs={12} sm={7}>
          <CartList />
        </Grid>
        <Grid item xs={12} sm={5}>
          <Card className="summary-card">
            <CardContent>
              <Typography variant="h2">Resumen (3 productos)</Typography>
              
              <Box display='flex' justifyContent='space-between'>
                <Typography variant='subtitle1'>Dirección de entrega</Typography>
                <NextLink href='/checkout/address' passHref>
                  <Link underline="always">
                    Editar
                  </Link>
                </NextLink>
              </Box>

              <Typography>Andres Giraldo</Typography>
              <Typography>Cll 32 6 - 12</Typography>
              <Typography>Medellín</Typography>
              <Typography>+1 2332232</Typography>

              <Divider sx={{ my: 1 }} />

              <Box display='flex' justifyContent='end'>
                <NextLink href='/cart' passHref>
                  <Link underline="always">
                    Editar
                  </Link>
                </NextLink>
              </Box>

              <OrdenSummary />
              <Box sx={{ mt: 3 }}>
                <Button color='secondary' className='circular-btn' fullWidth>
                  Confirmar orden
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </ShopLayout>
  );
};

export default SummaryPage;
