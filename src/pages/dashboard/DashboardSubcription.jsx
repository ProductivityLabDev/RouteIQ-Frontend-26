import React, { useState } from "react";
import "../dashboard/auth.css";
import { useLocation, useNavigate } from "react-router-dom";
import { Container, Grid, Paper, Typography, Box } from "@mui/material";
import colors from "@/utlis/Colors";
import { dollar, dollarless } from "@/assets";
import ButtonComponent from "@/components/buttons/CustomButton";
import axios from "axios";

const DashboardSubcription = () => {
  const [selectedCard, setSelectedCard] = useState(null);

  const navigation = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const fromPath = queryParams.get("from");

  const vendorSignupId = location?.state?.vendorSignupId || null;
  const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:3000";


  // const handleSubmit = () => {
  //   if (selectedCard) {
  //     navigation("/subscription_page", {
  //       state: { selectedCard, from: fromPath },
  //     });
  //   }
  // };

  const handleSubmit = async () => {
    if (!selectedCard) {
      alert("Please select a subscription plan first.");
      return;
    }

    try {
      const payload = {
        vendorSignupId: selectedCard.vendorSignupId,
        packageId: selectedCard.packageId,
        // amount: selectedCard.amount,
        //paymentMethod: "Credit Card",
        //transactionId: "txn_" + Date.now(),
        //status: "PENDING",
        packageName: "Premium Plan"
      };

      console.log("Sending payload:", payload);

      const response = await axios.post(`${BASE_URL}/signup/vendor/package`, payload);
      console.log("API Success:", response.data);
      const vendorSignupIdFromApi = response.data?.vendorSignupId;
      console.log(vendorSignupIdFromApi,"here is the api ")
      navigation("/subscription_page", {
        state: { selectedCard, from: fromPath, vendorSignupId: vendorSignupIdFromApi },
      });
    } catch (error) {
      console.error("API Error:", error);
      alert("Payment failed. Try again.");
    }
  };


  // const handleCardClick = (card) => {
  //   setSelectedCard(card);
  // };

  const handleCardClick = (card) => {
    setSelectedCard(card);
  };

  // const cardData = [
  //   {
  //     packageId: 1,
  //     oldPrice: "$60",
  //     newPrice: "$30/month",
  //      vendorSignupId: vendorSignupId,
  //     description: "Pay monthly without missing out on any feature.",
  //     borderColor: selectedCard?.id === 1 ? colors?.timecountColor : "none",
  //     background:
  //       selectedCard?.id === 1
  //         ? colors?.backgroundGradient1
  //         : colors?.backgroundGradient,
  //   },
  //   {
  //     packageId: 2,
  //     oldPrice: "$600",
  //     newPrice: "$300/year",
  //      vendorSignupId: vendorSignupId,
  //     description: "Pay for a full year upfront and get 2 months for free.",
  //     borderColor: selectedCard?.id === 2 ? colors?.timecountColor : "none",
  //     background:
  //       selectedCard?.id === 2
  //         ? colors?.backgroundGradient1
  //         : colors?.backgroundGradient,
  //   },
  // ];
  const cardData = [
    {
      id: 1,
      packageId: 1,
      packageName: "Monthly Plan",
      amount: 30,
      vendorSignupId: vendorSignupId,
      oldPrice: "$60",
      newPrice: "$30/month",
      description: "Pay monthly without missing out on any feature.",
      borderColor: selectedCard?.id === 1 ? colors?.timecountColor : "none",
      background:
        selectedCard?.id === 1
          ? colors?.backgroundGradient1
          : colors?.backgroundGradient,
    },
    {
      id: 2,
      packageId: 2,
      packageName: "Premium Plan",
      amount: 300,
      vendorSignupId: vendorSignupId,
      oldPrice: "$600",
      newPrice: "$300/year",
      description: "Pay for a full year upfront and get 2 months for free.",
      borderColor: selectedCard?.id === 2 ? colors?.timecountColor : "none",
      background:
        selectedCard?.id === 2
          ? colors?.backgroundGradient1
          : colors?.backgroundGradient,
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
              fontSize: "44px",
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
              fontSize: "16px",
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
                width: 350,
                padding: 4,
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
                <Box display="flex" justifyContent="center" alignItems="center">
                  <img src={card.id === 1 ? dollarless : dollar} alt="price" />
                </Box>

                <Grid
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: 5,
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
                  &nbsp;&nbsp;
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
                    color: colors?.whiteColor,
                  }}
                >
                  {card?.description.includes("2 months for free") ? (
                    <span style={{ color: colors?.whiteColor }}>
                      Pay for a full year upfront and get{" "}
                      <span style={{ color: colors?.whiteColor, fontWeight: 900, }}>
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
