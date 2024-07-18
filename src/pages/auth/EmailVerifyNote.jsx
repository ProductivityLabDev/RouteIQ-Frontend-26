import React, { useState } from "react";
import "./auth.css";
import { Container, Grid, Paper, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ButtonComponent from "../../components/button/ButtonComponent";
import LoginHeader from "../../components/loginHeader/LoginHeader";
import colors from "../../utlis/Colors";

const EmailVerifyNote = () => {
  const navigation = useNavigate();

  const handleSubmit = () => {
    navigation("/verification_code");
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
        <LoginHeader />
        <Paper
          elevation={3}
          className="paper"
          sx={{
            background: colors?.backgroundGradient,
          }}
        >
          <Box
            className="paper"
            sx={{
              marginTop: 2,
              display: "flex",
              justifyContent: "flex-start",
              flexDirection: "column",
              flex: 1,
              textAlign: "start",
              paddingLeft: 4,
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
          <Box className="form-container">
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography
                  variant="body1"
                  sx={{
                    mb: "4px",
                    color: colors?.whiteColor,
                    display: "flex",
                    justifyContent: "flex-start",
                    fontFamily: "Nunito Sans",
                    fontWeight: 400,
                  }}
                >
                  Hi Johan,
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    mb: "4px",
                    color: colors?.whiteColor,
                    display: "flex",
                    justifyContent: "flex-start",
                    fontFamily: "Nunito Sans",
                    fontWeight: 400,
                  }}
                >
                  Your login credentials and password have been sent to your
                  email a**@gmail.com. Please utilize this information to access
                  the portal
                </Typography>
              </Grid>

              <Grid container spacing={2} mt={2}>
                <Grid item xs={12}>
                  <ButtonComponent label="CONTINUE" onClick={handleSubmit} />
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Container>
    </div>
  );
};

export default EmailVerifyNote;
