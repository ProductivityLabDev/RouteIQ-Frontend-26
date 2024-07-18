import React from "react";
import { Box, Typography } from "@mui/material";
import "../../pages/auth/auth.css";
import assets from "../../utlis/assets";

const LoginHeader = () => {
  return (
    <Box className="header" gap={4} marginTop={4}>
      <img src={assets?.authLogo} className="logo" />
      <Typography
        variant="h3"
        gutterBottom
        sx={{ color: "rgba(109, 0, 0, 1)" }}
      >
        Route IQ
      </Typography>
    </Box>
  );
};

export default LoginHeader;
