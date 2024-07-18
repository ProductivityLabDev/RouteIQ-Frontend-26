import React, { useState } from "react";
import "./auth.css";
import { Container, Grid, Paper, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import InputField from "../../components/textField/TextField";
import ButtonComponent from "../../components/button/ButtonComponent";
import LoginHeader from "../../components/loginHeader/LoginHeader";
import colors from "../../utlis/Colors";

const ForgetPassword = () => {
  const [passwordForm, setPasswordForm] = useState({
    newpassword: "",
    confirmpassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword1, setShowPassword1] = useState(false);

  const navigation = useNavigate();

  const handleChange = (key, value) => {
    setPasswordForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = () => {
    if (passwordForm?.newpassword && passwordForm?.confirmpassword === "") {
      alert("Enter the Password");
    } else {
      navigation("/password_update");
    }
  };
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };
  const handleClickShowConfirmPassword = () => {
    setShowPassword1(!showPassword1);
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
              New Password
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
              Set the new password for your account so you can login and access
              all <br /> featuress.
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
                  Enter new password
                </Typography>
                <InputField
                  onChange={(e) => handleChange("newpassword", e.target.value)}
                  value={passwordForm?.newpassword}
                  placeholder="8 symbls at least"
                  isPassword={true}
                  showPassword={showPassword}
                  type={showPassword ? "text" : "password"}
                  handleClickShowPassword={handleClickShowPassword}
                />
              </Grid>
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
                  Confirm password
                </Typography>
                <InputField
                  onChange={(e) =>
                    handleChange("confirmpassword", e.target.value)
                  }
                  value={passwordForm?.confirmpassword}
                  placeholder="8 symbls at leastl"
                  handleClickShowConfirmPassword={
                    handleClickShowConfirmPassword
                  }
                  isPassword={true}
                  showPassword1={showPassword1}
                  type={showPassword1 ? "text" : "password"}
                />
              </Grid>
              <Grid container spacing={2} mt={2}>
                <Grid item xs={12}>
                  <ButtonComponent
                    label="UPDATE PASSWORD"
                    onClick={handleSubmit}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Container>
    </div>
  );
};

export default ForgetPassword;
