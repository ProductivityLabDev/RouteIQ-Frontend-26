import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../dashboard/auth.css";
import { Container, Grid, Paper, Typography, Box } from "@mui/material";
import colors from "@/utlis/Colors";
import ButtonComponent from "@/components/buttons/CustomButton";
import { logo } from "@/assets";
const SubscriptionPage = () => {
  const navigation = useNavigate();

  const location = useLocation();
  const { selectedCard } = location.state;
  const fromPath = location.state?.from;

  const handleSubmit = () => {
    if (fromPath === "/BillingInvoice") {
      navigation("/BillingInvoice");

    } else {
      navigation("/payment_success");

    }
  };
  const formatPrice = (price) => {
    if (price.includes("/month")) {
      return price.replace("$", "$").replace("/month", ".00");
    } else if (price.includes("/year")) {
      return price.replace("$", "$").replace("/year", ".00");
    }
    return price;
  };

  return (
    <div
      style={{
        backgroundColor: colors?.thickGreyColor,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Container
        maxWidth="sm"
        sx={{
          marginBottom: 6,
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <img src={logo} className='w-full max-w-[180px] md:max-w-[200px] mb-12 justify-center self-center' />
        <Paper
          elevation={3}
          className="paper"
          sx={{
            background: colors?.whiteColor,
            padding: 5,
          }}
        >
          <Typography
            variant="h5"
            gutterBottom
            sx={{
              color: colors?.blackColor,
              fontFamily: "Nunito Sans",
              fontWeight: 700,
              textAlign: "start",
              paddingInline: 7,
              fontSize: "2rem",
              marginTop: 1,
              marginBottom: 5,
            }}
          >
            Your Subscription
          </Typography>
          <Box
            className="paper"
            sx={{
              marginTop: 2,
              display: "flex",
              justifyContent: "space-around",
              flexDirection: "row",
              flex: 1,
              textAlign: "start",
              paddingLeft: 4,
            }}
          >
            <Typography
              variant="body2"
              gutterBottom
              sx={{
                color: colors?.blackColor,
                fontFamily: "Nunito Sans",
                fontWeight: 800,
                fontSize: "1.313rem",
              }}
            >
              Business Subscription
            </Typography>
            <Typography
              variant="body2"
              gutterBottom
              sx={{
                color: colors?.blackColor,
                fontFamily: "Nunito Sans",
                fontWeight: 400,
                fontSize: "1.313rem",
              }}
            >
              {selectedCard?.newPrice}
            </Typography>
          </Box>
        </Paper>
        <Paper
          elevation={3}
          className="paper"
          sx={{
            background: colors?.whiteColor,
            padding: 2,
            marginTop: 4,
          }}
        >
          <Box
            className="paper"
            sx={{
              marginTop: 2,
              display: "flex",
              justifyContent: "space-around",
              flexDirection: "row",
              flex: 1,
              textAlign: "start",
              paddingLeft: 4,
            }}
          >
            <Typography
              variant="body2"
              gutterBottom
              sx={{
                color: colors?.blackColor,
                fontFamily: "Nunito Sans",
                fontWeight: 800,
                fontSize: "1.313rem",
              }}
            >
              Total Due Amount
            </Typography>
            <Typography
              variant="body2"
              gutterBottom
              sx={{
                color: colors?.blackColor,
                fontFamily: "Nunito Sans",
                fontWeight: 400,
                fontSize: "1.313rem",
              }}
            >
              {formatPrice(selectedCard?.newPrice)}
            </Typography>
          </Box>
        </Paper>
        <Grid container spacing={2} mt={2}>
          <Grid item xs={12}>
            <ButtonComponent
              label="Pay now"
              onClick={handleSubmit}
              sx={{
                backgroundColor: colors?.darkBlackColor,
                width: "100%",
                "&:hover": {
                  backgroundColor: colors?.darkBlackColor,
                },
              }}
            />
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default SubscriptionPage;
