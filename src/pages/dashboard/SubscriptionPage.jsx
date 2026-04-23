import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../dashboard/auth.css";
import { Container, Grid, Paper, Typography, Box } from "@mui/material";
import colors from "@/utlis/Colors";
import ButtonComponent from "@/components/buttons/CustomButton";
import { logo } from "@/assets";
import axios from "axios";
import { BASE_URL } from "@/configs";

const SubscriptionPage = () => {
  const navigation = useNavigate();
  const location = useLocation();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const selectedCard = location.state?.selectedCard || null;
  const fromPath = location.state?.from || null;

  const vendorSignupId =
    location?.state?.vendorSignupId ||
    sessionStorage.getItem("vendorSignupId") ||
    null;

  const handleSubmit = async () => {
    if (isProcessing) return;

    setIsProcessing(true);
    setErrorMessage("");

    try {
      const payload = {
        vendorSignupId: vendorSignupId,
        packageId: selectedCard?.packageId ?? 1,
        amount: selectedCard?.amount ?? 30,
        paymentMethod: "Credit Card",
        transactionId: `txn_${Date.now()}`,
        status: "PENDING"

      };

      await axios.post(`${BASE_URL}/signup/vendor/payment`, payload, {
        timeout: 15000,
        headers: { "Content-Type": "application/json" },
      });


      if (fromPath === "/BillingInvoice") {
        navigation("/BillingInvoice");
      } else {
        navigation("/payment_success");
      }

    } catch (error) {
      if (error.code === "ECONNABORTED") {
        setErrorMessage("Payment is taking longer than expected. Please try again.");
      } else {
        setErrorMessage(
          error.response?.data?.message || "Payment failed. Please try again."
        );
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const formatPrice = (price) => {
    if (!price || typeof price !== "string") return "$0.00";

    if (price.includes("/month")) return price.replace("/month", ".00");
    if (price.includes("/year")) return price.replace("/year", ".00");

    return price;
  };

  if (!selectedCard) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <h1>No subscription selected</h1>
      </div>
    );
  }

  return (
    <div
      style={{
        backgroundColor: colors?.thickGreyColor,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
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
        <img src={logo} className="w-[60%] mb-12 justify-center self-center" />

        {/* First Paper */}
        <Paper elevation={3} sx={{ background: colors.whiteColor, padding: 2 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
            Your Subscription
          </Typography>

          <Box sx={{ display: "flex", justifyContent: "space-between", px: 3 }}>
            <Typography sx={{ fontWeight: 800 }}>Business Subscription</Typography>

            <Typography sx={{ fontWeight: 400 }}>
              {selectedCard?.newPrice}
            </Typography>
          </Box>
        </Paper>

        {/* Total Amount */}
        <Paper elevation={3} sx={{ background: colors.whiteColor, padding: 2, mt: 4 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", px: 3 }}>
            <Typography sx={{ fontWeight: 800 }}>Total Due Amount</Typography>

            <Typography sx={{ fontWeight: 400 }}>
              {formatPrice(selectedCard?.newPrice)}
            </Typography>
          </Box>
        </Paper>

        {/* Pay Button */}
        <Grid container spacing={2} mt={2}>
          <Grid item xs={12}>
            {errorMessage ? (
              <Typography
                sx={{
                  color: colors?.redColor || "#C01824",
                  fontSize: "0.95rem",
                  mb: 1.5,
                  textAlign: "center",
                }}
              >
                {errorMessage}
              </Typography>
            ) : null}
            <ButtonComponent
              label={isProcessing ? "Processing payment..." : "Pay now"}
              onClick={handleSubmit}
              disabled={isProcessing}
              sx={{
                backgroundColor: isProcessing ? "#3B3B3B" : colors.darkBlackColor,
                width: "100%",
                opacity: isProcessing ? 0.85 : 1,
                cursor: isProcessing ? "not-allowed" : "pointer",
                "&:hover": {
                  backgroundColor: isProcessing ? "#3B3B3B" : colors.darkBlackColor,
                },
              }}
            />
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default SubscriptionPage;


