import React from "react";
import colors from "../../utlis/Colors";
import MainLayout from "../layout/MainLayout";
import { Box, Grid } from "@mui/material";
import CustomCardComponent from "../../components/customDashboardCard/CustomCardComponent";
import assets from "../../utlis/assets";
import LineChartComponent from "../../components/charts/LineChart";
import CustomPieChart from "../../components/charts/PieChart";

const Dashboard = () => {
  return (
    <MainLayout>
      <div style={{ width: "100%", height: "100vh", marginTop: 12 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <CustomCardComponent
              title="New Net Income"
              icon={assets?.cardDollar}
              value="£8,245.00"
              change="-0.5%"
              changeText="from last week"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <CustomCardComponent
              title="Total Bookings"
              icon={assets?.cardShopping}
              value="256"
              change="+1.0%"
              changeText="from last week"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <CustomCardComponent
              title="Resolved Issues"
              icon={assets?.cardTag}
              value="1,256"
              change="+1.0%"
              changeText="from last week"
            />
          </Grid>
          <Grid
            item
            xs={12}
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: "row",
              gap: 4,
            }}
          >
            <LineChartComponent />
            <CustomPieChart />
          </Grid>
        </Grid>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
