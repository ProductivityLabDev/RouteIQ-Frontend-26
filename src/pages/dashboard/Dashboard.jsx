import React from "react";
import DashboardSidebar from "../../components/dashboardSidebar/DashboardSidebar";
import colors from "../../utlis/Colors";

const Dashboard = () => {
  return (
    <div style={{flex:1,backgroundColor:colors?.thickGreyColor}}>
      <DashboardSidebar />
    </div>
  );
};

export default Dashboard;
