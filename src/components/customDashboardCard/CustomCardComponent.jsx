import React from "react";
import { Card, CardContent, Typography, Box, IconButton } from "@mui/material";
import { styled } from "@mui/system";
import assets from "../../utlis/assets";
import colors from "../../utlis/Colors";

const CustomCard = styled(Card)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[1],
}));

const CardHeader = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  width: "100%",
  marginBottom: theme.spacing(1),
}));

const Icon = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const CardStats = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  width: "100%",
  marginTop: theme.spacing(1),
}));

const StatChange = styled(Typography)(({ theme }) => ({
  color: theme.palette.error.main,
}));

const CustomCardComponent = ({ title, icon, value, change, changeText }) => {
  return (
    <CustomCard>
      <CardHeader>
        {/* <Box>{icon}</Box> */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            flex: 1,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              gap: 3,
            }}
          >
            <img src={icon} />
            <Typography
              variant="h6"
              component="div"
              sx={{
                fontSize: "1.051rem",
                fontWeight: 600,
                fontFamily: "Urbanist",
                color: "#04091E",
              }}
            >
              {title}
            </Typography>
          </Box>
          <img src={assets?.cardUsers} style={{ width: 53, height: 27 }} />
          <IconButton
            size="large"
            color="inherit"
            sx={{
              backgroundColor: "transparent",
              "&:hover": {
                backgroundColor: "transparent",
              },
            }}
          >
            <img src={assets?.cardVeriticalDot} />
          </IconButton>
        </Box>
      </CardHeader>
      <CardContent sx={{ width: "100%" }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <Typography
            variant="h4"
            component="div"
            sx={{
              fontWeight: 800,
              fontSize: "2.103rem",
              fontFamily: "Urbanist",
              color: colors?.blackColor,
            }}
          >
            {value}
          </Typography>
          <img src={assets?.cardBar} />
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            gap: 1,
          }}
        >
          <img src={assets?.cardPrevious} />
          <StatChange
            variant="body2"
            sx={{
              fontWeight: 600,
              fontFamily: "Urbanist",
              fontSize: "0.854rem",
            }}
          >
            {change}{" "}
            <span style={{ color: colors?.lightGrey }}>{changeText}</span>
          </StatChange>
        </Box>
        <CardStats>{/* Place for chart or stats */}</CardStats>
      </CardContent>
    </CustomCard>
  );
};

export default CustomCardComponent;
