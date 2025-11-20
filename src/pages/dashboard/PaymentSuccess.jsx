import React from "react";
import "../dashboard/auth.css";
import { useNavigate } from "react-router-dom";
import { Container, Grid, Paper, Typography, Box } from "@mui/material";
import colors from "@/utlis/Colors";
import ButtonComponent from "@/components/buttons/CustomButton";
import { logo } from "@/assets";

const PaymentSuccess = () => {
  const navigation = useNavigate();

  const handleSubmit = () => {
    navigation("/sign-in-vendor");
  };
  return (
    <div className="MainContainerAuth">
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
            background: colors?.backgroundGradient,
          }}
        >
          <Box className="form-container">
            <Box
              className="paper"
              sx={{
                marginTop: 2,
                display: "flex",
                justifyContent: "flex-start",
                flexDirection: "column",
                flex: 1,
                textAlign: "start",
                marginBottom: 3,
              }}
            >
              <Typography
                variant="h5"
                gutterBottom
                sx={{
                  color: colors?.whiteColor,
                  fontFamily: "Nunito Sans",
                  fontWeight: 700,
                }}
              >
                Welcome To Route IQ
              </Typography>
            </Box>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography
                  variant="body1"
                  sx={{
                    color: colors?.whiteColor,
                    display: "flex",
                    justifyContent: "flex-start",
                    fontFamily: "Nunito Sans",
                    fontWeight: 400,
                    whiteSpace: "pre-line",
                    flexDirection: "column",
                    width: "90%",
                    lineHeight: "28px",
                  }}
                >
                  <span
                    style={{
                      color: colors?.whiteColor,
                      fontFamily: "Nunito Sans",
                      fontWeight: 800,
                      textAlign: "start",
                    }}
                  >
                    Hi John,
                  </span>
                  You have subscribed successfully. Your login credentials and
                  password have been sent to your email at a**@gmail.com.
                  <span style={{ textAlign: "start", paddingInline: 4 }}>
                    Please use this information to access the portal.
                  </span>
                </Typography>
              </Grid>

              <Grid container spacing={2} mt={2}>
                <Grid item xs={12}>
                  <ButtonComponent label="Login" onClick={handleSubmit} />
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Container>
    </div>
  );
};

export default PaymentSuccess;
