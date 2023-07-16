import { useContext, useEffect } from 'react'
import { GetServerSideProps } from "next";
import {
  FormControl,
  Grid,
  Select,
  MenuItem,
  TextField,
  Typography,
  Box,
  Button,
  FormHelperText,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import { ShopLayout } from "../../components/layouts";
import { jwt, countries } from "../../utils";
import { CartContext } from "../../context";

type FormData = {
  address: string;
  address2?: string;
  city: string;
  country: string;
  firstName: string;
  lastName: string;
  phone: string;
  zip: string;
};

const getAddresFromCookies = (): FormData => {
  return {
    address: Cookies.get('address') || '', 
    address2 : Cookies.get('address2') || '',
    city: Cookies.get('city') || '',
    country: Cookies.get('country') || '',
    firstName: Cookies.get('firstName') || '',
    lastName: Cookies.get('lastName') || '',
    phone: Cookies.get('phone') || '',
    zip: Cookies.get('zip') || ''
  }
}

const AddressPage = () => {

  const { updateAddress } = useContext(CartContext)

  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<FormData>({
    defaultValues: {
      'address': '',
      'address2': '',
      'city': '',
      'country': countries[0].code,
      'firstName': '',
      'lastName': '',
      'phone': '',
      'zip': ''
    }
  });

  useEffect(() => {
    reset(getAddresFromCookies() );
  }, [reset])
  

  const onRegisterAddress = async (data: FormData) => {
    await updateAddress(data)
    router.push('/checkout/summary')
  }

  return (
    <ShopLayout
      title="Dirección"
      pageDescription="Confirmar dirección del destino"
    >
      <Typography variant="h1" component="h1">
        Dirección
      </Typography>
      <form onSubmit={ handleSubmit(onRegisterAddress) }>
        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Nombre"
              variant="filled"
              fullWidth
              {...register("firstName", {
                required: "Este campo es requerido",
              })}
              error={!!errors.firstName}
              helperText={errors.firstName?.message}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Apellido"
              variant="filled"
              fullWidth
              {...register("lastName", {
                required: "Este campo es requerido",
              })}
              error={!!errors.lastName}
              helperText={errors.lastName?.message}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Dirección"
              variant="filled"
              fullWidth
              {...register("address", {
                required: "Este campo es requerido",
              })}
              error={!!errors.address}
              helperText={errors.address?.message}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Dirección 2 (opcional)"
              variant="filled"
              fullWidth
              {...register("address2", {
                required: false,
              })}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Código postal"
              variant="filled"
              fullWidth
              {...register("zip", {
                required: "Este campo es requerido",
              })}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Ciudad"
              variant="filled"
              fullWidth
              {...register("city", {
                required: "Este campo es requerido",
              })}
            />
          </Grid>

          <Grid item xs={12} sm={ 6 }>
            {/* <FormControl fullWidth> */}
                <TextField
                    // select
                    variant="filled"
                    label="País"
                    fullWidth
                     // defaultValue={ Cookies.get('country') || countries[0].code }
                    { ...register('country', {
                        required: 'Este campo es requerido'
                    })}
                    error={ !!errors.country }
                    helperText={ errors.country?.message }
                />
                    {/* {
                        countries.map( country => (
                            <MenuItem 
                                key={ country.code }
                                value={ country.code }
                            >{ country.name }</MenuItem>
                        ))
                    }
                </TextField> */}
            {/* </FormControl> */}
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Teléfono"
              variant="filled"
              fullWidth
              {...register("phone", {
                required: "Este campo es requerido",
              })}
              error={!!errors.phone}
              helperText={errors.phone?.message}
            />
          </Grid>
        </Grid>

        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          sx={{ mt: 6 }}
        >
          <Button
            type="submit"
            color="secondary"
            className="circular-btn"
            size="large"
          >
            Revisar pedido
          </Button>
        </Box>
      </form>
    </ShopLayout>
  );
};

// export const getServerSideProps: GetServerSideProps = async ({ req, params }) => {

//   const { token = '' } = req.cookies;
//   let isValidToken = false;

//   try {
//     await jwt.isValidToken(token);
//     isValidToken = true
//   } catch (error) {
//     isValidToken = false
//   }

//   if (!isValidToken) {
//     return {
//       redirect: {
//         destination: 'auth/login?p=/chechout/address',
//         permanent: false
//       }
//     }
//   }

//   return {
//     props: {

//     }
//   }
// }

export default AddressPage;
