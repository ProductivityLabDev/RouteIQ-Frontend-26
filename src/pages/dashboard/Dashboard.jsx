import React, { useState, useEffect } from "react";
import { Grid, Typography } from "@mui/material";
import MainLayout from "@/layouts/SchoolLayout";
import CustomCardComponent from "@/components/customCards/CustomCard";
import SchoolTable from "@/components/SchoolTable";
import ButtonComponent from "@/components/buttons/CustomButton";
import colors from "@/utlis/Colors";
import RoutesCard from "@/components/RoutesCard";
import DriversCard from "@/components/DriversCard";
import Invoices from "@/components/Invoices";
import EditDashboard from "./EditDashboard";
import { editIcon, linkIcon } from "@/assets";
import GlobalModal from "@/components/Modals/GlobalModal";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchVendorStats } from "@/redux/slices/vendorDashboardSlice";

const SchoolDashboard = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { stats, loading } = useSelector((s) => s.vendorDashboard);
  const rawName = useSelector((s) => s.user?.user?.name || s.user?.user?.email || '');
  const vendorName = rawName.includes('@')
    ? rawName.split('@')[0].split('.')[0].replace(/^\w/, (c) => c.toUpperCase())
    : rawName;

  useEffect(() => {
    dispatch(fetchVendorStats());
  }, [dispatch]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleBackClick = () => {
    setIsEditing(false);
  };

  const handleModalBtn = () => {
    setIsModalOpen(false);
    navigate('/accessManagement');
  };

  return (
    <MainLayout>
      {isEditing ? (
        <EditDashboard onBack={handleBackClick} />
      ) : (
        <div style={{ width: "100%", height: "100vh", marginTop: 12 }}>
          <div className="flex w-[98.3%] justify-between flex-row h-[65px] mb-3 items-center">
            <Typography
              className="text-[23px] md:text-[38px] mt-5 ps-2"
              sx={{ fontSize: { xs: '23px', md: '20px'}, fontWeight: 700 }}
            >
              Good Morning, {vendorName}
            </Typography>

            <div className="flex flex-row gap-6 md:gap-5">
              <ButtonComponent
                label="Invite Link"
                Icon={true}
                sx={{
                  backgroundColor: colors.redColor,
                  width: "300px",
                  "&:hover": {
                    backgroundColor: colors.redColor,
                  },
                  textTransform: 'none'
                }}
                IconName={linkIcon}
                onClick={handleOpenModal}
              />
              <ButtonComponent
                label="Edit Dashboard"
                Icon={true}
                sx={{
                  backgroundColor: colors.redColor,
                  width: "300px",
                  "&:hover": {
                    backgroundColor: colors.redColor,
                  },
                  textTransform: 'none'
                }}
                IconName={editIcon}
                onClick={handleEditClick}
              />
            </div>
          </div>

          {/* Updated Card Layout */}
          <Grid container spacing={3} mt={2} pl={3} pr={3}>
            <Grid item xs={12} md={4}>
              <CustomCardComponent
                title="No. Of Vehicle"
                value={loading.stats ? "..." : (stats?.vehicles?.total ?? "--")}
                change={stats ? `${stats.vehicles.inactive} Vehicles Inactive` : ""}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <CustomCardComponent
                title="No. Of Schools"
                value={loading.stats ? "..." : (stats?.schools?.total ?? "--")}
                change={stats ? `${stats.schools.pending} Schools Pending` : ""}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <CustomCardComponent
                title="Total Trips"
                value={loading.stats ? "..." : (stats?.trips?.total ?? "--")}
                change={stats ? `${stats.trips.pending} Pending Trips` : ""}
              />
            </Grid>
          </Grid>

          {/* Rest of the dashboard layout */}
          <Grid container spacing={3} mt={2} pl={3} pr={3}>
            <Grid
              item
              xs={12}
              sx={{
                width: "100%",
                display: "flex",
                flexDirection: "row",
                gap: 2,
                flexWrap: "wrap",
              }}
            >
              <SchoolTable />
              <RoutesCard />
            </Grid>

            <Grid
              item
              xs={12}
              sx={{
                width: "100%",
                display: "flex",
                flexDirection: "row",
                gap: 2,
                marginBottom: 5,
                flexWrap: "wrap",
              }}
            >
              <Invoices />
              <DriversCard />
            </Grid>
          </Grid>
        </div>
      )}
      <GlobalModal
        isOpen={isModalOpen}
        btnClose={handleModalBtn}
        onClose={() => setIsModalOpen(false)}
        title={'Invite Link'}
      />
    </MainLayout>
  );
};

export default SchoolDashboard;
