import { useState } from 'react';
import { GetServerSideProps, NextPage } from 'next'
import {
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  Typography,
} from "@mui/material";
import { PayPalButtons } from "@paypal/react-paypal-js";
import CreditCardOffOutlined from "@mui/icons-material/CreditCardOffOutlined";
import CreditScoreOutlined from "@mui/icons-material/CreditScoreOutlined";
import { CartList, OrdenSummary } from "../../components/cart";
import { ShopLayout } from "../../components/layouts";
import { getSession } from 'next-auth/react';
import { dbOrders } from '../../database';
import { IOrder } from '../../interfaces';
import { tesloClientApi } from '../../api';
import { useRouter } from 'next/router';

interface Props {
  order: IOrder;
  id: string;
}

type OrderResponseBody = {
  id: string;
  status:
    | "COMPLETED"
    | "SAVED"
    | "APPROVED"
    | "VOIDED"
    | "PAYER_ACTION_REQUIRED";
}

const OrderPage: NextPage<Props> = ({ order }) => {

  const router = useRouter()
  const { shippingAddress } = order;
  const [isPaying, setIsPaying] = useState(false)

  const onOrderCompleted = async (details: OrderResponseBody) => {
    if(details.status !== 'COMPLETED'){
      return alert("No hay pago en paypal")
    }
    setIsPaying(true)

    try {
      await tesloClientApi.post(`/orders/pay`, {
        transactionId: details.id,
        orderId: order._id
      });
      router.reload();
    } catch (error) {
      setIsPaying(false)
      console.log(error)
    }
  }

  return (
    <ShopLayout
      title="Resumen de la orden 1221212"
      pageDescription="Resumen de la orden"
    >
      <Typography variant="h1" component="h1">
        Orden: { order._id }
      </Typography>

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

      <Grid container>
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


                <Box display='flex'
                  justifyContent='center'
                  className='fadeIn'
                  sx={{ display: isPaying ? 'flex': 'none' }}
                >
                  <CircularProgress />
                </Box>
                <Box sx={{ display: isPaying ? 'none': 'flex', flex: 1 }} flexDirection="column">
                  { order.isPaid 
                    ? (<Chip
                        sx={{ my: 2 }}
                        label="Orden pagada"
                        variant="outlined"
                        color="success"
                        icon={<CreditScoreOutlined />}
                    />)
                    : <PayPalButtons
                        createOrder={(data, actions) => {
                          console.log(order.total)
                          return actions.order.create({
                              purchase_units: [
                                  {
                                      amount: {
                                          value: `${order.total}`,
                                      },
                                  },
                              ],
                          });
                        }}
                        onApprove={(data, actions) => {
                            return actions.order!.capture().then((details) => {
                              onOrderCompleted(details);
                            });
                        }}
                    />
                  }
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </ShopLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {
  const { id = '' } = query;

  const session: any = await getSession({ req });

  if (!session) {
    return {
      redirect: {
        destination: `auth/login?p=/orders/${id}`,
        permanent: false
      }
    }
  }

  const order = await dbOrders.getOrderById(id.toString())

  if (!order) {
    return {
      redirect: {
        destination: '/orders/history',
        permanent: false
      }
    }
  }

  if (order.user !== session.user.id) {
    return {
      redirect: {
        destination: '/orders/history',
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

export default OrderPage;
