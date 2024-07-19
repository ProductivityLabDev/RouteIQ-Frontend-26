import React from "react";
import Box from "@mui/material/Box";
import { CssBaseline, Toolbar, useMediaQuery, useTheme } from "@mui/material";
import DashboardSidebar from "../../components/dashboardSidebar/DashboardSidebar";
import DashboardHeader from "../../components/dashboardheader/DashboardHeader";
import colors from "../../utlis/Colors";

const MainLayout = ({ children }) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <CssBaseline />
      {!isSmallScreen && (
        <Box
          sx={{
            width: 400,
            height: "100%",
          }}
        >
          <DashboardSidebar />
        </Box>
      )}

      <Box
        component="main"
        sx={{
          p: 3,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          backgroundColor: colors?.whiteGrey,
        }}
      >
        <DashboardHeader />
        {children}
      </Box>
    </Box>
  );
};

export default MainLayout;
