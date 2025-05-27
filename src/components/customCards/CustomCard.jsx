import React from "react";
import { Card, CardContent, Typography, Box, IconButton } from "@mui/material";
import { styled } from "@mui/system";
import { VerticalDot, cardBar, vendorBar } from "@/assets";

const CustomCard = styled(Card)(({ theme }) => ({
    padding: theme.spacing(2),
    borderRadius: 12,
    boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.05)",
    backgroundColor: "#FFFFFF",
    position: "relative",
    minWidth: '100%',
    maxWidth: '100%',
    [theme.breakpoints.up('sm')]: {
        minWidth: 320,
        maxWidth: 420,
    },
    [theme.breakpoints.up('md')]: {
        minWidth: 340,
        maxWidth: 440,
    },
    [theme.breakpoints.up('lg')]: {
        minWidth: 370,
        maxWidth: 480,
    },
    [theme.breakpoints.up('xl')]: {
        minWidth: 380,
        maxWidth: 480,
    },
}));

const CardHeader = styled(Box)(({ theme }) => ({
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: theme.spacing(1),
}));

const Title = styled(Typography)(({ theme }) => ({
    fontSize: "1.5rem",
    fontWeight: 800,
    color: "#1A202C",
}));

const Value = styled(Typography)(({ theme }) => ({
    fontSize: "2.5rem",
    fontWeight: 700,
}));

const StatChange = styled(Typography)(({ theme }) => ({
    color: "#C01824",
    fontWeight: 800,
    fontSize: "0.85rem",
    marginTop: theme.spacing(0.5),
}));

const CustomCardComponent = ({ title, value, change }) => {
    return (
        <CustomCard>
            <CardHeader>
                {/* <IconButton
                    size="small"
                    color="inherit"
                    sx={{
                        padding: 0,
                        "&:hover": {
                            backgroundColor: "transparent",
                        },

                    }}
                >
                    <img src={VerticalDot} alt="Options" />
                </IconButton> */}
            </CardHeader>
            <CardContent sx={{
                padding: theme => theme.spacing(2),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexDirection: {
                    xs: 'column',
                    sm: 'row'
                }
            }}>
                <Box>
                    <Title>{title}</Title>
                    <Value>{value}</Value>
                    <StatChange>{change}</StatChange>
                </Box>
                <img src={vendorBar} style={{ width: 79, height: 55 }} alt="Card Bar" />
            </CardContent>
        </CustomCard>
    );
};

export default CustomCardComponent;
