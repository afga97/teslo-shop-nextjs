import { useState, useContext, useEffect } from "react";
import { GetServerSideProps } from 'next'
import NextLink from "next/link";
import { useRouter } from "next/router";
import { getSession, signIn, getProviders } from "next-auth/react";
import { Box, Button, Chip, Divider, Grid, Link, TextField, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { AuthLayout } from "../../components/layouts";
import { validations } from "../../utils";
import ErrorOutline from "@mui/icons-material/ErrorOutline";
import { AuthContext } from "../../context";

type FormData = {
  email: string;
  password: string;
};

const LoginPage = () => {

  const router = useRouter()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  const { loginUser } = useContext(AuthContext)
  
  const [showError, setShowError] = useState(false)
  const [providers, setProviders] = useState<any>({})

  useEffect(() => {
    getProviders().then( prov => {
      setProviders(prov)
    })
  }, [])
  


  const onLoginUser = async ({ email, password }: FormData) => {
    // const { email, password } = data;
    // setShowError(false)
    // const isValidLogin = await loginUser(email, password);
    // if  (!isValidLogin) {
    //   setShowError(true)
    //   setTimeout(() => setShowError(false), 3000);
    //   return
    // }

    // const destination = router.query.p?.toString() || '/'
    // router.replace(destination)
    await signIn('credentials', { email, password })
  }

  // const onRegister = () => {
  //   const direction = `/auth/register${router.query.p ? '?p='+router.query.p.toString() : ''}`
  //   router.replace(direction)
  // }

  return (
    <AuthLayout title="Ingresar">
      <form onSubmit={ handleSubmit(onLoginUser) }>
        <Box sx={{ width: 650, padding: "18px 20px" }}>
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <Typography variant="h1" component="h1">
                Iniciar sesión
              </Typography>
              <Chip 
                label='Usuario o contraseña incorrectos'
                color='error'
                icon={ <ErrorOutline /> }
                className='fadeIn'
                sx={{ display: showError ? 'flex': 'none' }}
              />
            </Grid>


            <Grid item xs={12}>
              <TextField
                type="email"
                label="Correo"
                variant="filled"
                fullWidth
                {
                  ...register('email', {
                    required: 'Este campo es requerido',
                    validate: (val) => validations.isEmail(val)
                  })
                }
                error={ !!errors.email }
                helperText={ errors.email?.message }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Contraseña"
                type="password"
                variant="filled"
                fullWidth
                {
                  ...register('password', {
                    required: 'Este campo es requerido',
                    minLength: { value: 6, message: 'Minimo 6 caracteres'}
                  })
                }
                error={ !!errors.password }
                helperText={ errors.password?.message }
              />
            </Grid>

            <Grid item xs={12} display="flex" justifyContent="center">
              <Button type="submit" color="secondary" className="circular-btn" size="large">
                Ingresar
              </Button>
            </Grid>
            <Grid item xs={12} display="flex" justifyContent="end">
              <NextLink href={`/auth/register${router.query.p ? '?p='+router.query.p : ''}`} passHref>
                <Link>¿No tienes cuenta?</Link>
              </NextLink>
            </Grid>

            <Grid item xs={12} display="flex" flexDirection="column" justifyContent="end">
              <Divider sx={{ width: '100%', mb: 2}} />
              {
                Object.values(providers).map( (provider: any) => {

                  if ( provider.id == 'credentials') return (<div key="credentials"></div>)

                  return (
                    <Button
                      key={ provider.id}
                      variant="outlined"
                      fullWidth
                      color="primary"
                      sx={{ mb: 1 }}
                      onClick={ () => signIn(provider.id) }
                    >
                      { provider.name }
                    </Button>
                  )
                })
              }
            </Grid>

          </Grid>
        </Box>
      </form>
    </AuthLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {
  const session = await  getSession({ req })

  const { p = '/'} = query;

  if (session) {
    return {
      redirect: {
        destination: p.toString(),
        permanent: false
      }
    }
  }

  return {
    props: {
      
    }
  }
}

export default LoginPage;
