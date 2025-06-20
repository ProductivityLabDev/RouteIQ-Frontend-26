import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  useTheme,
} from "@mui/material";
import { styled } from "@mui/system";
import { vendorBar } from "@/assets"; // adjust if needed

const CustomCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: 12,
  boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.05)",
  backgroundColor: "#FFFFFF",
  width: "100%", // Always take full width of Grid item
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
}));

const Title = styled(Typography)(({ theme }) => ({
  fontSize: "1.25rem",
  fontWeight: 700,
  color: "#1A202C",
  whiteSpace: "nowrap",         // Prevent wrapping
  overflow: "hidden",           // Hide overflow
  textOverflow: "ellipsis",     // Add "..." if text overflows
  [theme.breakpoints.down("sm")]: {
    fontSize: "1rem",
  },
}));

const Value = styled(Typography)(({ theme }) => ({
  fontSize: "2rem",
  fontWeight: 700,
  [theme.breakpoints.down("sm")]: {
    fontSize: "1.5rem",
  },
}));

const StatChange = styled(Typography)(({ theme }) => ({
  color: "#C01824",
  fontWeight: 700,
  fontSize: "0.85rem",
  marginTop: theme.spacing(0.5),
}));

const CustomCardComponent = ({ title, value, change }) => {
  const theme = useTheme();

  return (
    <CustomCard>
      <CardContent
        sx={{
          padding: theme.spacing(2),
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexDirection: {
            xs: "column",
            sm: "row",
          },
          gap: 2,
        }}
      >
        <Box>
          <Title>{title}</Title>
          <Value>{value}</Value>
          <StatChange>{change}</StatChange>
        </Box>

        <Box
          component="img"
          src={vendorBar}
          alt="Graph"
          sx={{
            width: { xs: 60, sm: 70, md: 80 },
            height: "auto",
          }}
        />
      </CardContent>
    </CustomCard>
  );
};

export default CustomCardComponent;
