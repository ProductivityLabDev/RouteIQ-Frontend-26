import React, { useEffect, useState } from "react";
import LoginHeader from "../../components/loginHeader/LoginHeader";
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  TextField,
} from "@mui/material";
import ButtonComponent from "../../components/button/ButtonComponent";
import { useNavigate } from "react-router-dom";
import colors from "../../utlis/Colors";

const PasswordVerificationCode = () => {
  const [code, setCode] = useState(["", "", "", ""]);
  const [seconds, setSeconds] = useState(30);
  const [isExpired, setIsExpired] = useState(false);
  const navigation = useNavigate();

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (value.length <= 1) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);
      if (value && index < 3) {
        document.getElementById(`input-${index + 1}`).focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      document.getElementById(`input-${index - 1}`).focus();
    }
  };

  useEffect(() => {
    if (seconds > 0) {
      const timer = setInterval(() => {
        setSeconds((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else {
      setIsExpired(true);
    }
  }, [seconds]);

  const handleSubmit = () => {
    navigation("/forget_password");
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
            }}
          >
            <Typography
              variant="h5"
              gutterBottom
              sx={{
                color: colors?.whiteColor,
                fontFamily: "Nunito Sans",
                fontWeight: 700,
                textAlign: "center",
              }}
            >
              Verification
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
                    justifyContent: "center",
                    fontFamily: "Nunito Sans",
                    fontWeight: 400,
                    textAlign: "center",
                  }}
                >
                  Enter your 4 digits code that you received on your email.
                </Typography>
              </Grid>
              <Box className="form-container" sx={{ flex: 1 }}>
                <Grid
                  container
                  spacing={2}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Grid item xs={12}>
                    {code?.map((digit, index) => (
                      <TextField
                        key={index}
                        id={`input-${index}`}
                        variant="outlined"
                        autoFocus
                        type="number"
                        inputProps={{
                          maxLength: 1,
                          style: {
                            MozAppearance: "textfield",
                            WebkitAppearance: "none",
                            appearance: "none",
                          },
                        }}
                        value={digit}
                        onChange={(e) => handleChange(e, index)}
                        onKeyDown={(e) => handleKeyDown(e, index)}
                        sx={{
                          width: 84,
                          margin: 1,
                          "& fieldset": {
                            borderColor: "#fff !important",
                            borderRadius: 1,
                            height: 67,
                            justifyContent: "center",
                            textAlign: "center",
                            color: colors?.blackColor,
                          },
                          "& input": {
                            height: 40,
                            fontSize: "2.25rem",
                            textAlign: "center",
                            fontFamily: "Open Sans",
                            fontWeight: "400",
                          },
                          backgroundColor: colors?.whiteColor,
                          borderRadius: 1,
                          height: 76,
                          color: colors?.blackColor,
                          "& input[type=number]::-webkit-inner-spin-button, & input[type=number]::-webkit-outer-spin-button":
                            {
                              display: "none",
                              margin: 0,
                            },
                        }}
                      />
                    ))}
                  </Grid>
                  <Typography
                    variant="body1"
                    sx={{
                      color: colors?.timecountColor,
                      fontWeight: "700",
                      fontFamily: "Nunito Sans",
                      fontSize: "1.5rem",
                      marginTop: 2,
                    }}
                  >
                    {isExpired ? "00:00" : `00:${seconds}`}
                  </Typography>
                </Grid>
              </Box>
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <ButtonComponent label="CONTINUE" onClick={handleSubmit} />
                </Grid>
              </Grid>
              <Grid
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flex: 1,
                  marginTop: 2,
                }}
              >
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: "400",
                    fontFamily: "Nunito Sans",
                    fontSize: "0.875rem",
                    textAlign: "center",
                    color: colors?.whiteColor,
                  }}
                >
                  If you didn’t receive a code!{" "}
                  <span
                    style={{ cursor: "pointer", color: colors?.timecountColor }}
                  >
                    Resend
                  </span>
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Container>
    </div>
  );
};

export default PasswordVerificationCode;
