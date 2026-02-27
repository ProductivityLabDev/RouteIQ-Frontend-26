import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSchoolStudents } from '@/redux/slices/schoolDashboardSlice';
import { TableComponent } from "@/pages/dashboard";

const StudentsTable = () => {
    const dispatch = useDispatch();
    const { students, loading } = useSelector((s) => s.schoolDashboard);

    useEffect(() => {
        dispatch(fetchSchoolStudents());
    }, [dispatch]);

    const TABLE_HEAD = ["First Name", "Last Name", "Grade", "Emergency Contact"];

    const tableRows = loading.students
        ? []
        : students.slice(0, 10).map((s) => ({
              id: s.id,
              name: s.firstName || '--',
              lastname: s.lastName || '--',
              grade: s.grade || '--',
              contact: s.emergencyContact || '--',
          }));

    return (
        <TableComponent
            title="Students"
            link="/dashboard/manage"
            tableHead={TABLE_HEAD}
            tableRows={tableRows}
        />
    );
};

export default StudentsTable;
