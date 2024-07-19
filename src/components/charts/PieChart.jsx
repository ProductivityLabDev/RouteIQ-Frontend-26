import React from "react";
import { PieChart, Pie, Legend, Tooltip, ResponsiveContainer } from "recharts";
import {
  Card,
  CardContent,
  Typography,
  Box,
  IconButton,
  Grid,
} from "@mui/material";
import { styled } from "@mui/system";
import assets from "../../utlis/assets";
import ButtonComponent from "../button/ButtonComponent";
import colors from "../../utlis/Colors";

const data01 = [
  { name: "Group A", value: 400 },
  { name: "Group B", value: 300 },
  { name: "Group C", value: 300 },
  { name: "Group D", value: 200 },
  { name: "Group E", value: 278 },
  { name: "Group F", value: 189 },
];

const data02 = [
  { name: "Group A", value: 2400 },
  { name: "Group B", value: 4567 },
  { name: "Group C", value: 1398 },
  { name: "Group D", value: 9800 },
  { name: "Group E", value: 3908 },
  { name: "Group F", value: 4800 },
];

const CustomPieChart = () => {
  const CustomCard = styled(Card)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: theme.spacing(2),
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[1],
    width: "33%",
  }));

  const CardHeader = styled(Box)(({ theme }) => ({
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: theme.spacing(1),
  }));

  return (
    <CustomCard>
      <CardHeader>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-around",
            flex: 1,
          }}
        >
          <Typography
            sx={{
              fontWeight: 700,
              fontFamily: "Urbanist",
              fontSize: "1.314rem",
            }}
          >
            Sales Report
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
            }}
          >
            <Typography
              sx={{
                fontWeight: 500,
                fontFamily: "Urbanist",
                fontSize: "0.92rem",
              }}
            >
              Month
            </Typography>
            <IconButton
              sx={{
                width: 25,
                height: 25,
                borderRadius: "50%",
                "&:hover": {
                  backgroundColor: "transparent",
                },
              }}
            >
              <img src={assets?.downArrown} />
            </IconButton>
          </Box>
        </Box>
      </CardHeader>
      <CardContent sx={{ width: "50%", height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              dataKey="value"
              isAnimationActive={false}
              data={data01}
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#fff"
              label
            />
            <Pie
              dataKey="value"
              data={data02}
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={80}
              fill={colors?.redColor}
            />
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
        <Grid container spacing={2} mb={3}>
          <ButtonComponent label="Deposit now" />
        </Grid>
      </CardContent>
    </CustomCard>
  );
};

export default CustomPieChart;
