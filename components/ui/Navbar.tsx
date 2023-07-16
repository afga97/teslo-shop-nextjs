import { ChangeEvent } from 'react'
import { useContext, useState } from "react";
import NextLink from "next/link";
import { useRouter } from 'next/router';
import {
  AppBar,
  Badge,
  Box,
  Button,
  IconButton,
  Input,
  InputAdornment,
  Link,
  Toolbar,
  Typography,
} from "@mui/material";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import ClearOutlined from '@mui/icons-material/ClearOutlined';

import { CartContext, UIContext } from "../../context";
export const Navbar = () => {

  const { push: routerPush, asPath } = useRouter();

  const { sideMenuToggle } = useContext(UIContext)
  const { cart = [] } = useContext(CartContext)


  const [searchTerm, setSearcTerm] = useState('')
  const [isSearchVisible, setisSearchVisible] = useState(false)

  const onSearchTerm = () => {
    if (searchTerm.trim().length === 0) return;
    navigateTo(`/search/${searchTerm}`)
  }
  
  const navigateTo = (url: string) => {
    routerPush(url)
  }

  const counterItems = () => {
    if (cart.length > 0) {
      if (cart.length >= 10) return `${10}+`
      return cart.length
    }
  }

  return (
    <AppBar>
      <Toolbar>
        <NextLink href="/" passHref>
          <Link underline="none" display="flex" alignItems="center">
            <Typography variant="h6">Teslo |</Typography>
            <Typography sx={{ ml: 0.5 }}>Shop</Typography>
          </Link>
        </NextLink>

        <Box flex={1} />
        <Box sx={{ display: isSearchVisible ? 'none': { xs: 'none', sm: 'block' } }} className='fadeIn'>
          <NextLink href="/category/men" passHref>
            <Link>
              <Button color={ asPath === '/category/men' || asPath === '/category' || asPath == '/' ? 'primary':'info'}>Hombres</Button>
            </Link>
          </NextLink>
          <NextLink href="/category/women" passHref>
            <Link>
              <Button color={ asPath === '/category/women' ? 'primary':'info'}>Mujeres</Button>
            </Link>
          </NextLink>
          <NextLink href="/category/kid" passHref>
            <Link>
              <Button color={ asPath === '/category/kid' ? 'primary':'info'}>Niños</Button>
            </Link>
          </NextLink>
        </Box>

        <Box flex={1} />
        
        { 
          isSearchVisible
            ? (
              <Input
                    sx={{ display: { xs: 'none', sm: 'flex' } }}
                    className='fadeIn'
                    autoFocus
                    type="text"
                    value={searchTerm}
                    onChange={ (e: ChangeEvent<HTMLInputElement> ) => setSearcTerm(e.target.value) }
                    placeholder="Buscar..."
                    onKeyPress={ (e) => e.key === 'Enter' ? onSearchTerm(): null }
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton onClick={ () => setisSearchVisible(false) }>
                          <ClearOutlined />
                        </IconButton>
                      </InputAdornment>
                    }
                  />
            )
            : (
              <IconButton 
                onClick={ () => setisSearchVisible(true) }
                sx={{ display: { xs: 'none', sm: 'flex' }}}
              >
                <SearchOutlinedIcon />
              </IconButton>
            )
        }

        {/** Pantallas pequeñas */}
        <IconButton
          sx={{ display: { xs: 'flex', sm: 'none', md: 'none', xl: 'none', fluid: 'none' }}}
          onClick={ () => sideMenuToggle(true) }
        >
          <SearchOutlinedIcon />
        </IconButton>

        <NextLink href="/cart" passHref>
          <Link>
            <IconButton>
              <Badge badgeContent={counterItems()} color="secondary">
                <ShoppingCartOutlinedIcon />
              </Badge>
            </IconButton>
          </Link>
        </NextLink>
        <Button
          onClick={ () => sideMenuToggle(true)}
        >
          Menú
        </Button>
      </Toolbar>
    </AppBar>
  );
};
