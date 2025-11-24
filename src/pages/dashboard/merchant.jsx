import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Typography } from "@material-tailwind/react";
import { logo } from "@/assets";

const Merchant = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedCard = location.state?.selectedCard;

  // Extract price from selected card
  const getSubscriptionPrice = () => {
    if (selectedCard?.newPrice) {
      return selectedCard.newPrice;
    }
    return "$30/month";
  };

  // Calculate total due amount
  const getTotalAmount = () => {
    if (selectedCard?.newPrice) {
      const price = selectedCard.newPrice.replace("$", "").replace("/month", "").replace("/year", "");
      return `$${parseFloat(price).toFixed(2)}`;
    }
    return "$30.00";
  };

  const handlePayNow = () => {
    // Navigate to payment success or payment gateway
    navigate("/payment_success", {
      state: { selectedCard, amount: getTotalAmount() },
    });
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-12">
          <div className="flex items-center gap-3">
            {/* Map Pin Icon with Bird */}
            <div className="relative">
              <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Map pin shape */}
                <path d="M28 4C19.16 4 12 11.16 12 20C12 30.5 28 52 28 52C28 52 44 30.5 44 20C44 11.16 36.84 4 28 4Z" fill="#C01824"/>
                {/* Inner white circle */}
                <circle cx="28" cy="20" r="8" fill="white"/>
                {/* Bird icon inside - robin facing right */}
                <g transform="translate(20, 12)">
                  {/* Bird body */}
                  <ellipse cx="8" cy="8" rx="5" ry="6" fill="#C01824"/>
                  {/* Bird head */}
                  <circle cx="11" cy="6" r="3" fill="#C01824"/>
                  {/* Bird beak */}
                  <path d="M13 6 L16 7 L13 8 Z" fill="#C01824"/>
                  {/* Bird eye */}
                  <circle cx="12" cy="5.5" r="0.8" fill="white"/>
                </g>
              </svg>
            </div>
            {/* Route IQ Text */}
            <Typography className="text-[#C01824] text-4xl font-serif font-bold tracking-tight">
              Route IQ
            </Typography>
          </div>
        </div>

        {/* Your Subscription Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-4 border border-gray-200">
          <Typography className="text-gray-900 text-lg font-bold mb-4">
            Your Subscription
          </Typography>
          <div className="flex justify-between items-center">
            <Typography className="text-gray-700 text-base font-normal">
              Business Subscription
            </Typography>
            <Typography className="text-gray-700 text-base font-normal">
              {getSubscriptionPrice()}
            </Typography>
          </div>
        </div>

        {/* Total Due Amount Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-4 border border-gray-200">
          <div className="flex justify-between items-center">
            <Typography className="text-gray-900 text-lg font-bold">
              Total Due Amount
            </Typography>
            <Typography className="text-gray-700 text-base font-normal">
              {getTotalAmount()}
            </Typography>
          </div>
        </div>

        {/* Pay now Button */}
        <button
          onClick={handlePayNow}
          className="w-full bg-black hover:bg-gray-800 text-white font-bold text-base py-4 rounded-lg shadow-md transition-colors"
        >
          Pay now
        </button>
      </div>
    </div>
  );
};

export default Merchant;

