import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { Grid, useMediaQuery } from "@mui/material";
import { accessManagement, accounting, accountingWhite, billing, billingWhite, calendar, calendarWhite, chatMonatring, chatMonatringWhiteIcon, dashboard, documentIcon, documentWhiteIcon, driverManagementWhite, driverMangement, employeeManagement, employeeManagementWhite, feedbackIcon, feedbackIconWhite, GLCodes, GLCodesInactive, gridWeb, logo, realTimeTracking, realTimeTrackingWhiteIcon, routeManagementWhite, routeMangement, schoolManagementWhite, schoolMangement, usersGroup, usresGroupWhite, vechileWhite, Vehicle } from "@/assets";
import colors from "@/utlis/Colors";
import { useLocation, useNavigate } from "react-router-dom";

const DashboardSidebar = () => {
    const [activeIndex, setActiveIndex] = useState(null);
    const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));
    const location = useLocation();
    const navigate = useNavigate()
    const handleListItemClick = (index, path) => {
        setActiveIndex(index);
        navigate(path);
    };

    const menuItems = [
        {
            text: "Dashboard",
            imageUrl: gridWeb,
            activeImageUrl: dashboard,
            path: "/dashboard",
        },
        {
            text: "Vehicle Management",
            imageUrl: Vehicle,
            activeImageUrl: vechileWhite,
            path: "/vehicleManagement",
        },
        {
            text: "Employee Management",
            imageUrl: employeeManagement,
            activeImageUrl: employeeManagementWhite,
            path: "/EmployeeManagement",
        },
        {
            text: "School Management",
            imageUrl: schoolMangement,
            activeImageUrl: schoolManagementWhite,
            path: "/SchoolManagement",
        },
        // {
        //     text: "Students Management",
        //     imageUrl: usersGroup,
        //     activeImageUrl: usresGroupWhite,
        //     path: "/StudentManagement",
        // },
        {
            text: "Route Management",
            imageUrl: routeMangement,
            activeImageUrl: routeManagementWhite,
            path: "/RouteManagement",
        },
        {
            text: "Real-Time Tracking",
            imageUrl: realTimeTracking,
            activeImageUrl: realTimeTrackingWhiteIcon,
            path: "/RealTimeTracking",
        },
        {
            text: "Route Scheduling",
            imageUrl: calendar,
            activeImageUrl: calendarWhite,
            path: "/RouteSchedule",
        },
        {
            text: "Chat Monitoring",
            imageUrl: chatMonatring,
            activeImageUrl: chatMonatringWhiteIcon,
            path: "/vendorChat",
        },
        {
            text: "Accounting",
            imageUrl: accounting,
            activeImageUrl: accountingWhite,
            path: "/accounting",
        },
        {
            text: "Access Management",
            imageUrl: accessManagement,
            activeImageUrl: accountingWhite,
            path: "/accessManagement",
        },
        {
            text: "Documents",
            imageUrl: documentIcon,
            activeImageUrl: documentWhiteIcon,
            path: "/documents",
        },
        // {
        //     text: "GL Codes",
        //     imageUrl: GLCodesInactive,
        //     activeImageUrl: GLCodes,
        //     path: "/GlCodes",
        // },
        {
            text: "Feedback",
            imageUrl: feedbackIcon,
            activeImageUrl: feedbackIconWhite,
            path: "/feedback",
        },
    ];
    useEffect(() => {
        const currentPath = location.pathname;
        const newActiveIndex = menuItems.findIndex(item => item.path === currentPath);
        setActiveIndex(newActiveIndex >= 0 ? newActiveIndex : null);
    }, [location.pathname]);
    return (
        <Box
            sx={{
                width: isSmallScreen ? "100%" : 300,
                padding: 2,
                position: "fixed",
                height: "100%",
                overflowY: "scroll",
                backgroundColor: colors?.whiteColor,
                scrollbarWidth: "none",
                "&::-webkit-scrollbar": {
                    display: "none",
                },
            }}
            role="presentation"
        >
            <div className="justify-center self-center flex h-[12vh]">
                <img src={logo} className='w-full max-w-[180px] md:max-w-[200px] pt-10 mb-10 justify-center self-center' />
            </div>
            <List>
                {menuItems.map((item, index) => (
                    <ListItem key={item?.text} disablePadding sx={{ gap: 2 }}>
                        <Grid
                            className="grid-element"
                            sx={{
                                backgroundColor:
                                    activeIndex === index ? colors?.redColor : "unset",
                                display: "flex",
                                width: 5,
                                height: 45,
                                marginBottom: 2,
                            }}
                        />
                        <ListItemButton
                            sx={{
                                paddingLeft: "20px",
                                backgroundColor:
                                    activeIndex === index ? colors?.redColor : "unset",
                                color: activeIndex === index ? colors?.whiteColor : "unset",
                                borderRadius: 2,
                                "& .grid-element": {
                                    backgroundColor:
                                        activeIndex === index ? colors?.redColor : "unset",
                                },
                                "&:hover": {
                                    backgroundColor: activeIndex === index ? colors?.redColor : "white",
                                },
                                marginBottom: 2,
                            }}
                            onClick={() => handleListItemClick(index, item.path)}
                        >
                            <img
                                src={
                                    activeIndex === index ? item?.activeImageUrl : item?.imageUrl
                                }
                                alt={item?.text}
                                style={{
                                    marginRight: 8,
                                    width: 24,
                                    height: 24,
                                    transition: "0.3s ease",
                                }}
                            />

                            <ListItemText primary={item?.text} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    );
};

export default DashboardSidebar;
