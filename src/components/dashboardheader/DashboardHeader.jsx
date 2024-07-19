import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Badge,
  Box,
} from "@mui/material";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MenuIcon from "@mui/icons-material/Menu";
import { useState } from "react";
import assets from "../../utlis/assets";
import InputField from "../textField/TextField";

const DashboardHeader = ({ onMenuClick }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationsAnchorEl, setNotificationsAnchorEl] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNotificationsMenuOpen = (event) => {
    setNotificationsAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationsMenuClose = () => {
    setNotificationsAnchorEl(null);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <AppBar
      position="static"
      sx={{ backgroundColor: "transparent", boxShadow: "none" }}
    >
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
          onClick={onMenuClick}
        >
          {/* <MenuIcon /> */}
        </IconButton>
        <Box sx={{ flexGrow: 1 }}>
          <InputField
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={handleSearchChange}
            isSearch={true}
            sx={{ border: 1, borderStyle: "solid", borderColor: "#DCDCDC" }}
          />
        </Box>
        <IconButton
          size="large"
          aria-label="show new notifications"
          color="inherit"
          sx={{
            backgroundColor: "transparent",
            "&:hover": {
              backgroundColor: "transparent",
            },
          }}
        >
          {/* <Badge badgeContent={2} color="error"> */}
          <img src={assets?.messagesIcon} style={{ width: 30, height: 30 }} />
          {/* </Badge> */}
        </IconButton>
        <IconButton
          size="large"
          aria-label="show new notifications"
          color="inherit"
          onClick={handleNotificationsMenuOpen}
          sx={{
            backgroundColor: "transparent",
            "&:hover": {
              backgroundColor: "transparent",
            },
          }}
        >
          {/* <Badge badgeContent={2} color="error"> */}
          <img src={assets?.notification} style={{ width: 30, height: 30 }} />
          {/* </Badge> */}
        </IconButton>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            gap: 8,
            width: "17%",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              flexDirection: "row",
              gap: 1,
            }}
          >
            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              color="inherit"
              sx={{
                backgroundColor: "transparent",
                "&:hover": {
                  backgroundColor: "transparent",
                },
              }}
            >
              <img src={assets?.avatar} />
            </IconButton>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
              }}
            >
              <Typography
                sx={{
                  fontSize: "0.875rem",
                  fontWeight: 700,
                  fontFamily: "Nunito Sans",
                  color: "#404040",
                }}
              >
                Moni Roy
              </Typography>
              <Typography
                sx={{
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  fontFamily: "Nunito Sans",
                  color: "#565656",
                }}
              >
                Admin
              </Typography>
            </Box>
          </Box>
          <IconButton
            sx={{
              width: 25,
              height: 25,
              borderRadius: "50%",
              borderWidth: 1,
              borderStyle: "solid",
              borderColor: "#5C5C5C",
              "&:hover": {
                backgroundColor: "transparent",
              },
            }}
            onClick={handleProfileMenuOpen}
          >
            <img src={assets?.downArrown} />
          </IconButton>
        </Box>
        <Menu
          id="menu-appbar"
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          keepMounted
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
          <MenuItem onClick={handleMenuClose}>Logout</MenuItem>
        </Menu>
        <Menu
          id="notifications-menu"
          anchorEl={notificationsAnchorEl}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          keepMounted
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          open={Boolean(notificationsAnchorEl)}
          onClose={handleNotificationsMenuClose}
        >
          <MenuItem onClick={handleNotificationsMenuClose}>
            Notification 1
          </MenuItem>
          <MenuItem onClick={handleNotificationsMenuClose}>
            Notification 2
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default DashboardHeader;
