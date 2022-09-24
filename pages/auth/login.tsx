import { Box, Button, Grid, Link, TextField, Typography } from "@mui/material"
import NextLink from 'next/link'
import { AuthLayout } from "../../components/layouts"

const LoginPage = () => {
  return (
    <AuthLayout title='Ingresar'>
      <Box sx={{ width: 650, padding: '18px 20px'}}>
        <Grid container spacing={ 4 }>
          <Grid item xs={12}>
            <Typography variant='h1' component='h1'>Iniciar sesión</Typography>
          </Grid>

          <Grid item xs={12}>
            <TextField label='Correo' variant='filled' fullWidth/>
          </Grid>
          <Grid item xs={12}>
            <TextField label='Contraseña' type='password' variant='filled' fullWidth/>
          </Grid>

          <Grid item xs={12} display='flex' justifyContent='center'>
            <Button color='secondary' className='circular-btn' size='large' >
              Ingresar
            </Button>
          </Grid>
          <Grid item xs={12} display='flex' justifyContent='end'>
            <NextLink href='/auth/register' passHref>
              <Link>
                ¿No tienes cuenta?
              </Link>
            </NextLink>
          </Grid>

        </Grid>
      </Box>
    </AuthLayout>
  )
}

export default LoginPage