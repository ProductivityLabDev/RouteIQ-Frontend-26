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
import VendorGlobalModal from "@/components/Modals/VendorGlobalModal";
import InviteManagementPanel from "@/components/invites/InviteManagementPanel";
import { useDispatch, useSelector } from "react-redux";
import { fetchVendorStats } from "@/redux/slices/vendorDashboardSlice";
import { vendorService } from "@/services/vendorService";

const SchoolDashboard = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [visibleWidgets, setVisibleWidgets] = useState(() => {
    try {
      const raw = JSON.parse(localStorage.getItem("vendorDashboardWidgets") || "null");
      return raw || {
        vehiclesCard: true,
        schoolsCard: true,
        tripsCard: true,
        schoolsTable: true,
        routesTable: true,
        invoicesTable: true,
        driversTable: true,
      };
    } catch (error) {
      return {
        vehiclesCard: true,
        schoolsCard: true,
        tripsCard: true,
        schoolsTable: true,
        routesTable: true,
        invoicesTable: true,
        driversTable: true,
      };
    }
  });
  const dispatch = useDispatch();
  const { stats, loading } = useSelector((s) => s.vendorDashboard);
  const rawName = useSelector((s) => s.user?.user?.nameAndTitle || s.user?.user?.fullName || s.user?.user?.name || s.user?.user?.username || s.user?.user?.email || '');
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

  const handleSaveDashboardWidgets = (nextWidgets) => {
    setVisibleWidgets(nextWidgets);
    localStorage.setItem("vendorDashboardWidgets", JSON.stringify(nextWidgets));
  };

  return (
    <MainLayout>
      {isEditing ? (
        <EditDashboard
          onBack={handleBackClick}
          visibleWidgets={visibleWidgets}
          onSave={handleSaveDashboardWidgets}
        />
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
            {visibleWidgets.vehiclesCard && (
              <Grid item xs={12} md={4}>
                <CustomCardComponent
                  title="No. Of Vehicle"
                  value={loading.stats ? "..." : (stats?.vehicles?.total ?? "--")}
                  change={stats ? `${stats.vehicles.inactive} Vehicles Inactive` : ""}
                />
              </Grid>
            )}
            {visibleWidgets.schoolsCard && (
              <Grid item xs={12} md={4}>
                <CustomCardComponent
                  title="No. Of Schools"
                  value={loading.stats ? "..." : (stats?.schools?.total ?? "--")}
                  change={stats ? `${stats.schools.pending} Schools Pending` : ""}
                />
              </Grid>
            )}
            {visibleWidgets.tripsCard && (
              <Grid item xs={12} md={4}>
                <CustomCardComponent
                  title="Total Trips"
                  value={loading.stats ? "..." : (stats?.trips?.total ?? "--")}
                  change={stats ? `${stats.trips.pending} Pending Trips` : ""}
                />
              </Grid>
            )}
          </Grid>

          {/* Rest of the dashboard layout */}
          <Grid container spacing={3} mt={2} pl={3} pr={3}>
            {(visibleWidgets.schoolsTable || visibleWidgets.routesTable) && (
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
                {visibleWidgets.schoolsTable && <SchoolTable />}
                {visibleWidgets.routesTable && <RoutesCard />}
              </Grid>
            )}

            {(visibleWidgets.invoicesTable || visibleWidgets.driversTable) && (
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
                {visibleWidgets.invoicesTable && <Invoices />}
                {visibleWidgets.driversTable && <DriversCard />}
              </Grid>
            )}
          </Grid>
        </div>
      )}
      <VendorGlobalModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={'Invite Link'}
        contentClassName="!w-full max-w-[1100px]"
      >
        <InviteManagementPanel
          compact
          title="Send Team Invite"
          description="Invite drivers, dispatchers, and employees directly from the vendor dashboard."
          roleOptions={[
            { value: "DRIVER", label: "Driver" },
            { value: "DISPATCHER", label: "Dispatcher" },
            { value: "EMPLOYEE", label: "Employee" },
          ]}
          loadInvites={async () => {
            const response = await vendorService.getInvites();
            return response.data;
          }}
          createInvite={vendorService.createInvite}
          deleteInvite={vendorService.deleteInvite}
          submitLabel="Send Invite"
          emptyMessage="No vendor invites have been sent yet."
        />
      </VendorGlobalModal>
    </MainLayout>
  );
};

export default SchoolDashboard;
