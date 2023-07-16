import React from 'react'
import { NextPage } from 'next'
import { AdminLayout } from '../../../components/layouts'
import { ConfirmationNumberOutlined } from '@mui/icons-material'
import { Chip, Grid } from '@mui/material'
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import useSWR from 'swr'
import { IOrder, IUser } from '../../../interfaces'

const columns: GridColDef[] = [
  { field: "id", headerName: "Orden ID", width: 250 },
  { field: "email", headerName: "Correo", width: 250 },
  { field: "name", headerName: "Nombre Completo", width: 300 },
  { field: "total", headerName: "Monto total", width: 300 },
  { 
    field: "isPaid",
    headerName: "Pagada",
    width: 300,
    renderCell: ({ row }: GridRenderCellParams) => {
      return row.isPais 
        ? (<Chip variant='outlined' label='Pagada' color="success"/>) 
        : (<Chip variant='outlined' label='Pagada' color="error"/>) 
    }
  },
  { field: "inStock", headerName: "No.Productos", align: 'center' },
  { field: "createdAt", headerName: "Creada en", width: 300 },
  { 
    field: "check",
    headerName: "Ver orden",
    width: 300,
    renderCell: ({ row }: GridRenderCellParams) => {
      return (
        <a href={ `/admin/orders/${row.id}`} target="_blank" rel="noreferrer">
          Ver orden
        </a>
      )
    }
  },
];


const OrdersPage: NextPage = () => {

  const { data, error } = useSWR<IOrder[]>(`/api/admin/orders`)

  if (!data && !error) return (<></>)

  const rows = data!.map(order => ({
    id: order._id,
    email: (order.user as IUser).email,
    name: (order.user as IUser).name,
    total: order.total,
    isPaid: order.isPaid,
    noProducts: order.numberOfItems,
    createdAt: order.createdAt,
    inStock: order.numberOfItems
  }))

  return (
    <AdminLayout
      title={'Ordenes'}
      subTitle={'Listado de ordenes'}
      icon={ <ConfirmationNumberOutlined />}
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

export default OrdersPage