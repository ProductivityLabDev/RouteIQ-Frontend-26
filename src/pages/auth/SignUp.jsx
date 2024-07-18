import React, { useState } from "react";
import "./auth.css";
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Tabs,
  Tab,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import authLogo from "../../assets/authlogo.png";
import { styled } from "@mui/material/styles";
import InputField from "../../components/textField/TextField";
import ButtonComponent from "../../components/button/ButtonComponent";
import LoginHeader from "../../components/loginHeader/LoginHeader";
import colors from "../../utlis/Colors";

const CustomTabs = styled(Tabs)(({ theme }) => ({
  "& .MuiTab-root": {
    color: colors?.whiteColor,
  },
  "& .MuiTabs-indicator": {
    backgroundColor: "transparent",
    color: colors?.whiteColor,
  },
}));

const CustomTab = styled(Tab)(({ theme }) => ({
  color: colors?.whiteColor,
}));
const SignUp = () => {
  const [signUpForm, setSignUpForm] = useState({
    name: "",
    title: "",
    company: "",
    email: "",
    contactNumber: "",
  });
  const [activeTab, setActiveTab] = useState("signup");
  const navigation = useNavigate();

  const handleChange = (key, value) => {
    setSignUpForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    if (newValue === "signup") {
      navigation("/");
    } else {
      navigation("/");
    }
  };

  return (
    <div className="MainContainerAuth">
      <Container maxWidth="sm" sx={{ marginBottom: 6 }}>
        <LoginHeader />
        <Paper
          elevation={3}
          className="paper"
          sx={{
            background: colors?.backgroundGradient,
          }}
        >
          <Box
            sx={{
              borderBottom: 1,
              borderColor: "divider",
              display: "flex",
              justifyContent: "center",
              flex: 1,
            }}
          >
            <CustomTabs
              aria-label="login signup tabs"
              value={activeTab}
              onChange={handleTabChange}
              sx={{
                flex: 1,
                justifyContent: "center",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              {/* <Box sx={{ background: activeTab === 'signup' ? 'rgba(21, 18, 18, 1)' : "none", width: '50%', justifyContent: "center" }}> */}
              <CustomTab
                label="Login"
                value="signup"
                sx={{
                  background: "none",
                  color: "white !important",
                  width: "50%",
                }}
                onClick={() => navigation("/")}
              />
              {/* </Box> */}
              <Box
                sx={{
                  background:
                    activeTab === "signup"
                      ? colors?.customTabblackColor
                      : "none",
                  width: "50%",
                  justifyContent: "center",
                }}
              >
                <CustomTab
                  label="Sign up"
                  value="signup"
                  sx={{
                    background:
                      activeTab === "signup"
                        ? colors?.customTabblackColor
                        : "none",
                    color: "white !important",
                    flex: 1,
                    textAlign: "center",
                  }}
                />
              </Box>
            </CustomTabs>
          </Box>
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
              Business Information
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
              Please enter your business details
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
                  Name*
                </Typography>
                <InputField
                  onChange={(e) => handleChange("name", e.target.value)}
                  type="text"
                  value={signUpForm?.name}
                  placeholder="Jane Doe"
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
                  Title*
                </Typography>
                <InputField
                  onChange={(e) => handleChange("title", e.target.value)}
                  type="text"
                  value={signUpForm?.title}
                  placeholder="VP OF HR"
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
                  Company*
                </Typography>
                <InputField
                  onChange={(e) => handleChange("company", e.target.value)}
                  type="text"
                  value={signUpForm?.company}
                  placeholder="Kala Kola Company"
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
                  Email*
                </Typography>
                <InputField
                  onChange={(e) => handleChange("email", e.target.value)}
                  type="email"
                  value={signUpForm?.email}
                  placeholder="jane@kola.co"
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
                  Contact Number*
                </Typography>
                <InputField
                  onChange={(e) =>
                    handleChange("contactNumber", e.target.value)
                  }
                  type="number"
                  value={signUpForm?.contactNumber}
                  placeholder="+65312312455235"
                  min={0}
                />
              </Grid>
              <Grid container spacing={2} mt={2}>
                <Grid item xs={12}>
                  <ButtonComponent label="PROCEED" />
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Container>
    </div>
  );
};

export default SignUp;
