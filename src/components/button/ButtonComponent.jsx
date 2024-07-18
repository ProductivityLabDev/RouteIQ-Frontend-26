import React from "react";
import { Grid, Button } from "@mui/material";
import colors from "../../utlis/Colors";

const ButtonComponent = ({ label, onClick, sx }) => {
  return (
    <Grid item xs={12}>
      <Button
        variant="contained"
        color="primary"
        sx={{
          backgroundColor: colors?.redColor,
          "&:hover": {
            backgroundColor: colors?.redColor,
          },
          height: 55,
          borderRadius: 2,
          fontFamily: "Nunito Sans",
          fontWeight: 600,
          width: "93%",
          ...sx,
        }}
        onClick={onClick}
      >
        {label}
      </Button>
    </Grid>
  );
};

export default ButtonComponent;
