import React, { useState } from "react";
import "./auth.css";
import { Container, Grid, Paper, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import InputField from "../../components/textField/TextField";
import ButtonComponent from "../../components/button/ButtonComponent";
import LoginHeader from "../../components/loginHeader/LoginHeader";
import colors from "../../utlis/Colors";

const EmailVerify = () => {
  const [emailVerifyForm, setEmailVerifyForm] = useState({
    email: "",
  });
  const navigation = useNavigate();

  const handleChange = (key, value) => {
    setEmailVerifyForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = () => {
    if (emailVerifyForm?.email === "") {
      alert("Please Enter Your Email");
    } else {
      navigation("/email_verify_note");
    }
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
              Forgot password
            </Typography>
            <Typography
              variant="body2"
              gutterBottom
              sx={{
                color: colors?.whiteColor,
                fontFamily: "Nunito Sans",
                fontWeight: 400,
              }}
            >
              Enter your email for the verification proccess,we will send 4
              digits code to your email.
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
                  E mail
                </Typography>
                <InputField
                  onChange={(e) => handleChange("email", e.target.value)}
                  type="text"
                  value={emailVerifyForm?.email}
                  placeholder="Enter email"
                />
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

export default EmailVerify;
