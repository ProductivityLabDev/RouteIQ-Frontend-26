import { LakeviewSchoolLogo, pinicon, RosewoodSchoolLogo, SkylineSchoolLogo, SpringdaleSchoolLogo, VerticalDot, ViewMap } from '@/assets';
import MapComponent from '@/components/MapComponent';
import { TripPlannerModal } from '@/components/vendorRoutesCard/TripPlannnerModal';
import { routeStudents } from '@/data/dummyData';
import MainLayout from '@/layouts/SchoolLayout';
import { Button, ButtonGroup } from '@material-tailwind/react';
import { useState } from 'react';
import { CiSearch } from "react-icons/ci";
import { FaEllipsisVertical } from "react-icons/fa6";
import {
    FaChevronDown,
    FaChevronUp,
    FaLocationArrow,
    FaPencilAlt,
    FaSearch
} from 'react-icons/fa';
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import { RiSuitcaseLine } from 'react-icons/ri';
const RouteSchedule = () => {
    const [selectedTab, setSelectedTab] = useState('School Schedules');
    const [currentPage, setCurrentPage] = useState(1)
    const [currentTripPage, setCurrentTripPage] = useState(1)
    const [anchorEl, setAnchorEl] = useState(null);
    const [navigateMap, setNavigateMap] = useState(false)
    const [navigateTripEdit, setNavigateTripEdit] = useState(false)
    const [activePage, setActivePage] = useState(1);
    const rowsPerPage = 10
    const indexOfLastRow = currentPage * rowsPerPage
    const indexOfFirstRow = indexOfLastRow - rowsPerPage
    const open = Boolean(anchorEl);
    const handlePageChange = (event, value) => {
        setCurrentPage(value)
    }
    const handlePageTripChange = (event, value) => {
        setCurrentTripPage(value)
    }
    const handleNavigate = () => {
        setNavigateMap(true)
    }
    const handleBack = () => {
        setNavigateMap(false)
    }
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = (callback) => {
        setAnchorEl(null);
        if (callback) {
            callback();
        }
    };
    const handleTripEdit = () => {
        setNavigateTripEdit(!navigateTripEdit)
    }
    const menuItems = [
        { label: 'Edit', onClick: handleTripEdit },
    ];
    return (
        <MainLayout>
            {navigateMap ?
                <MapComponent onBack={handleBack} />
                :
                <section className='w-full h-full'>
                    <div className='flex flex-row justify-between w-[93%] h-[6vh]'>
                        <div className="flex w-full justify-between space-x-5 items-center">
                            <ButtonGroup className="border-2 border-[#DDDDE1]/50 rounded-[10px] outline-none p-0" variant="text" size='lg'>
                                {['School Schedules', 'Trip Schedules'].map(tab => (
                                    <Button
                                        key={tab}
                                        className={selectedTab === tab ? 'bg-[#C01824] hover:bg-[#C01824]/80 text-white px-6 py-3 lg:text-[14px] capitalize font-bold' : 'bg-white px-6 py-3 capitalize font-bold'}
                                        onClick={() => setSelectedTab(tab)}
                                    >
                                        {tab}
                                    </Button>
                                ))}
                            </ButtonGroup>
                            <div className="mr-auto w-72 flex flex-row md:max-w-screen-3xl md:w-[40%]  bg-white border ps-4 border-[#DCDCDC] rounded-[6px] items-center">
                                <CiSearch size={25} color='#787878' />
                                <input
                                    type='search'
                                    placeholder="Search"
                                    className='p-3 w-[98%] text-[#090909] font-light outline-none rounded-[6px] focus:outline-none focus:ring-outline-none'
                                />
                            </div>
                        </div>
                    </div>
                    <div className="bg-stone-50 p-4 min-h-screen font-sans">
                        <div className="space-y-2">
                            {/* Terminal Header */}
                            <div className="bg-white border border-gray-200 rounded shadow-sm">
                                <div className="flex items-center justify-between p-2 cursor-pointer">
                                    <div className="flex items-center gap-2">
                                        <span className="text-black text-sm">≡</span>
                                        <span className="font-semibold">Terminal</span>
                                        <FaPencilAlt className="text-gray-500 text-xs" />
                                    </div>
                                    <FaChevronUp className="text-gray-700" />
                                </div>
                            </div>

                            {/* Skyline High School */}
                            <div className="bg-white border border-gray-200 rounded shadow-sm">
                                <div className="flex items-center justify-between p-2 cursor-pointer">
                                    <div className="flex items-center gap-2">
                                        <div className="bg-yellow-500 text-white w-5 h-5 flex items-center justify-center">
                                            <img src={SkylineSchoolLogo} />
                                        </div>
                                        <span className="font-semibold">Skyline High School</span>
                                        <FaPencilAlt className="text-gray-500 text-xs" />
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="text-xs">
                                            <span className="text-gray-500">Total Students:</span> <span className="font-semibold">459</span>
                                        </div>
                                        <div className="text-xs">
                                            <span className="text-gray-500">Total Buses:</span> <span className="font-semibold">10</span>
                                        </div>
                                        <FaChevronUp className="text-gray-700" />
                                    </div>
                                </div>

                                {/* Route 1 */}
                                <div className="border-t border-gray-200">
                                    <div className="flex items-center justify-between p-2 cursor-pointer bg-gray-50">
                                        <div className="flex items-center gap-2">
                                            <span className="text-black text-sm">≡</span>
                                            <span className="font-semibold">Route 1</span>
                                            <FaPencilAlt className="text-gray-500 text-xs" />
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="text-black text-xs rounded px-2 py-0.5">
                                                School start time: 08:00AM
                                            </div>
                                            <div className="text-black text-xs rounded px-2 py-0.5">
                                                School dismissal time: 12:00PM
                                            </div>
                                            <div className="text-xs">
                                                <span className="text-black">Route Arrival Icon:</span>
                                                <span className="bg-pink-100 text-pink-500 rounded-full w-4 h-4 inline-flex items-center justify-center ml-1">
                                                    <FaLocationArrow className="text-[10px]" />
                                                </span>
                                            </div>
                                            <div className="text-xs">
                                                <span className="text-black">Route ID: 21085</span>
                                            </div>
                                            <div className="text-xs">
                                                <span className="text-black">Bus no: SD1037</span>
                                            </div>
                                            <FaChevronUp className="text-gray-700" />
                                        </div>
                                    </div>

                                    {/* Route 1 Content */}
                                    <div className="p-4 border-t border-gray-200">
                                        <div className="flex justify-between mb-4">
                                            <div className="relative w-72">
                                                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
                                                <input
                                                    type="text"
                                                    placeholder="Search"
                                                    className="pl-9 pr-4 py-1.5 w-full border border-gray-300 rounded"
                                                />
                                            </div>
                                            <div className="flex">
                                                <button className="bg-[#C01824] text-white px-4 py-1 text-sm rounded-l">All</button>
                                                <button className="bg-gray-100 text-gray-700 px-4 py-1 text-sm border-t border-b border-gray-300">AM</button>
                                                <button className="bg-gray-100 text-gray-700 px-4 py-1 text-sm border border-gray-300 rounded-r">PM</button>
                                            </div>
                                        </div>

                                        {/* Table */}
                                        <div className="border border-gray-200 rounded overflow-hidden">
                                            <table className="min-w-full divide-y divide-gray-200">
                                                <thead className="bg-[#EEEEEE]">
                                                    <tr>
                                                        <th className="px-4 py-2 text-left text-xs font-medium text-black uppercase tracking-wider">Date</th>
                                                        <th className="px-4 py-2 text-left text-xs font-medium text-black uppercase tracking-wider">Pick-up Time</th>
                                                        <th className="px-4 py-2 text-left text-xs font-medium text-black uppercase tracking-wider">Student Name</th>
                                                        <th className="px-4 py-2 text-left text-xs font-medium text-black uppercase tracking-wider">Pickup</th>
                                                        <th className="px-4 py-2 text-left text-xs font-medium text-black uppercase tracking-wider">Dropoff</th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                                                            View Map
                                                        </th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                                                            Action
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white divide-y divide-gray-200">
                                                    {routeStudents.map((student, idx) => (
                                                        <tr key={idx} className={student.highlight ? "bg-gray-100" : ""}>
                                                            <td className="px-4 py-2 text-xs">{student.date}</td>
                                                            <td className="px-4 py-2 text-xs">{student.pickupTime}</td>
                                                            <td className={`px-4 py-2 text-xs ${student.highlight ? "text-red-500" : ""}`}>
                                                                {student.studentName && student.studentName.includes('Daniel Fox') ? (
                                                                    <>
                                                                        {student.studentName.split(',').map((name, index) => (
                                                                            <div
                                                                                key={index}
                                                                                className={name.includes('Daniel Fox') ? "text-[#C01824] font-bold" : ""}
                                                                            >
                                                                                {name.trim()}
                                                                            </div>
                                                                        ))}
                                                                    </>
                                                                ) : (
                                                                    student.studentName || '-'
                                                                )}
                                                            </td>
                                                            <td className="px-4 py-2 text-xs whitespace-pre-line">
                                                                <div className="flex items-start">
                                                                    <div>
                                                                        {student.pickup ? (
                                                                            <>
                                                                                {student.pickup.split('\n')[0]}
                                                                                <br />
                                                                                <span className="text-black text-[10px]">
                                                                                    {student.pickup.split('\n')[1]}
                                                                                </span>
                                                                            </>
                                                                        ) : (
                                                                            '-'
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="px-4 py-2 text-xs whitespace-pre-line">
                                                                <div className="flex items-start justify-between">
                                                                    <div>
                                                                        {student.dropoff.split('\n')[0]}
                                                                        <br />
                                                                        <span className="text-gray-500 text-[10px]">
                                                                            {student.dropoff.split('\n')[1]}
                                                                        </span>
                                                                    </div>
                                                                    <div className="text-gray-400 ml-2">
                                                                        <FaLocationArrow className="text-[10px]" />
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="px-4 py-2 text-xs whitespace-pre-line" onClick={handleNavigate}>
                                                                <img src={ViewMap} />
                                                            </td>
                                                            <td className="px-4 py-2 whitespace-pre-line">
                                                                <FaEllipsisVertical />
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>

                                        {/* Pagination */}
                                        <div className="flex justify-center mt-4 gap-1">
                                            <button
                                                className="flex items-center justify-center h-8 w-8 rounded bg-[#919EAB] text-[#C4CDD5]"
                                                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                            >
                                                <IoChevronBack />
                                            </button>
                                            <button className={`flex items-center justify-center bg-white h-8 w-8 rounded ${currentPage === 1 ? 'text-[#C01824] border border-[#C01824]' : 'border border-[#C4C6C9] text-black'}`} onClick={() => setCurrentPage(1)}>
                                                1
                                            </button>
                                            <button className={`flex items-center justify-center bg-white h-8 w-8 rounded ${currentPage === 2 ? 'text-[#C01824] border border-[#C01824]' : 'border border-[#C4C6C9] text-black'}`} onClick={() => setCurrentPage(2)}>
                                                2
                                            </button>
                                            <button className={`flex items-center justify-center bg-white h-8 w-8 rounded ${currentPage === 3 ? 'text-[#C01824] border border-[#C01824]' : 'border border-[#C4C6C9] text-black'}`} onClick={() => setCurrentPage(3)}>
                                                3
                                            </button>
                                            <button className="w-8 h-8 flex items-center justify-center bg-gray-100 text-gray-600 border border-gray-300">
                                                ...
                                            </button>
                                            <button className={`flex items-center justify-center bg-white h-8 w-8 rounded ${currentPage === 12 ? 'text-[#C01824] border border-[#C01824]' : 'border border-[#C4C6C9] text-black'}`} onClick={() => setCurrentPage(12)}>
                                                12
                                            </button>
                                            <button
                                                className="flex items-center justify-center h-8 w-8 rounded bg-[#919EAB] text-[#C4CDD5] "
                                                onClick={() => setCurrentPage(Math.min(2, currentPage + 1))}
                                            >
                                                <IoChevronForward />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Route 2-4 (Collapsed) */}
                                {[2, 3, 4].map(routeNum => (
                                    <div key={routeNum} className="border-t border-gray-200">
                                        <div className="flex items-center justify-between p-2 cursor-pointer">
                                            <div className="flex items-center gap-2">
                                                <span className="text-black text-sm">≡</span>
                                                <span className="font-semibold">Route {routeNum}</span>
                                                <FaPencilAlt className="text-gray-500 text-xs" />
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="text-xs">
                                                    <span className="text-gray-500">Route Arrival Icon:</span>
                                                    <span className="bg-pink-100 text-pink-500 rounded-full w-4 h-4 inline-flex items-center justify-center ml-1">
                                                        <FaLocationArrow className="text-[10px]" />
                                                    </span>
                                                </div>
                                                <div className="text-xs">
                                                    <span className="text-gray-500">Route ID: 21085</span>
                                                </div>
                                                <div className="text-xs">
                                                    <span className="text-gray-500">Bus no: SD1037</span>
                                                </div>
                                                <FaChevronDown className="text-gray-700" />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Other Schools (Collapsed) */}
                            {[
                                { icon: LakeviewSchoolLogo, color: 'bg-red-600', name: 'Lakeview High School' },
                                { icon: SpringdaleSchoolLogo, color: 'bg-orange-500', name: 'Springdale Elementary School' },
                                { icon: RosewoodSchoolLogo, color: 'bg-blue-800', name: 'Rosewood Elementary School' }
                            ].map((school, idx) => (
                                <div key={idx} className="bg-white border border-gray-200 rounded shadow-sm">
                                    <div className="flex items-center justify-between p-2 cursor-pointer">
                                        <div className="flex items-center gap-2">
                                            <div className={`${school.color} text-white w-5 h-5 flex items-center justify-center`}>
                                                <img src={school.icon} />
                                            </div>
                                            <span className="font-semibold">{school.name}</span>
                                            <FaPencilAlt className="text-gray-500 text-xs" />
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="text-xs">
                                                <span className="text-gray-500">Total Students:</span> <span className="font-semibold">459</span>
                                            </div>
                                            <div className="text-xs">
                                                <span className="text-gray-500">Total Buses:</span> <span className="font-semibold">10</span>
                                            </div>
                                            <FaChevronDown className="text-gray-700" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            }
            <TripPlannerModal open={navigateTripEdit} handleOpen={handleTripEdit} isEditableTrip={true} />
        </MainLayout >
    )
}

export default RouteSchedule
