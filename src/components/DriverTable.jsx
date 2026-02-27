import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSchoolDrivers } from '@/redux/slices/schoolDashboardSlice';
import { TableComponent } from "@/pages/dashboard";

const DriversTable = () => {
    const dispatch = useDispatch();
    const { drivers, loading } = useSelector((s) => s.schoolDashboard);

    useEffect(() => {
        dispatch(fetchSchoolDrivers());
    }, [dispatch]);

    const TABLE_HEAD = ["Name", "Phone", "Email", "Status"];

    const tableRows = loading.drivers
        ? []
        : drivers.slice(0, 10).map((d) => ({
              id: d.id,
              name: d.name || '--',
              lastname: d.phone || '--',
              grade: d.email || '--',
              contact: d.status || '--',
          }));

    return (
        <TableComponent
            title="Drivers"
            link="/dashboard/manage"
            tableHead={TABLE_HEAD}
            tableRows={tableRows}
        />
    );
};

export default DriversTable;
