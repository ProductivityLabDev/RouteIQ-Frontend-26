import React, { useState } from "react";
import "../dashboard/auth.css";
import { useLocation, useNavigate } from "react-router-dom";
import { Container, Grid, Paper, Typography, Box } from "@mui/material";
import colors from "@/utlis/Colors";
import { dollar, dollarless } from "@/assets";
import ButtonComponent from "@/components/buttons/CustomButton";

const DashboardSubcription = () => {
  const [selectedCard, setSelectedCard] = useState(null);

  const navigation = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const fromPath = queryParams.get('from');
  const handleSubmit = () => {
    if (selectedCard) {
      navigation("/subscription_page", { state: { selectedCard, from: fromPath } });
    }
  };

  const handleCardClick = (card) => {
    setSelectedCard(card);
  };

  const cardData = [
    {
      id: 1,
      oldPrice: "$60",
      newPrice: "$30/month",
      description: "Pay monthly without missing out on any feature.",
      borderColor: selectedCard?.id === 1 ? colors?.timecountColor : "none",
      background: colors?.backgroundGradient,
    },
    {
      id: 2,
      oldPrice: "$600",
      newPrice: "$300/year",
      description: "Pay for a full year upfront and get 2 months for free.",
      borderColor: selectedCard?.id === 2 ? colors?.timecountColor : "none",
      background: colors?.backgroundGradient,
    },
  ];
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
        <Box
          className="paper"
          sx={{
            marginTop: 2,
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            textAlign: "center",
            paddingLeft: 4,
          }}
        >
          <Typography
            variant="h5"
            gutterBottom
            sx={{
              color: colors?.blackColor,
              fontFamily: "Nunito Sans",
              fontWeight: 800,
              fontSize: "2.75rem",
            }}
          >
            Your Subscription
          </Typography>
          <Typography
            variant="body2"
            gutterBottom
            sx={{
              color: colors?.blackColor,
              fontFamily: "Nunito Sans",
              fontWeight: 400,
              fontSize: "0.87rem",
            }}
          >
            Each subscription goes towards improving our product, featuring
            market intelligence, ad-free news, live pricing and more.
          </Typography>
        </Box>
        <Box
          display="flex"
          justifyContent="center"
          gap={4}
          marginTop={4}
          flexDirection="row"
        >
          {cardData?.map((card) => (
            <Paper
              key={card.id}
              elevation={3}
              sx={{
                background: card.background,
                width: 250,
                padding: 2,
                borderRadius: 2,
                border: `4px solid ${card.borderColor}`,
                boxSizing: "border-box",
                cursor: "pointer",
                position: `${card?.id === 2 ? "relative" : "none"}`,
              }}
              onClick={() => handleCardClick(card)}
            >
              {card.id === 2 ? (
                <Box
                  sx={{
                    position: "absolute",
                    top: -9,
                    left: "50%",
                    transform: "translateX(-50%)",
                    background: colors?.saveDollar,
                    borderRadius: 1,
                    padding: "2px 8px",
                    display: "inline-block",
                  }}
                >
                  <Typography
                    variant="body2"
                    component="div"
                    sx={{
                      fontFamily: "Nunito Sans",
                      color: colors?.whiteColor,
                    }}
                  >
                    SAVE $60
                  </Typography>
                </Box>
              ) : null}
              <Box textAlign="center" color={colors?.whiteColor} mt={4}>
                {card.id === 1 ? (
                  <img src={dollarless} />
                ) : (
                  <img src={dollar} />
                )}
                <Grid
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: 4,
                  }}
                >
                  <Typography
                    variant="h6"
                    component="div"
                    sx={{
                      fontFamily: "Nunito Sans",
                      textDecoration: "line-through",
                      color: colors?.lightGrey,
                      fontSize: "1.313rem",
                      fontWeight: 600,
                    }}
                  >
                    {card.oldPrice}
                  </Typography>
                  <Typography
                    variant="body1"
                    component="div"
                    sx={{
                      fontFamily: "Nunito Sans",
                      fontSize: "1.375rem",
                      fontWeight: 700,
                    }}
                  >
                    {card.newPrice}
                  </Typography>
                </Grid>
                <Typography
                  variant="body2"
                  component="div"
                  sx={{
                    fontFamily: "Nunito Sans",
                    marginTop: 2,
                    fontWeight: 400,
                    fontSize: "1rem",
                    color: colors?.lightGrey,
                  }}
                >
                  {card?.description.includes("2 months for free") ? (
                    <span style={{ color: colors?.lightGrey }}>
                      Pay for a full year upfront and get{" "}
                      <span style={{ color: colors?.whiteColor }}>
                        2 months for free.
                      </span>
                    </span>
                  ) : (
                    card?.description
                  )}
                </Typography>
              </Box>
            </Paper>
          ))}
        </Box>
        <Grid container spacing={2} mt={2} ml={2}>
          <Grid item xs={12}>
            <ButtonComponent
              label="Continue setting up your account"
              onClick={handleSubmit}
              sx={{ width: "90%" }}
            />
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default DashboardSubcription;
