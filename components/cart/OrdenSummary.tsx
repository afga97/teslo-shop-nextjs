import { FC, useContext } from "react"
import { Grid, Typography } from "@mui/material"
import { CartContext } from "../../context"
import { currency } from "../../utils"
import { IOrderItem } from "../../interfaces"

interface Props {
  cartOrder ?: IOrderItem[]
}

export const OrdenSummary: FC<Props> = ({ cartOrder = [] }) => {

  const { cart = [] } = useContext(CartContext)

  const itemsShowCart: any = cartOrder.length > 0 ? cartOrder : cart

  const calculateSubtotal = () => {
    return itemsShowCart.reduce((acum: any, currentVal: any) => acum + (currentVal.price * currentVal.quantity), 0);
  }

  const calculateTaxes = () => {
    return (calculateSubtotal() * Number(process.env.NEXT_PUBLIC_TAX_RATE || 0))
  }

  return (
    <Grid container>
      <Grid item xs={6}>
        <Typography>No. Productos</Typography>
      </Grid>
      <Grid item xs={6} display='flex' justifyContent='end'>
        <Typography>{ itemsShowCart.length }</Typography>
      </Grid>

      <Grid item xs={6}>
        <Typography>Subtotal</Typography>
      </Grid>
      <Grid item xs={6} display='flex' justifyContent='end'>
        <Typography>{ currency.formatMoneyCurrency(calculateSubtotal()) }</Typography>
      </Grid>

      <Grid item xs={6}>
        <Typography>Impuestos (15%)</Typography>
      </Grid>
      <Grid item xs={6} display='flex' justifyContent='end'>
        <Typography>{ currency.formatMoneyCurrency(calculateTaxes()) }</Typography>
      </Grid>

      <Grid item xs={6} sx={{ mt: 2 }}>
        <Typography variant='subtitle1'>Total</Typography>
      </Grid>
      <Grid item sx={{ mt: 2 }} xs={6} display='flex' justifyContent='end'>
        <Typography variant='subtitle1'>{ currency.formatMoneyCurrency(calculateSubtotal() + calculateTaxes()) }</Typography>
      </Grid>
    </Grid>
  )
}
