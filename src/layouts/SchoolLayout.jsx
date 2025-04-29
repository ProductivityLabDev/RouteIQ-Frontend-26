import React from "react";
import Box from "@mui/material/Box";
import { CssBaseline, Toolbar, useMediaQuery, useTheme } from "@mui/material";
import DashboardSidebar from "@/components/schoolDashboardSidebar/SchoolDashboardSidebar";
import colors from "@/utlis/Colors";
import { DashboardNavbar } from "@/widgets/layout";
// import colors from "../../utlis/Colors";

const MainLayout = ({ children }) => {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
    const userRole = 'vendor'

    return (
        <Box sx={{ display: "flex", height: "100vh",  }}>
            <CssBaseline />
            {!isSmallScreen && (
                <Box
                    sx={{
                        width: 400,
                        height: "100%",
                        marginRight: "20px",
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
                    justifyContent: "flex-start",
                    alignItems: "center",
                    width: "100%",
                    backgroundColor: colors?.peachColor,
                    overflowX: 'auto',
                }}
            >
                <DashboardNavbar user={userRole} />
                {children}
            </Box>
        </Box>
    );
};

export default MainLayout;
