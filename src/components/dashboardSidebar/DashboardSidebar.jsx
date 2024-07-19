import React, { useState } from "react";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import colors from "../../utlis/Colors";
import LoginHeader from "../loginHeader/LoginHeader";
import { Grid, useMediaQuery } from "@mui/material";
import assets from "../../utlis/assets";

const DashboardSidebar = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));

  const handleListItemClick = (index, path) => {
    setActiveIndex(index);
    // navigate(path);
  };

  const menuItems = [
    {
      text: "Dashboard",
      imageUrl: assets?.gridWeb,
      activeImageUrl: assets?.dashboard,
      path: "/dashboard",
    },
    {
      text: "Vehicle Management",
      imageUrl: assets?.Vehicle,
      activeImageUrl: assets?.vechileWhite,
      path: "/vehicle-management",
    },
    {
      text: "Driver Management",
      imageUrl: assets?.driverMangement,
      activeImageUrl: assets?.driverManagementWhite,
      path: "/driver-management",
    },
    {
      text: "School Management",
      imageUrl: assets?.schoolMangement,
      activeImageUrl: assets?.schoolManagementWhite,
      path: "/school-management",
    },
    {
      text: "Students Management",
      imageUrl: assets?.usersGroup,
      activeImageUrl: assets?.usresGroupWhite,
      path: "/students-management",
    },
    {
      text: "Route Management",
      imageUrl: assets?.routeMangement,
      activeImageUrl: assets?.routeManagementWhite,
      path: "/route-management",
    },
    {
      text: "Scheduling",
      imageUrl: assets?.calendar,
      activeImageUrl: assets?.calendarWhite,
      path: "/scheduling",
    },
    {
      text: "Billing & Invoice",
      imageUrl: assets?.billing,
      activeImageUrl: assets?.billingWhite,
      path: "/billing-invoice",
    },
  ];

  return (
    <Box
      sx={{
        width: isSmallScreen ? "100%" : 350,
        padding: 2,
        height: "100vh",
        backgroundColor: colors?.whiteColor,
      }}
      role="presentation"
    >
      <LoginHeader />
      <List>
        {menuItems.map((item, index) => (
          <ListItem key={item?.text} disablePadding sx={{ gap: 2 }}>
            <Grid
              className="grid-element"
              sx={{
                backgroundColor:
                  activeIndex === index ? colors?.redColor : "inherit",
                display: "flex",
                width: 5,
                height: 45,
                marginBottom: 2,
              }}
            />
            <ListItemButton
              sx={{
                paddingLeft: "20px",
                "&:hover": {
                  backgroundColor: "transparent",
                  borderRadius: 2,
                  "& .grid-element": {
                    backgroundColor: colors?.redColor,
                  },
                },
                backgroundColor:
                  activeIndex === index ? colors?.redColor : "inherit",
                color: activeIndex === index ? colors?.whiteColor : "inherit",
                borderRadius: 2,
                "& .grid-element": {
                  backgroundColor:
                    activeIndex === index ? colors?.redColor : "inherit",
                },

                marginBottom: 2,
              }}
              onClick={() => handleListItemClick(index, item.path)}
            >
              <img
                src={
                  activeIndex === index ? item?.activeImageUrl : item?.imageUrl
                }
                alt={item?.text}
                style={{
                  marginRight: 8,
                  width: 24,
                  height: 24,
                  transition: "0.3s ease",
                }}
              />

              <ListItemText primary={item?.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default DashboardSidebar;
