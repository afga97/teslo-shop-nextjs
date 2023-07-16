import React, { useEffect, useState } from "react";
import { AdminLayout } from "../../components/layouts";
import { Grid, Typography } from "@mui/material";
import { AccessTimeOutlined, AttachMoneyOutlined, CancelPresentationOutlined, CategoryOutlined, CreditCardOffOutlined, DashboardOutlined, GroupOutlined, ProductionQuantityLimitsOutlined } from "@mui/icons-material";
import { SummaryTitle } from "../../components/admin";
import useSWR from "swr";
import { DashboardSummaryResponse } from "../../interfaces";

const DashboardPage = () => {

  const { data, error } = useSWR<DashboardSummaryResponse>('/api/admin/dashboard', {
    refreshInterval: 30 * 1000 // 30 segundos
  })

  const [refreshIn, setRefreshIn] = useState(30);

  useEffect(() => {
    const interval = setInterval( () => {
      setRefreshIn( refreshIn => refreshIn > 0 ? refreshIn - 1 : 30)
    }, 1000)
  
    return () => clearInterval(interval)
  }, [])
  

  if (!error && !data) {
    return <></>
  }

  if (error) {
    console.log(error)
    return <Typography>Error al cargar la información</Typography>
  }

  const { 
    numberOfOrders,
    paidOrders,
    notPaidOrders, 
    numberOfClients,
    numberOfProducts,
    productsWithNoInventory,
    lowInventory
  } = data!; 

  return (
    <AdminLayout
      title="Dashboard"
      subTitle="Estadisticas generales"
      icon={<DashboardOutlined />}
    >
      <Grid container spacing={2}>
        <SummaryTitle
          subTitle="Ordenes totales"
          title={ numberOfOrders}
          icon={<CreditCardOffOutlined color="primary" sx={{ fontSize: 40 }} />}
        />

        <SummaryTitle
          subTitle="Ordenes pagadas"
          title={ paidOrders }
          icon={<AttachMoneyOutlined color="primary" sx={{ fontSize: 40 }} />}
        />

        <SummaryTitle
          subTitle="Ordenes pendientes"
          title={ notPaidOrders }
          icon={<CreditCardOffOutlined color="error" sx={{ fontSize: 40 }} />}
        />

        <SummaryTitle
          subTitle="Clientes"
          title={ numberOfClients }
          icon={<GroupOutlined color="primary" sx={{ fontSize: 40 }} />}
        />

        <SummaryTitle
          subTitle="Productos"
          title={ numberOfProducts }
          icon={<CategoryOutlined color="warning" sx={{ fontSize: 40 }} />}
        />

        <SummaryTitle
          subTitle="Sin existencias"
          title={ productsWithNoInventory }
          icon={<CancelPresentationOutlined color="error" sx={{ fontSize: 40 }} />}
        />

        <SummaryTitle
          subTitle="Bajo inventario"
          title={ lowInventory }
          icon={<ProductionQuantityLimitsOutlined color="warning" sx={{ fontSize: 40 }} />}
        />

        <SummaryTitle
          subTitle="Actualizacion en: "
          title={ refreshIn }
          icon={<AccessTimeOutlined color="secondary" sx={{ fontSize: 40 }} />}
        />
      </Grid>
    </AdminLayout>
  );
};

export default DashboardPage;
