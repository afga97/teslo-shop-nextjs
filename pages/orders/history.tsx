import { Chip, Grid, Link, Typography } from "@mui/material";
import NextLink from "next/link";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { ShopLayout } from "../../components/layouts";

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 100 },
  { field: "fullname", headerName: "Nombre completo", width: 300 },
  {
    field: "paid",
    headerName: "Pagado",
    width: 200,
    description: "Muestra información si esta pagada la orden o no",
    renderCell: (params: GridRenderCellParams) => {
      return params.row.paid ? (
        <Chip color="success" label="Pagada" variant="outlined" />
      ) : (
        <Chip color="error" label="No pagada" variant="outlined" />
      );
    },
  },
  {
    field: "order",
    headerName: "Orden",
    width: 200,
    description: "Ver la orden",
    sortable: false,
    renderCell: (params: GridRenderCellParams) => {
      return (
        <NextLink href={`/orders/${params.row.id}`} passHref>
          <Link underline='always'>
            Ver orden
          </Link>
        </NextLink>
      );
    },
  },
];

const rows = [
  { id: 1, paid: true, fullname: "Andres Giraldo", order: 1 },
  { id: 2, paid: true, fullname: "Prueba 1", order: 1 },
  { id: 3, paid: true, fullname: "Prueba 2", order: 1 },
  { id: 4, paid: false, fullname: "Prueba 3", order: 1 },
  { id: 5, paid: true, fullname: "Prueba 4", order: 1 },
  { id: 6, paid: true, fullname: "Prueba 5", order: 1 },
  { id: 7, paid: false, fullname: "Prueba 6", order: 1 },
  { id: 8, paid: true, fullname: "Prueba 7", order: 1 },
  { id: 9, paid: true, fullname: "Prueba 8", order: 1 },
  { id: 11, paid: true, fullname: "Prueba 10", order: 1 },
];

const HistroyPage = () => {
  return (
    <ShopLayout
      title="Historial de ordenes"
      pageDescription="Historial de ordenes del cliente"
    >
      <Typography variant="h1" component="h1">
        Historial de ordenes
      </Typography>
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
    </ShopLayout>
  );
};

export default HistroyPage;
