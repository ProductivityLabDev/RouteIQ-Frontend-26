import React from "react";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import colors from "../../utlis/Colors";
import LoginHeader from "../loginHeader/LoginHeader";

const DashboardSidebar = () => {
  return (
    <Box
      sx={{
        width: 300,
        padding: 2,
        height: "100vh",
        backgroundColor: colors?.whiteColor,
      }}
      role="presentation"
    >
      <LoginHeader />
      <List>
        {[
          "Dashboard",
          "Vehicle Management",
          "Driver Management",
          "School Management",
          "Students Management",
          "Route Management",
          "Scheduling",
          "Billing & Invoice",
        ].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton
              sx={{
                "&:hover": {
                  backgroundColor: colors?.redColor,
                  color: colors?.whiteColor,
                  //   borderLeft: 2,
                  //   borderColor: "#000",
                  borderRadius: 2,
                },
                // "&::before": {
                //   content: '""',
                //   position: "absolute",
                //   top: 0,
                //   left: 0,
                //   height: "100%",
                //   width: "5px",
                //   backgroundColor: colors.redColor,
                // },
              }}
            >
              {/* <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon> */}
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default DashboardSidebar;
