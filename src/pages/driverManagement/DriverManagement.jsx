import React, { useState } from 'react'
import MainLayout from '@/layouts/SchoolLayout'
import { Button, Typography } from '@material-tailwind/react'
import { driverMangementTableData } from '@/data/driverMangamentTableData'
import { Pagination } from '@mui/material'
import { FaRegCircleCheck } from "react-icons/fa6";
import { RxCrossCircled } from "react-icons/rx";
import { FaEllipsisVertical } from "react-icons/fa6";
import { EditDriverVendor } from './EditDriverVendor'
import MenuComponent from '@/components/MenuComponent'

const DriverManagement = () => {
    const [currentPage, setCurrentPage] = useState(1)
    const [openEditDriver, setOpenEditDriver] = useState(false);
    const [editDriver, setEditDriver] = useState(false)
    const [infractionMenu, setInfractionMenu] = useState(false)
    const [anchorEl, setAnchorEl] = useState(null);
    const [anchorEl1, setAnchorEl1] = useState(null);
    const open = Boolean(anchorEl);
    const openInfraction = Boolean(anchorEl1);
    const rowsPerPage = 10

    const indexOfLastRow = currentPage * rowsPerPage
    const indexOfFirstRow = indexOfLastRow - rowsPerPage
    const currentRows = driverMangementTableData.slice(indexOfFirstRow, indexOfLastRow)

    const handlePageChange = (event, value) => {
        setCurrentPage(value)
    }
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
        setInfractionMenu(false)
    };

    const handleClose = (callback) => {
        setAnchorEl(null);
        if (callback) {
            callback();
        }
    };
    const handleInfractionClick = (event) => {
        console.log("pressed it ", event);
        if (event) {
            setAnchorEl1(event.currentTarget);
            setInfractionMenu(true);
        } else {
            console.error("Event is undefined");
        }
    };


    const handleInfractionClose = (callback) => {
        setAnchorEl1(null);
        setInfractionMenu(false)
        if (callback) {
            callback();
        }
    };
    const handleDriverEdit = () => {
        setEditDriver(true)
        setOpenEditDriver(!openEditDriver)

    }
    const handleOpenEditDriver = () => {
        setOpenEditDriver(!openEditDriver)
        setEditDriver(false)
    }
    const menuItems = [
        { label: 'Download License', onClick: () => console.log('Profile Clicked') },
        { label: 'Infraction', onClick: handleInfractionClick },
        { label: 'Edit', onClick: handleDriverEdit },
    ];
    const menuItemsInfraction = [
        { label: 'Date:', value: '02-12-2023' },
        { label: 'Status:', value: 'Pending' },
        { label: 'Type:', value: "Signal Break" },
    ];
    return (
        <MainLayout>
            <section className='w-full h-full'>
                <div className="flex w-[96%] justify-between flex-row h-[65px] mb-3 items-center">
                    <Typography className="text-[23px] md:text-[32px] font-[700] text-[#000] mt-5 ps-2" sx={{ fontSize: { xs: '23px', md: '38px' }, fontWeight: 800 }}>Driver Management</Typography>
                    <Button className="mt-8 px-8 py-2.5 bg-[#C01824] text-[14px] capitalize rounded-[6px]" variant='filled' size='lg' onClick={handleOpenEditDriver}>
                        Add Driver
                    </Button>
                </div>
                {/* ------------------------------ Table Content ------------------------------ */}
                <div className="bg-white rounded-lg shadow-md p-4 w-[100%] h-[100vh]">
                    <div className="overflow-x-auto mt-4 border border-gray-200 rounded h-[90vh]">
                        <table className="min-w-full">
                            <thead className="bg-[#EEEEEE] items-center self-center">
                                <tr>
                                    <th className="border-b text-center text-[13px] font-bold text-black">
                                        Name
                                    </th>
                                    <th className="border-b text-center text-[13px] font-bold text-black">
                                        Address
                                    </th>
                                    <th className="border-b text-center text-[13px] font-bold text-black">
                                        City
                                    </th>
                                    <th className="border-b text-center text-[13px] font-bold text-black">
                                        State
                                    </th>
                                    <th className="border-b text-center text-[13px] font-bold text-black">
                                        Zip
                                    </th>
                                    <th className="border-b text-center text-[13px] font-bold text-black">
                                        Date of Birth
                                    </th>
                                    <th className="border-b text-center text-[13px] font-bold text-black">
                                        Email
                                    </th>
                                    <th className="border-b text-center text-[13px] font-bold text-black">
                                        Pay Grade
                                    </th>
                                    <th className="border-b text-center text-[13px] font-bold text-black">
                                        Pay Rate
                                    </th>
                                    <th className="border-b text-center text-[13px] font-bold text-black">
                                        Pay Rate Changes
                                    </th>
                                    <th className="border-b text-center text-[13px] font-bold text-black">
                                        Terminal Assigned To
                                    </th>
                                    <th className="border-b text-center text-[13px] font-bold text-black">
                                        Fuel Card Code
                                    </th>
                                    <th className="border-b text-center text-[13px] font-bold text-black">
                                        App User Name
                                    </th>
                                    <th className="border-b text-center text-[13px] font-bold text-black">
                                        App Password
                                        Reset
                                    </th>
                                    <th className="border-b text-center text-[13px] font-bold text-black">
                                        App Status
                                    </th>
                                    <th className="border-b text-center text-[13px] font-bold text-black">
                                        Availability
                                    </th>
                                    <th className="border-b text-center text-[13px] font-bold text-black">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {driverMangementTableData.map((driver, index) => (
                                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                        <td className="px-6 py-2 border-b text-[14px] font-[600] text-[#141516]">
                                            {driver.name}
                                        </td>
                                        <td className="px-6 py-2 border-b text-[14px] font-[600] text-[#141516]">
                                            {driver.address}
                                        </td>
                                        <td className="px-6 py-2 border-b text-[14px] font-[600] text-[#141516]">
                                            {driver.city}
                                        </td>
                                        <td className="px-6 py-2 border-b text-[14px] font-[600] text-[#141516]">
                                            {driver.state}
                                        </td>
                                        <td className="px-6 py-2 border-b text-[14px] font-[600] text-[#141516]">
                                            {driver.zip}
                                        </td>
                                        <td className="px-6 py-2 border-b text-[14px] font-[600] text-[#141516]">
                                            {driver.dateofBirth}
                                        </td>
                                        <td className="px-3 text-center py-2 border-b text-[14px] font-[600] text-[#141516]">
                                            {driver.email}
                                        </td>
                                        <td className="px-6 py-2 border-b text-[14px] font-[600] text-[#141516]">
                                            {driver.payGrade}
                                        </td>
                                        <td className="px-6 py-2 border-b text-[14px] font-[600] text-[#141516]">
                                            {driver.payRate}
                                        </td>
                                        <td className="px-6 py-2 border-b text-[14px] font-[600] text-[#141516]">
                                            {driver.payRateChanges}
                                        </td>
                                        <td className="px-6 py-2 border-b text-[14px] font-[600] text-[#141516]">
                                            {driver.terminalAssignedTo}
                                        </td>
                                        <td className="px-6 py-2 border-b text-[14px] font-[600] text-[#141516]">
                                            {driver.fuelCardCode}
                                        </td>
                                        <td className="px-6 py-2 border-b text-[14px] font-[600] text-[#141516]">
                                            {driver.appUserName}
                                        </td>
                                        <td className="px-6 py-2 border-b text-[14px] font-[700] text-[#C01824]">
                                            {driver.appPasswordReset}
                                        </td>
                                        <td className="px-6 py-2 border-b text-sm font-medium justify-center items-center">
                                            <div
                                                className={`${driver.appStatus === 'Active' ? 'bg-[#36D56D]' : 'bg-[#C01824]'
                                                    } w-[85px] h-[29px] justify-center items-center text-center self-center rounded-[30px] flex flex-row gap-2`}
                                            >
                                                {driver.appStatus === 'Active' &&
                                                    <FaRegCircleCheck size={15} color='#fff' />
                                                }
                                                <span
                                                    className={`justify-center items-center text-center text-[#fff]`}
                                                >
                                                    {driver.appStatus}
                                                </span>
                                                {driver?.appStatus === 'Inactive' &&
                                                    <RxCrossCircled size={15} color='#fff' />
                                                }
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 border-b text-sm font-medium justify-center items-center">
                                            <div className={`${driver.availability === 'Present' ? 'bg-[#CCFAEB]' : 'bg-[#F6DCDE]'} w-[81px] h-[29px] justify-center items-center text-center pt-1 rounded-md`}>
                                                <span className={`justify-center items-center text-center ${driver.availability === 'Present' ? 'text-[#0BA071]' : 'text-[#C01824]'}`}>
                                                    {driver.availability}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-2 border-b text-[14px] font-[700]">
                                            <FaEllipsisVertical onClick={handleClick} />
                                        </td>
                                    </tr>
                                ))}
                                <MenuComponent
                                    anchorEl={anchorEl}
                                    open={open}
                                    handleClose={handleClose}
                                    menuItems={menuItems}
                                />
                            </tbody>
                        </table>
                    </div>
                    <MenuComponent
                        anchorEl={anchorEl1}
                        open={openInfraction}
                        handleClose={handleInfractionClose}
                        menuItems={menuItemsInfraction}
                        infractionMenu={infractionMenu}
                    />
                    <div className='w-full flex justify-end'>
                        <Pagination
                            count={Math.ceil(driverMangementTableData.length / rowsPerPage)}
                            page={currentPage}
                            onChange={handlePageChange}
                            className="mt-4"
                        />
                    </div>
                </div>
            </section>
            <EditDriverVendor open={openEditDriver} handleOpen={handleOpenEditDriver} editDriver={editDriver} />
        </MainLayout>
    )
}

export default DriverManagement
