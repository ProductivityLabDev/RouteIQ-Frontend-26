import React from "react";
import "./auth.css";
import { Container, Grid, Paper, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ButtonComponent from "../../components/button/ButtonComponent";
import LoginHeader from "../../components/loginHeader/LoginHeader";
import upload from "../../assets/upload.png";
import colors from "../../utlis/Colors";

const PasswordUpdateSuccessfullNote = () => {
  const navigation = useNavigate();

  const handleSubmit = () => {
    navigation("/");
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
              justifyContent: "center",
              flex: 1,
              paddingLeft: 4,
            }}
          >
            <img src={upload} style={{ width: 164, height: 164 }} />
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
                    justifyContent: "center",
                    fontFamily: "Nunito Sans",
                    fontWeight: 400,
                    fontSize: "2.813rem",
                  }}
                >
                  Successfully
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    mb: "4px",
                    color: colors?.whiteColor,
                    display: "flex",
                    justifyContent: "center",
                    fontFamily: "Nunito Sans",
                    fontWeight: 400,
                    fontSize: "1rem",
                  }}
                >
                  Your password has been reset successfully
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

export default PasswordUpdateSuccessfullNote;
