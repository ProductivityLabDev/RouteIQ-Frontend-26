import React, { useEffect, useState } from 'react';
import MainLayout from '@/layouts/SchoolLayout';
import { Button, Typography, Spinner } from '@material-tailwind/react';
import { FaEllipsisVertical } from 'react-icons/fa6';
import { studentData as initialStudentData } from '@/data/vendor-students-data';
import { NoteIcon, profileavatar } from '@/assets';
import MenuComponent from '@/components/MenuComponent';
import { StudentManagementModal } from './StudentManagementModal';
import StudentNoticeModal from './StudentNoticeModal';
import { useLocation, useNavigate } from 'react-router-dom';
import { GrDocumentCsv } from "react-icons/gr";
import { useDispatch } from 'react-redux';
import { fetchStudentsByInstitute } from '@/redux/slices/studentSlice';



const Students = () => {
  const dispatch = useDispatch();
  const [anchorEl1, setAnchorEl1] = useState(null);
  const [openStudentModal, setOpenStudentModal] = useState(false);
  const [openStudentNoticeModal, setOpenStudentNoticeModal] = useState(false);
  const [editStudentModal, setStudentModal] = useState(false);
  const [noticeState, setNoticeState] = useState(false);
  const [studentEditData, setStudentEditData] = useState(null);
  // will be filled from API – no static rows
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { instituteId, schoolName } = location.state || {};

  // When coming from School Management with an instituteId, fetch students for that school
  useEffect(() => {
    const loadStudents = async () => {
      if (!instituteId) return;

      try {
        setLoading(true);
        console.log('[Students] Loading students for instituteId:', instituteId);
        const result = await dispatch(fetchStudentsByInstitute(instituteId));
        if (fetchStudentsByInstitute.fulfilled.match(result)) {
          const apiStudents = result.payload || [];
          console.log('[Students] API students from slice:', apiStudents);

          const mapped = apiStudents.map((student, index) => ({
            id: student.StudentId || index + 1,
            // default human avatar icon for Photo column
            studentPic: profileavatar,
            studentName: student.StudentName || '',
            busNo: student.BusNo || '',
            routeNo: student.RouteNo || '',
            grade: student.Grade || '',
            emergencyContactName: student.EmergencyContactName || '',
            emergencyPhone: student.EmergencyContact || '',
            enrollment: student.Enrollment || '',
            address: student.Address || '',
          }));

          console.log('[Students] Mapped students for table:', mapped);
          setStudents(mapped);
        }
      } catch (e) {
        console.error('Error loading students by institute:', e);
      } finally {
        setLoading(false);
      }
    };

    loadStudents();
  }, [dispatch, instituteId]);

  const openInfraction = Boolean(anchorEl1);

  const handleClick = (event, student) => {
    setAnchorEl1(event.currentTarget);
    setStudentEditData(student);
  };

  const handleClose = (callback) => {
    setAnchorEl1(null);
    if (callback) callback();
  };

  const handleStudentModal = () => {
    setStudentModal(false);
    setOpenStudentModal(!openStudentModal);
    setStudentEditData(null);
  };

  const handleOpenEditStudentModal = () => {
    setOpenStudentModal(true);
    setStudentModal(true);
    handleClose(); // Close menu
  };

const handleDeleteStudent = () => {
  if (!studentEditData) return;
  setStudents(prev => prev.filter(s => s.id !== studentEditData.id));
  setAnchorEl1(null);
};

  const handleStudentNoticeModal = () => {
    setOpenStudentNoticeModal(!openStudentNoticeModal);
    setNoticeState(false);
    setStudentEditData(null);
  };

  const handleNotice = () => {
    setOpenStudentNoticeModal(!openStudentNoticeModal);
    setNoticeState(true);
  };

const menuItems = [
  { label: 'Edit', onClick: handleOpenEditStudentModal },
  { label: 'Delete', onClick: handleDeleteStudent },
];

  return (
    <MainLayout>
      <section className="w-full h-full">
        <div className="flex w-full justify-between flex-row h-[65px] mb-3 items-center">
          <Typography className="text-[23px] md:text-[32px] font-[700] text-[#000] mt-5 ps-2">
            {schoolName ? `Students - ${schoolName}` : 'Students'}
          </Typography>
          <div className="flex justify-end gap-3 flex-row">
            <Button
              className="mt-8 px-8 py-2.5 bg-[#C01824] text-[14px] capitalize rounded-[6px]"
              onClick={() => navigate('/SchoolManagement')}
            >
              School Management
            </Button>
            <Button
              className="mt-8 px-8 py-2.5 bg-[#C01824] text-[14px] capitalize rounded-[6px]"
              onClick={handleStudentModal}
            >
              Add Student
            </Button>
            <Button className="mt-8 px-8 py-2.5 bg-[#C01824] text-[14px] capitalize rounded-[6px] flex items-center gap-2">
            <GrDocumentCsv width={80} hanging={80}/>
            Import File
            </Button>
          </div>
        </div>

        <div className="w-full mt-5 p-4 bg-white rounded-[4px] border shadow-sm h-[80vh]">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full">
              <Spinner className="h-8 w-8 text-[#C01824]" />
              <Typography className="mt-3 text-sm text-gray-500">
                Loading students...
              </Typography>
            </div>
          ) : (
          <div className="overflow-x-auto mt-3 border border-gray-200 rounded h-[75vh]">
            <table className="min-w-full">
              <thead className="bg-[#EEEEEE]">
                <tr>
                  {[
                    'Photo',
                    'Student Name',
                     'Bus No',
                    'Route No',
                    'Grade',
                    'Emergency Contact Name',
                    'Emergency Contact',
                    'Enrollment No',
                    'Address',
                  ].map((header) => (
                    <th
                      key={header}
                      className="px-6 py-3 border-b text-left text-sm font-bold text-black"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {students.map((student, index) => (
                  <tr key={student.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-2 border-b text-sm">
                      <img
                        src={student.studentPic}
                        className="w-9 h-9 rounded-full object-cover border border-gray-200"
                        alt="student"
                      />
                    </td>
                    <td className="px-6 py-2 border-b text-sm">{student.studentName || 'N/A'}</td>
                    <td className="px-6 py-2 border-b text-sm">{student.busNo || 'N/A'}</td>
                    <td className="px-6 py-2 border-b text-sm">{student.routeNo || 'N/A'}</td>
                    <td className="px-6 py-2 border-b text-sm">{student.grade || 'N/A'}</td>
                    <td className="px-6 py-2 border-b text-sm">{student.emergencyContactName || 'N/A'}</td>
                    <td className="px-6 py-2 border-b text-sm">{student.emergencyPhone || 'N/A'}</td>
                    <td className="px-6 py-2 border-b text-sm">{student.enrollment || 'N/A'}</td>
                    <td className="px-6 py-2 border-b text-sm">{student.address || 'N/A'}</td>
                    {/* <td className="px-6 py-2 border-b text-sm">
                      {student?.isAdmin ? student.medicalDetails : '••••••'}
                    </td> */}
                    {/* <td className="px-6 py-2 border-b text-sm text-center">
                      <img
                        src={NoteIcon}
                        onClick={handleNotice}
                        className="cursor-pointer inline-block"
                      />
                    </td> */}
                    {/* <td className="px-6 py-2 border-b text-sm">
                      <div><strong>Name:</strong> {student.contact1?.name || 'N/A'}</div>
                      <div><strong>Relation:</strong> {student.contact1?.relationship || 'N/A'}</div>
                      <div><strong>Phone:</strong> {student.contact1?.phone || 'N/A'}</div>
                    </td> */}
                    {/* <td className="px-6 py-2 border-b text-sm">
                      <div><strong>Name:</strong> {student.contact2?.name || 'N/A'}</div>
                      <div><strong>Relation:</strong> {student.contact2?.relationship || 'N/A'}</div>
                      <div><strong>Phone:</strong> {student.contact2?.phone || 'N/A'}</div>
                    </td> */}
                    {/* <td className="px-6 py-2 border-b text-sm">
                      <div
                        className={`${
                          student.attendanceStatus === 'Present' ? 'bg-[#CCFAEB]' : 'bg-[#F6DCDE]'
                        } w-fit px-2 py-1 rounded text-center`}
                      >
                        <span
                          className={`${
                            student.attendanceStatus === 'Present'
                              ? 'text-[#0BA071]'
                              : 'text-[#C01824]'
                          }`}
                        >
                          {student.attendanceStatus}
                        </span>
                      </div>
                    </td> */}
                    {/* <td className="px-6 py-2 border-b text-sm text-center">
                      <img
                        src={NoteIcon}
                        className="cursor-pointer inline-block"
                        onClick={handleStudentNoticeModal}
                      />
                    </td> */}
                    {/* <td className="px-6 py-2 border-b text-sm">
                      <FaEllipsisVertical
                        className="cursor-pointer"
                        onClick={(event) => handleClick(event, student)}
                      />
                    </td> */}
                  </tr>
                ))}
                <MenuComponent
                  anchorEl={anchorEl1}
                  open={openInfraction}
                  handleClose={handleClose}
                  menuItems={menuItems}
                />
              </tbody>
            </table>
          </div>
          )}
        </div>
      </section>

      <StudentNoticeModal
        open={openStudentNoticeModal}
        handleOpen={handleStudentNoticeModal}
        noticeState={noticeState}
      />
      <StudentManagementModal
        open={openStudentModal}
        handleOpen={handleStudentModal}
        editDriver={editStudentModal}
        studentEditData={studentEditData}
        refreshStudents={() => {
          // Add refresh logic here if needed
          console.log("Refreshing students list...");
        }}
      />
    </MainLayout>
  );
};

export default Students;
