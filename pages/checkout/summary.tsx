import { useContext, useEffect, useState } from 'react'
import NextLink from 'next/link'
import { useRouter } from 'next/router';
import { Box, Button, Card, CardContent, Chip, Divider, Grid, Link, Typography } from "@mui/material";
import { CartContext } from '../../context'

import { CartList, OrdenSummary } from "../../components/cart";
import { ShopLayout } from "../../components/layouts";
import { countries } from '../../utils/countries';
import Cookies from 'js-cookie';


const SummaryPage = () => {

  const router = useRouter()
  const { shippingAddress, createOrder } = useContext(CartContext)

  const [isPosting, setisPosting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    if (!Cookies.get('firstName')) {
      router.push('/checkout/address')
    }
  }, [router])
  

  // const getAddressShipping= () => {
  //   return countries.find(country => country.code == shippingAddress?.country)?.name || ''
  // }

  const onCreateOrder = async () => {
    setisPosting(true)
    const { hasError, message = '' } = await createOrder();
    if (hasError) {
      setisPosting(false)
      setErrorMessage(message)
      return;
    }
    router.replace(`/orders/${ message }`)
  }

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

              <Typography>{ shippingAddress?.firstName} { shippingAddress?.lastName }</Typography>
              <Typography>{ shippingAddress?.address} { shippingAddress?.address2}</Typography>
              <Typography>{ shippingAddress?.city} { shippingAddress?.country }</Typography>
              <Typography>{ shippingAddress?.phone}</Typography>

              <Divider sx={{ my: 1 }} />

              <Box display='flex' justifyContent='end'>
                <NextLink href='/cart' passHref>
                  <Link underline="always">
                    Editar
                  </Link>
                </NextLink>
              </Box>

              <OrdenSummary />
              <Box sx={{ mt: 3 }} display="flex" flexDirection="column">
                <Button
                  color='secondary'
                  className='circular-btn'
                  fullWidth
                  onClick={onCreateOrder}
                  disabled={ isPosting }
                >
                  Confirmar orden
                </Button>

                <Chip
                  color="error"
                  label={ errorMessage }
                  sx={{ display: errorMessage ? 'flex': 'none', mt: 2 }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </ShopLayout>
  );
};

export default SummaryPage;
