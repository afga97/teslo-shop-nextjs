import { FormControl, Grid, Select, MenuItem, TextField, Typography, Box, Button } from "@mui/material"
import { ShopLayout } from "../../components/layouts"

const AddressPage = () => {
  return (
    <ShopLayout title='Dirección' pageDescription='Confirmar dirección del destino'>
      <Typography variant='h1' component='h1'>Dirección</Typography>
      <Grid container spacing={2} sx={{ mt: 2 }}>
        
        <Grid item xs={12} sm={6}>
          <TextField label='Nombre' variant='filled' fullWidth />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField label='Apellido' variant='filled' fullWidth />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField label='Dirección' variant='filled' fullWidth />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField label='Dirección 2 (opcional)' variant='filled' fullWidth />
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <Select
              variant='filled'
              label='País'
              value={1}
            >
              <MenuItem value={1}>Colombia</MenuItem>
              <MenuItem value={2}>Argentina</MenuItem>
              <MenuItem value={3}>Chile</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField label='Teléfono' variant='filled' fullWidth />
        </Grid>

      </Grid>

      <Box display='flex' alignItems='center' justifyContent='center' sx={{ mt: 6 }}>
        <Button color='secondary' className="circular-btn" size='large'>
          Revisar pedido
        </Button>
      </Box>
    </ShopLayout>
  )
}

export default AddressPage