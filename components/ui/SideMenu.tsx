import { ChangeEvent, useContext, useState } from "react";
import { useRouter } from "next/router";
import {
  Box,
  Divider,
  Drawer,
  IconButton,
  Input,
  InputAdornment,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListSubheader,
} from "@mui/material";
import SearchOutlined from "@mui/icons-material/SearchOutlined";
import AccountCircleOutlined from "@mui/icons-material/AccountCircleOutlined";
import ConfirmationNumberOutlined from "@mui/icons-material/ConfirmationNumberOutlined";
import EscalatorWarningOutlined from "@mui/icons-material/EscalatorWarningOutlined";
import FemaleOutlined from "@mui/icons-material/FemaleOutlined";
import LoginOutlined from "@mui/icons-material/LoginOutlined";
import MaleOutlined from "@mui/icons-material/MaleOutlined";
import VpnKeyOutlined from "@mui/icons-material/VpnKeyOutlined";
import CategoryOutlined from "@mui/icons-material/CategoryOutlined";
import AdminPanelSettings from "@mui/icons-material/AdminPanelSettings";
import { UIContext, AuthContext } from "../../context";
import { DashboardOutlined } from "@mui/icons-material";

export const SideMenu = () => {
  const { sidemenuOpen, sideMenuToggle } = useContext(UIContext)
  const { logOut, isLoggedIn, user } = useContext(AuthContext)

  const [searchTerm, setSearcTerm] = useState('')

  const router = useRouter()

  const onSearchTerm = () => {
    if (searchTerm.trim().length === 0) return;
    navigateTo(`/search/${searchTerm}`)
  }
  
  const navigateTo = (url: string) => {
    sideMenuToggle(false)
    router.push(url)
  }

  const logOutApp = async () => {
    await logOut()
    sideMenuToggle(false)
    router.reload()
  }

  return (
    <Drawer
      open={sidemenuOpen}
      onClose={ () => sideMenuToggle(false) }
      anchor="right"
      sx={{ backdropFilter: "blur(4px)", transition: "all 0.5s ease-out" }}
    >
      <Box sx={{ width: 250, paddingTop: 5 }}>
        <List>
          <ListItem>
            <Input
              autoFocus
              type="text"
              value={searchTerm}
              onChange={ (e: ChangeEvent<HTMLInputElement> ) => setSearcTerm(e.target.value) }
              placeholder="Buscar..."
              onKeyPress={ (e) => e.key === 'Enter' ? onSearchTerm(): null }
              endAdornment={
                <InputAdornment position="end">
                  <IconButton onClick={ onSearchTerm }>
                    <SearchOutlined/>
                  </IconButton>
                </InputAdornment>
              }
            />
          </ListItem>

          <ListItem button sx={{ display: isLoggedIn ? 'flex': 'none'}}>
            <ListItemIcon>
              <AccountCircleOutlined />
            </ListItemIcon>
            <ListItemText primary={"Perfil"} />
          </ListItem>

          <ListItem 
            button
            onClick={ () => navigateTo('/orders/history') }
            sx={{ display: isLoggedIn ? 'flex': 'none'}} 
          >
            <ListItemIcon>
              <ConfirmationNumberOutlined />
            </ListItemIcon>
            <ListItemText primary={"Mis Ordenes"} />
          </ListItem>

          <ListItem button sx={{ display: { xs: "", sm: "none" } }} onClick={ () => navigateTo('/category/men') }>
            <ListItemIcon>
              <MaleOutlined />
            </ListItemIcon>
            <ListItemText primary={"Hombres"} />
          </ListItem>

          <ListItem button sx={{ display: { xs: "", sm: "none" } }} onClick={ () => navigateTo('/category/women') }>
            <ListItemIcon>
              <FemaleOutlined />
            </ListItemIcon>
            <ListItemText primary={"Mujeres"} />
          </ListItem>

          <ListItem button sx={{ display: { xs: "", sm: "none" } }} onClick={ () => navigateTo('/category/kid') }>
            <ListItemIcon>
              <EscalatorWarningOutlined />
            </ListItemIcon>
            <ListItemText primary={"Niños"} />
          </ListItem>

          <ListItem button sx={{ display: isLoggedIn ? 'none': 'flex'}} onClick={ () => navigateTo(`/auth/login?p=${router.asPath}`) }>
            <ListItemIcon>
              <VpnKeyOutlined />
            </ListItemIcon>
            <ListItemText primary={"Ingresar"} />
          </ListItem>

          <ListItem button onClick={ logOutApp } sx={{ display: isLoggedIn ? 'flex': 'none'}}>
            <ListItemIcon>
              <LoginOutlined />
            </ListItemIcon>
            <ListItemText primary={"Salir"} />
          </ListItem>

          {/* Admin */}
          <Divider />
          <ListSubheader sx={{ display: user?.role == 'admin' ? 'flex': 'none' }}>Admin Panel</ListSubheader>

          <ListItem button 
            sx={{ display: user?.role == 'admin' ? 'flex': 'none' }}
            onClick={ () => navigateTo(`/admin/`)}
          >
            <ListItemIcon>
              <DashboardOutlined />
            </ListItemIcon>
            <ListItemText primary={"Dashboard"} />
          </ListItem>

          <ListItem button 
            sx={{ display: user?.role == 'admin' ? 'flex': 'none' }}
            onClick={ () => navigateTo(`/admin/products`)}
          >
            <ListItemIcon>
              <CategoryOutlined />
            </ListItemIcon>
            <ListItemText primary={"Productos"} />
          </ListItem>


          <ListItem button 
            sx={{ display: user?.role == 'admin' ? 'flex': 'none' }}
            onClick={ () => navigateTo(`/admin/orders`)}
          >
            <ListItemIcon>
              <ConfirmationNumberOutlined />
            </ListItemIcon>
            <ListItemText primary={"Ordenes"} />
          </ListItem>

          <ListItem button 
            sx={{ display: user?.role == 'admin' ? 'flex': 'none' }}
            onClick={ () => navigateTo(`/admin/users`)}
          >
            <ListItemIcon>
              <AdminPanelSettings />
            </ListItemIcon>
            <ListItemText primary={"Usuarios"} />
          </ListItem>
        </List>
      </Box>
    </Drawer>
  );
};
