import React from 'react'
import { dbOrders } from '../../../database';
import { GetServerSideProps, NextPage } from 'next';
import { CreditScoreOutlined, CreditCardOffOutlined, ConfirmationNumberOutlined } from '@mui/icons-material';
import { Typography, Grid, Card, CardContent, Box, Divider, Chip } from '@mui/material';
import { CartList, OrdenSummary } from '../../../components/cart';
import { AdminLayout } from '../../../components/layouts';
import { IOrder } from '../../../interfaces';

interface Props {
  order: IOrder;
  id: string;
}
const DetailOrderPage: NextPage<Props>  = ({ order }) => {

  const { shippingAddress } = order;

  return (
    <AdminLayout
      title="Resumen de la orden"
      subTitle={ `Orden ${order._id}` }
      icon={ <ConfirmationNumberOutlined />}
    > 
      <Grid container sx={{ mt: 2 }}>
        <Grid item xs={12} sm={7}>
          <CartList products={ order.orderItems }/>
        </Grid>
        <Grid item xs={12} sm={5}>
          <Card className="summary-card">
            <CardContent>
              <Typography variant="h2">Resumen ({ order.numberOfItems } productos )</Typography>

              <Box display="flex" justifyContent="space-between">
                <Typography variant="subtitle1">
                  Dirección de entrega
                </Typography>
              </Box>

              <Typography>{ shippingAddress.firstName } { shippingAddress.lastName }</Typography>
              <Typography>{ shippingAddress.address } { shippingAddress.address2 }</Typography>
              <Typography>{ shippingAddress.city } { shippingAddress.zip }</Typography>
              <Typography> { shippingAddress.country } </Typography> 
              <Typography> { shippingAddress.phone }</Typography>

              <Divider sx={{ my: 1 }} />

              <OrdenSummary cartOrder={order.orderItems} />
              <Box sx={{ mt: 3 }} display="flex" flexDirection="column">
                <Box display={ 'flex'} justifyContent={ 'center'}>
                {
                  order.isPaid
                  ? (<Chip
                      sx={{ my: 2 }}
                      label="Orden pagada"
                      variant="outlined"
                      color="success"
                      icon={<CreditScoreOutlined />}
                    />)
                  :
                  (<Chip
                      sx={{ my: 2 }}
                      label='Pendiente de pago'
                      variant='outlined'
                      color='error'
                      icon={ <CreditCardOffOutlined />}
                  />)
                }
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </AdminLayout>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {
  const { id = '' } = query;

  const order = await dbOrders.getOrderById(id.toString())

  if (!order) {
    return {
      redirect: {
        destination: '/admin/orders/',
        permanent: false
      }
    }
  }

  return {
    props: {
      id,
      order
    }
  }
}

export default DetailOrderPage