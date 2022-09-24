import NextLink from 'next/link';
import { Box, Button, Grid, Link, TextField, Typography } from "@mui/material"
import { AuthLayout } from "../../components/layouts"

const RegisterPage = () => {
  return (
    <AuthLayout title='Registrate'>
      <Box sx={{ width: 650, padding: '18px 20px'}}>
        <Grid container spacing={ 4 }>
          <Grid item xs={12}>
            <Typography variant='h1' component='h1'>Crear cuenta</Typography>
          </Grid>

          <Grid item xs={12}>
            <TextField label='Nombre' variant='filled' fullWidth/>
          </Grid>

          <Grid item xs={12}>
            <TextField label='Correo' variant='filled' fullWidth/>
          </Grid>
          <Grid item xs={12}>
            <TextField label='Contraseña' type='password' variant='filled' fullWidth/>
          </Grid>

          <Grid item xs={12} display='flex' justifyContent='center'>
            <Button color='secondary' className='circular-btn' size='large' >
              Registrate
            </Button>
          </Grid>

          <Grid item xs={12} display='flex' justifyContent='end'>
            <NextLink href='/auth/login' passHref>
              <Link>
                ¿Ya tienes cuenta?
              </Link>
            </NextLink>
          </Grid>

        </Grid>
      </Box>
    </AuthLayout>
  )
}

export default RegisterPage