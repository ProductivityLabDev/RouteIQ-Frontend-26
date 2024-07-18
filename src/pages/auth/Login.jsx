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
  IconButton,
  TextField,
  InputAdornment,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Checkbox from "@mui/material/Checkbox";
import { styled } from "@mui/material/styles";
import InputField from "../../components/textField/TextField";
import ButtonComponent from "../../components/button/ButtonComponent";
import RefreshIcon from "@mui/icons-material/Refresh";
import LoginHeader from "../../components/loginHeader/LoginHeader";
import colors from "../../utlis/Colors";

const CustomTabs = styled(Tabs)(({ theme }) => ({
  "& .MuiTab-root": {
    color: "white",
  },
  "& .MuiTabs-indicator": {
    backgroundColor: "transparent",
    color: "white",
  },
}));

const CustomTab = styled(Tab)(({ theme }) => ({
  color: "white",
}));
const Login = () => {
  const [loginForm, setLoginForm] = useState({
    username: "",
    password: "",
    securityText: "",
  });
  const [securityText, setSecurityText] = useState("j5a7eo");
  const [activeTab, setActiveTab] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const navigation = useNavigate();

  const handleChange = (key, value) => {
    setLoginForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const CheckboxContainer = styled("label")(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    padding: "8px",
    borderRadius: "4px",
  }));
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    if (newValue === "login") {
      navigation("/");
    } else {
      navigation("/sign_up");
    }
  };
  const refreshSecurityText = () => {
    const newSecurityText = Math.random().toString(36).substring(2, 8);
    setSecurityText(newSecurityText);
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };
  const handleLogin = () => {
    navigation("/dashboard_subscription");
  };
  return (
    <div className="MainContainerAuth">
      <Container maxWidth="sm" sx={{ marginBottom: 6 }}>
        <LoginHeader />
        <Paper
          elevation={3}
          className="paper"
          sx={{
            background: colors.backgroundGradient,
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
              <Box
                sx={{
                  background:
                    activeTab === "login"
                      ? colors?.customTabblackColor
                      : "none",
                  width: "50%",
                  justifyContent: "center",
                }}
              >
                <CustomTab
                  label="Login"
                  value="login"
                  sx={{
                    background:
                      activeTab === "login"
                        ? colors?.customTabblackColor
                        : "none",
                    color: colors?.whiteColor,
                  }}
                />
              </Box>
              <CustomTab
                label="Sign up"
                value="signup"
                sx={{
                  background:
                    activeTab === "signup"
                      ? colors?.customTabblackColor
                      : "none",
                  color: colors?.whiteColor,
                  width: "50%",
                }}
              />
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
              Login to Account
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
              Please enter your email and password to continue
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
                  User Name
                </Typography>
                <InputField
                  onChange={(e) => handleChange("username", e.target.value)}
                  type="text"
                  value={loginForm?.username}
                  placeholder="hannah.green@test.com"
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
                  Password
                </Typography>
                <InputField
                  onChange={(e) => handleChange("password", e.target.value)}
                  type={showPassword ? "text" : "password"}
                  value={loginForm?.password}
                  isPassword={true}
                  showPassword={showPassword}
                  placeholder="Password123@"
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
                  Security Text
                </Typography>
                <Grid container alignItems="center" spacing={1}>
                  <Grid
                    sx={{
                      width: "100%",
                      display: "flex",
                      flexDirection: "row",
                      gap: 1,
                      marginInline: 1,
                      marginTop: 1,
                    }}
                  >
                    <Grid item xs={11}>
                      <InputField
                        onChange={(e) =>
                          handleChange("securityText", e.target.value)
                        }
                        type="text"
                        value={loginForm?.securityText}
                        placeholder="Enter the shown text"
                      />
                    </Grid>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <TextField
                          autoFocus
                          variant="outlined"
                          value={securityText}
                          InputProps={{
                            readOnly: true,
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  onClick={refreshSecurityText}
                                  sx={{
                                    color: "rgba(20, 21, 22, 1)",
                                    backgroundColor: "transparent",
                                    "&:hover": {
                                      backgroundColor: "transparent",
                                    },
                                  }}
                                >
                                  <RefreshIcon />
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                          sx={{
                            "& fieldset": {
                              borderColor: "#fff !important",
                              borderRadius: 2,
                            },
                            borderRadius: 2,
                            width: "100%",
                            backgroundColor: colors?.whiteColor,
                          }}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} className="remember-forgot">
                <Typography variant="body2" sx={{ marginInline: -2 }}>
                  <CheckboxContainer>
                    <Checkbox
                      value="remember"
                      style={{
                        color: "rgba(192,24,36,1)",
                      }}
                      color="primary"
                    />

                    <Typography
                      variant="body2"
                      sx={{ marginLeft: 1, color: colors?.whiteColor }}
                    >
                      Remember me on this computer
                    </Typography>
                  </CheckboxContainer>
                </Typography>
                <Typography variant="body2" sx={{ marginRight: 2 }}>
                  <a
                    onClick={() => navigation("/email_verify")}
                    style={{
                      color: "#fff",
                      fontFamily: "Nunito Sans",
                      fontWeight: 400,
                      cursor: "pointer",
                    }}
                  >
                    Forgot Password?
                  </a>
                </Typography>
              </Grid>
              <Grid container spacing={2} mt={3}>
                <ButtonComponent label="LOG IN" onClick={handleLogin} />
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Container>
    </div>
  );
};

export default Login;
