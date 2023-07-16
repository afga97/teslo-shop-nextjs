import { useState, useContext } from "react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { GetServerSideProps } from 'next'
import { useForm } from "react-hook-form";
import { Box, Button, Chip, Grid, Link, TextField, Typography } from "@mui/material";
import ErrorOutline from "@mui/icons-material/ErrorOutline";
import { AuthLayout } from "../../components/layouts";
import { validations } from "../../utils";
import { AuthContext } from "../../context";
import { getSession, signIn } from "next-auth/react";

type FormData = {
  name: string;
  email: string;
  password: string;
};

const RegisterPage = () => {
  
  const router = useRouter()
  const { registerUser } = useContext(AuthContext)
  const [showError, setShowError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')


  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();


  const onRegisterForm = async (data: FormData) => {
    const { name, email, password } = data;
    setShowError(false)
    setErrorMessage('')
    const { hasError, message } = await registerUser(email, name, password);
    if  (hasError) {
      setShowError(true)
      setErrorMessage( message! )
      setTimeout(() => setShowError(false), 3000);
      return;
    }

    // const destination = router.query.p?.toString() || '/'
    // router.replace(destination)

    await signIn('credentials', { email, password })
    
  }

  return (
    <AuthLayout title="Registrate">
      <form onSubmit={ handleSubmit(onRegisterForm) }>
        <Box sx={{ width: 650, padding: "18px 20px" }}>
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <Typography variant="h1" component="h1">
                Crear cuenta
              </Typography>
              <Chip 
                label={ errorMessage || `Ocurrio un error al registrar el usuario`}
                color='error'
                icon={ <ErrorOutline /> }
                className='fadeIn'
                sx={{ display: showError ? 'flex': 'none' }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Nombre"
                variant="filled"
                fullWidth
                {...register("name", {
                  required: "Este campo es requerido",
                  minLength: { value: 3, message: "Minimo 3 caracteres o más" },
                })}
                error={!!errors.name}
                helperText={errors.name?.message}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Correo"
                variant="filled"
                fullWidth
                {...register("email", {
                  required: "Este campo es requerido",
                  validate: (val) => validations.isEmail(val),
                })}
                error={!!errors.email}
                helperText={errors?.email?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Contraseña"
                type="password"
                variant="filled"
                fullWidth
                {...register("password", {
                  required: "Este campo es requerido",
                  minLength: { value: 6, message: "Minimo 6 caracteres" },
                })}
                error={!!errors.password}
                helperText={errors?.password?.message}
              />
            </Grid>

            <Grid item xs={12} display="flex" justifyContent="center">
              <Button type='submit' color="secondary" className="circular-btn" size="large">
                Registrate
              </Button>
            </Grid>

            <Grid item xs={12} display="flex" justifyContent="end">
              <NextLink href="/auth/login" passHref>
                <Link>¿Ya tienes cuenta?</Link>
              </NextLink>
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

export default RegisterPage;
