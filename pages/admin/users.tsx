import React, { useEffect, useState } from 'react'
import { NextPage } from 'next';
import { AdminLayout } from '../../components/layouts'
import { PeopleOutline } from '@mui/icons-material'
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { Chip, Grid, Link, MenuItem, Select } from '@mui/material';
import NextLink from 'next/link';
import useSWR from 'swr';
import { IUser } from '../../interfaces';
import { tesloClientApi } from '../../api';


const UsersPage: NextPage = () => {

  const { data, error } = useSWR<IUser[]>('/api/admin/users')

  const [dataUsers, setDatausers] = useState<IUser[]>([])

  useEffect(() => {
    if (data) {
      setDatausers(data)
    }
  }, [data])
  
  const onRoleUpdated = async (userId: string, newRole: string) => {

    const previosUsers = dataUsers.map(user => ({ ...user }))
    const updatedUsers = dataUsers.map( user => ({
      ...user,
      role: userId === user._id ? newRole : user.role
    }))

    setDatausers(updatedUsers)

    try {
      await tesloClientApi.put('/admin/users', { userId, role: newRole })
    } catch (error) {
      console.log(error)
      console.log('No se pudo actualizar el usuario')
      setDatausers(previosUsers)
    }
  }

  if (!data && !error) return (<></>)

  const columns: GridColDef[] = [
    { field: "email", headerName: "Correo", width: 250 },
    { field: "name", headerName: "Nombre completo", width: 300 },
    { 
      field: "role",
      headerName: "Rol",
      width: 300,
      renderCell: ({ row }: GridRenderCellParams) => {
        return (
          <Select
            value={ row.role}
            label="Rol"
            sx={{ width: '300px'}}
            onChange={ (event) => onRoleUpdated(row.id, event.target.value) }
          >
            <MenuItem value="admin">Administrador</MenuItem>
            <MenuItem value="client">Cliente</MenuItem>
            <MenuItem value="super-user">Super usuario</MenuItem>
            <MenuItem value="seo">SEO</MenuItem>
          </Select>
        )
      }
    }
  ];

  const rows = dataUsers.map( user => ({
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role
  })) 

  
  return (
    <AdminLayout 
      title={ 'Usuarios' }
      subTitle={ 'Mantenimiento de usuarios'}
      icon={ <PeopleOutline />}
    >
      <Grid container sx={{ mt: 5 }}>
        <Grid item xs={12} sx={{ height: 650, width: "100%" }}>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10]}
          />
        </Grid>
      </Grid>
    </AdminLayout>
  )
}

export default UsersPage