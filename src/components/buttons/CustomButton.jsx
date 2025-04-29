import React from "react";
import { Grid, Button } from "@mui/material";
import colors from "@/utlis/Colors";

const ButtonComponent = ({ label, onClick, Icon = false, sx, IconName }) => {
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
                    gap: Icon ? 2 : 0,
                    textAlign: 'center',
                    fontSize: '16px',
                    ...sx,
                }}
                onClick={onClick}
            >
                {Icon &&
                    <img src={IconName} />
                }
                {label}
            </Button>
        </Grid>
    );
};

export default ButtonComponent;
