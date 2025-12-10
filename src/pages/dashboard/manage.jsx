import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Card,
  CardHeader,
  Typography,
  Button,
  Chip,
  Tooltip,
  Checkbox,
  ButtonGroup,
  Spinner,
} from "@material-tailwind/react";
import { AddStudent, Delete, Note } from "@/components/TripPlanner";
import {
  deleteicon,
  editicon,
  guardianicon,
  licenseimg,
  nexticon,
  previcon,
  readnoticon,
} from "@/assets";
import { EditStudent } from "@/components/Modals/EditStudent";
import { DrivingLicense } from "@/components/Modals/DrivingLicense";
import {
  DRIVERS_TABLE_HEAD,
  DRIVERS_TABLE_ROWS,
  STUDENTS_TABLE_HEAD,
  STUDENTS_TABLE_ROWS,
  STUDENTS_TABS,
} from "@/data";
import { EditDriver } from "@/components/Modals/EditDriverModal";
import { RiDeleteBin6Line } from "react-icons/ri";
import axios from "axios";

export function Manage() {
  const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:3000";
  const token = localStorage.getItem("token");

  const [selectedTab, setSelectedTab] = useState("Students");
  const [selectedOption, setSelectedOption] = useState("");
  const [openNote, setOpenNote] = useState(false);
  const [openAddStudent, setOpenAddStudent] = useState(false);
  const [openEditStudent, setOpenEditStudent] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openEditDriver, setOpenEditDriver] = useState(false);
  const [active, setActive] = useState(1);
  const [openLicense, setOpenLicense] = useState(false);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const handleOpenNote = () => setOpenNote(!openNote);
  const handleOpenAddStudent = () => setOpenAddStudent(!openAddStudent);
  const handleOpenEditStudent = () => setOpenEditStudent(!openEditStudent);
  const handleOpenDelete = () => setOpenDelete(!openDelete);
  const handleOpenLicense = () => setOpenLicense(!openLicense);
  const handleOpenEditDriver = () => setOpenEditDriver(!openEditDriver);

  const prev = () => setActive((prev) => Math.max(prev - 1, 1));
  const next = () => setActive((prev) => Math.min(prev + 1, 10));

  const [selectedAll, setSelectedAll] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [rowsToDelete, setRowsToDelete] = useState([]);

  const getStudents = async () => {
    try {
      // Try to resolve instituteId (from localStorage or stored user)
      let instituteId = null;
      const storedInstituteId = localStorage.getItem('instituteId');
      const storedUser = localStorage.getItem('user');
      if (storedInstituteId) {
        instituteId = storedInstituteId;
      } else if (storedUser) {
        try {
          const user = JSON.parse(storedUser);
          if (user.instituteId) instituteId = user.instituteId;
          else if (user.InstituteId) instituteId = user.InstituteId;
        } catch (e) {
          console.warn('Could not parse stored user for instituteId', e);
        }
      }

      if (!instituteId) {
        console.warn('No instituteId found in localStorage/user — requesting without instituteId may fail');
      }

      const apiUrl = instituteId
        ? `${BASE_URL}/school/GetStudents?InstituteId=${instituteId}`
        : `${BASE_URL}/school/GetStudents`;

      console.log('[getStudents] Requesting students from', apiUrl);

      const res = await axios.get(apiUrl, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("✅ Students fetched:", res.data);
      console.log("📋 Raw API response structure:", JSON.stringify(res.data, null, 2));

      // Handle different response formats
      const studentsArray = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data.data)
          ? res.data.data
          : [];

      console.log("📊 Students array:", studentsArray);
      if (studentsArray.length > 0) {
        console.log("🔍 First student object:", studentsArray[0]);
        console.log("🔍 First student keys:", Object.keys(studentsArray[0]));
      }

      // Map API response to table format
      const mappedStudents = studentsArray.map((student, index) => {
        // Extract name from StudentName (backend format)
        const studentName = student.StudentName || student.studentName || "";
        const nameParts = studentName.split(" ");
        const firstName = nameParts[0] || "";
        const lastName = nameParts.slice(1).join(" ") || "";
        
        return {
          id: student.StudentId || student.studentId || student.id || index + 1,
          name: firstName,
          lastname: lastName,
          grade: student.Grade || student.grade || "N/A",
          contact: student.EmergencyContact || student.emergencyContact || "N/A",
          enrollment: student.Enrollment || student.enrollment || "N/A",
          address: student.Address || student.address || "N/A",
          present: student.present !== undefined ? student.present : (student.attendanceStatus === "Present" || student.AttendanceStatus === "Present") || false,
          pickupLocation: student.pickupLocation || student.PickupLocation || student.PickUp_Location || "N/A",
          dropLocation: student.dropLocation || student.DropLocation || student.Drop_Location || "N/A",
          guardian1: student.Guardian1 || student.guardian1 || "N/A",
          guardian2: student.Guardian2 || student.guardian2 || "N/A",
          busNo: student.BusNo || student.busNo || "N/A",
          // Static defaults for fields not in API response
          drivername: "Jhon Michael",
          busanimalam: "N/A",
          busnoam: "N/A",
          busanimalpm: "N/A",
          busnopm: "N/A",
        };
      });

      console.log("✅ Mapped students:", mappedStudents);
      if (mappedStudents.length > 0) {
        console.log("🔍 First mapped student:", mappedStudents[0]);
      }

      setStudents(mappedStudents);
      setSelectedRows(mappedStudents.map(() => false));
    } catch (err) {
      console.error("❌ Error fetching students:", err);
      setStudents([]);
      setSelectedRows([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAll = () => {
    const newSelectedAll = !selectedAll;
    setSelectedAll(newSelectedAll);
    const newSelectedRows = students.map(() => newSelectedAll);
    setSelectedRows(newSelectedRows);
    setRowsToDelete(
      newSelectedRows
        .map((selected, index) =>
          selected ? students[index] : null
        )
        .filter((row) => row !== null)
    );
  };

  const handleSelectRow = (index) => {
    const newSelectedRows = [...selectedRows];
    newSelectedRows[index] = !newSelectedRows[index];
    setSelectedRows(newSelectedRows);
    setSelectedAll(newSelectedRows.every(Boolean));
    setRowsToDelete(
      newSelectedRows
        .map((selected, idx) => (selected ? students[idx] : null))
        .filter((row) => row !== null)
    );
  };

  const handleDelete = () => {
    setOpenDelete(false);
  };

  const openDeleteModal = () => {
    if (rowsToDelete.length > 0) {
      setOpenDelete(true);
    }
  };

  useEffect(() => {
    if (location.state && location.state.tab) {
      setSelectedTab(location.state.tab);
    }
  }, [location.state]);

  useEffect(() => {
    const fetchStudents = async () => {
      if (token && selectedTab === "Students") {
        await getStudents();
      }
    };
    fetchStudents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, selectedTab]);
  return (
    <section className="rounded-md mt-5 h-full bg-white p-3">
      <CardHeader
        floated={false}
        shadow={false}
        className="rounded-none bg-transparent"
      >
        <div className="flex items-center flex-wrap justify-between gap-4">
          <ButtonGroup
            className="border-2 border-[#DDDDE1]/50 rounded-[10px] outline-none p-0"
            variant="text"
            size="lg"
          >
            {["Students", "Drivers"].map((tab) => (
              <Button
                key={tab}
                className={
                  selectedTab === tab
                    ? "bg-[#C01824] hover:bg-[#C01824]/80 text-white px-6 py-3 lg:text-[14px] capitalize font-bold"
                    : "bg-white px-6 py-3 capitalize font-bold"
                }
                onClick={() => setSelectedTab(tab)}
              >
                {tab}
              </Button>
            ))}
          </ButtonGroup>

          {selectedTab === "Students" && (
            <>
              {/* <ButtonGroup className="border-2 border-[#DDDDE1]/50 flex rounded-[10px] outline-none p-0" variant="text" size='lg'>
                {STUDENTS_TABS.map(tab => (
                  <Button
                    key={tab.label}
                    className={selectedOption === tab.label ? 'bg-[#C01824] hover:bg-[#C01824]/80 flex items-center justify-center md:px-5 px-3 md:py-3 text-white font-bold text-xs md:text-[14px] capitalize' : 'bg-white flex items-center justify-center px-3 md:px-5 md:py-3 text-[#808080] text-xs md:text-[14px] capitalize font-bold'}
                    onClick={() => {
                      setSelectedOption(tab.label);
                      if (tab.label === 'Delete') {
                        openDeleteModal();
                      }
                    }}
                  >
                    {tab.label === 'Delete' && (
                      <img src={deleteicon} className="inline-block lg:h-5 lg:w-5" alt="Delete Icon" />
                    )}
                    {tab.label === 'Guardian 1' && (
                      <img src={guardianicon} className="inline-block lg:h-5 lg:w-5" alt="Guardian 1 Icon" />
                    )}
                    {tab.label === 'Guardian 2' && (
                      <img src={guardianicon} className="inline-block lg:h-5 lg:w-5" alt="Guardian 2 Icon" />
                    )}
                    {tab.label}
                  </Button>
                ))}
              </ButtonGroup> */}
              <div className="flex gap-x-3">
                <Button
                  onClick={handleOpenAddStudent}
                  className="flex items-center capitalize font-normal rounded-[6px] px-4 md:px-6 py-3 md:py-3.5 md:text-[14px] bg-[#C01824] gap-3"
                  size="md"
                >
                  Add Student
                </Button>
                <Button
                  className="flex items-center capitalize font-normal px-4 md:px-6 py-3 md:py-3.5 md:text-[14px] rounded-[6px] bg-[#C01824] gap-3"
                  size="md"
                >
                  Download Attendance Report
                </Button>
              </div>
            </>
          )}

          {selectedTab === "Drivers" && (
            <Button
              onClick={handleOpenLicense}
              variant="text"
              className="flex py-2 px-4 rounded-[6px] space-x-3 items-center border-[1px] border-[#DDDDE1]"
            >
              <img
                src={licenseimg}
                className="w-full max-w-[40px]"
                alt="License Icon"
              />
              <p className="text-[14px] text-[#141516] font-bold capitalize">
                View Driving Licenses
              </p>
            </Button>
          )}
        </div>
      </CardHeader>
      <Card className="h-full w-full rounded-md shadow-md overflow-auto mt-5">
        <table className="w-full min-w-max table-auto text-left border rounded-[4px]">
          <thead>
            <tr>
              <th className="border bg-[#EEEEEE] px-4 py-2">
                <Checkbox
                  checked={selectedAll}
                  onChange={handleSelectAll}
                  className="rounded-[4px] custom-checkbox"
                />
              </th>
              {(selectedTab === "Students"
                ? STUDENTS_TABLE_HEAD
                : DRIVERS_TABLE_HEAD
              ).map((head) => (
                <th key={head.id} className="border bg-[#EEEEEE] px-4">
                  <Typography className="font-bold text-[14px] leading-none text-[#141516]">
                    {head.label}
                  </Typography>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading && selectedTab === "Students" ? (
              <tr>
                <td colSpan={STUDENTS_TABLE_HEAD.length + 1} className="px-4 py-8 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <Spinner className="h-6 w-6 text-[#C01824]" />
                    <Typography className="mt-2 text-gray-500 text-sm">Loading students...</Typography>
                  </div>
                </td>
              </tr>
            ) : (selectedTab === "Students"
              ? students
              : DRIVERS_TABLE_ROWS
            ).length === 0 && selectedTab === "Students" ? (
              <tr>
                <td colSpan={STUDENTS_TABLE_HEAD.length + 1} className="px-4 py-8 text-center">
                  <Typography className="text-gray-500">No students found.</Typography>
                </td>
              </tr>
            ) : (
              (selectedTab === "Students"
                ? students
                : DRIVERS_TABLE_ROWS
              ).map((row, index) => {
                const isLast =
                  index ===
                  (selectedTab === "Students"
                    ? students
                    : DRIVERS_TABLE_ROWS
                  ).length -
                    1;
              const classes = isLast
                ? "px-4 py-1"
                : "px-4 py-1 border-b border-[#D9D9D9]";
              return (
                <tr key={row.id}>
                  <td className={classes}>
                    <Checkbox
                      checked={selectedRows[index]}
                      onChange={() => handleSelectRow(index)}
                      className="rounded-[4px] custom-checkbox"
                    />
                  </td>
                  <td className={classes}>
                    <Typography className="font-semibold text-[14px] leading-none text-[#141516]">
                      {row.name}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography className="font-semibold text-[14px] leading-none text-[#141516]">
                      {row.lastname}
                    </Typography>
                  </td>
                  {selectedTab === "Students" ? (
                    <>
                      <td className={classes}>
                        <Typography className="font-semibold text-[14px] leading-none text-[#141516]">
                          {row.grade}
                        </Typography>
                      </td>
                     
                      <td className={classes}>
                        <Typography className="font-semibold text-[14px] leading-none text-[#141516]">
                          {row.contact}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography className="font-semibold text-[14px] leading-none text-[#141516]">
                          {row.enrollment}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography className="font-semibold text-[14px] leading-none text-[#141516]">
                          {row.address}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Tooltip content="View Note">
                          <img
                            onClick={handleOpenNote}
                            src={readnoticon}
                            className="cursor-pointer"
                            alt="Note Icon"
                          />
                        </Tooltip>
                      </td>
                      <td className={classes}>
                        <Typography className="font-semibold text-[14px] leading-none text-[#141516]">
                          {row.drivername}
                        </Typography>
                      </td>
                  
                  <td className={classes}>
                        <Typography className="font-semibold text-[14px] leading-none text-[#141516]">
                          {row.busanimalam}
                        </Typography>
                       </td>
                       <td className={classes}>
                        <Typography className="font-semibold text-[14px] leading-none text-[#141516]">
                          {row.busnoam}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography className="font-semibold text-[14px] leading-none text-[#141516]">
                          {row.busanimalpm}
                        </Typography>
                      </td>
                        <td className={classes}>
                        <Typography className="font-semibold text-[14px] leading-none text-[#141516]">
                          {row.busnopm}
                        </Typography>
                      </td>
                       
                    
                      
                    </>
                  ) : (
                    <>
                      <td className={classes}>
                        <Typography className="font-semibold text-[14px] leading-none text-[#141516]">
                          {row.phone}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography className="font-semibold text-[14px] leading-none text-[#141516]">
                          {row.contactone}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography className="font-semibold text-[14px] leading-none text-[#141516]">
                          {row.contacttwo}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography className="font-semibold text-[14px] leading-none text-[#141516]">
                          {row.email}
                        </Typography>
                      </td>
                    </>
                  )}
                  <td className={classes}>
                    <div
                      className={`flex space-x-2 md:space-x-7 justify-start items-center`}
                    >
                      <Chip
                        variant="ghost"
                        size="sm"
                        className={
                          row.present
                            ? "bg-[#CCFAEB] text-[#0BA071] rounded-[4px] w-[81px] p-1 text-center capitalize text-[16px]"
                            : "bg-[#F6DCDE] w-[81px] text-[#C01824] rounded-[4px] px-1 text-center capitalize text-[16px]"
                        }
                        value={row.present ? "Present" : "Absent"}
                      />
                       

                      {/* {selectedRows[index] && ( */}
                      {/* <img src={editicon} onClick={handleOpenEditStudent} className="cursor-pointer" alt="Edit Icon" /> */}
                      {/* )} */}
                    </div>
                  </td>
                  
              
                  <td className={classes}>
                    {selectedTab === "Students" ? (

                     <>


                      <div className="flex items-center gap-3">
                        <img
                          src={editicon}
                          onClick={handleOpenEditStudent}
                          className="cursor-pointer"
                          alt="Edit Icon"
                        />
                        <RiDeleteBin6Line
                          size={20}
                          className="cursor-pointer text-[#C01824]"
                           onClick={handleOpenDelete}
                        />
                      </div>
                      </> 
                    ) : (
                      <div className="flex items-center gap-3">
                        <img
                          src={editicon}
                          onClick={handleOpenEditDriver}
                          className="cursor-pointer"
                          alt="Edit Icon"
                        />
                        <RiDeleteBin6Line
                          size={20}
                          className="cursor-pointer text-[#C01824]"
                         onClick={handleOpenDelete}
                        />
                      </div>
                    )}
                  </td>
                </tr>
              );
            })
            )}
          </tbody>
        </table>
        <div className="flex justify-between items-center mt-6 mb-4 px-7 py-3">
          <Typography
            color="gray"
            className="text-[#202224]/60 font-semibold text-[14px]"
          >
            Page {active} - 06 of 20
          </Typography>
          <div className="!p-0 bg-[#FAFBFD] flex justify-around items-center w-[86px] h-[33px] border border-[#D5D5D5] rounded-[12px] space-x-3">
            <img
              onClick={prev}
              disabled={active === 1}
              src={previcon}
              alt=""
              strokeWidth={2}
              className="h-[24px] w-[24px] cursor-pointer"
            />
            <img
              onClick={next}
              disabled={active === 10}
              src={nexticon}
              alt=""
              strokeWidth={2}
              className="h-[24px] w-[24px] cursor-pointer"
            />
          </div>
        </div>
      </Card>
      <Delete
        open={openDelete}
        handleOpen={handleOpenDelete}
        handleDelete={handleDelete}
        rowsToDelete={rowsToDelete}
      />
      <Note open={openNote} handleOpen={handleOpenNote} />
      <AddStudent open={openAddStudent} handleOpen={handleOpenAddStudent} refreshStudents={getStudents} />
      <EditDriver open={openEditDriver} handleOpen={handleOpenEditDriver} />
      <EditStudent open={openEditStudent} handleOpen={handleOpenEditStudent} />
      <DrivingLicense open={openLicense} handleOpen={handleOpenLicense} />
    </section>
  );
}
