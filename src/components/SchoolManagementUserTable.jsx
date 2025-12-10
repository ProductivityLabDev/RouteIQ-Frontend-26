import React, { useEffect, useState } from 'react';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa6';
import axios from 'axios';
import { BASE_URL } from '@/configs/api';
import { Spinner } from '@material-tailwind/react';

const SchoolManagementUserTable = ({ instituteId }) => {
  const [rows, setRows] = useState([]);
  const [editingRowIndex, setEditingRowIndex] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  console.log("🔍 [SchoolManagementUserTable] Render with instituteId:", instituteId, "type:", typeof instituteId);

  // If no instituteId provided, show clear message
  if (!instituteId) {
    return (
      <div className="mt-3 mb-3 w-[95%] mx-auto text-center py-8">
        <p className="text-red-500">Error: No Institute ID provided for this school.</p>
      </div>
    );
  }

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        setError(null);

        // Normalise instituteId
        const instituteIdParam =
          typeof instituteId === 'string' ? parseInt(instituteId, 10) : Number(instituteId);

        console.log("📡 [SchoolManagementUserTable] Normalised instituteId:", instituteIdParam);

        if (!instituteIdParam || isNaN(instituteIdParam)) {
          console.error("❌ [SchoolManagementUserTable] Invalid instituteId:", instituteId);
          setError(`Invalid InstituteId: ${instituteId}`);
          return;
        }

        const token = localStorage.getItem('token');
        console.log("🔑 [SchoolManagementUserTable] Token exists:", !!token);
        if (!token) {
          setError("Authentication token not found. Please log in again.");
          return;
        }

        const apiUrl = `${BASE_URL}/school/GetStudents?InstituteId=${instituteIdParam}`;
        console.log("📡 [SchoolManagementUserTable] Request URL:", apiUrl);

        const res = await axios.get(apiUrl, {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("✅ [SchoolManagementUserTable] Raw response:", res.data);

        // Handle possible response shapes
        let studentsArray = [];
        if (Array.isArray(res.data)) {
          studentsArray = res.data;
        } else if (res.data?.ok === true && Array.isArray(res.data.data)) {
          studentsArray = res.data.data;
        } else if (Array.isArray(res.data?.data)) {
          studentsArray = res.data.data;
        } else {
          console.error("❌ [SchoolManagementUserTable] Unexpected response shape:", res.data);
        }

        console.log("📊 [SchoolManagementUserTable] Parsed studentsArray length:", studentsArray.length);
        if (studentsArray.length > 0) {
          console.log("📊 [SchoolManagementUserTable] First student:", studentsArray[0]);
        }

        // Map API students to table rows
        const mappedRows = studentsArray.map((student, index) => ({
          id: student.StudentId || index + 1,
          name: student.StudentName || '',
          title: student.Grade || '',
          phone1: student.EmergencyContact || '',
          phone2: student.BusNo || '',
          email: '', // not provided by API
          supervisor: student.EmergencyContactName || '',
          username: student.Enrollment || '',
          grade: student.Grade || '',
        }));

        console.log("📊 [SchoolManagementUserTable] Mapped rows:", mappedRows);
        setRows(mappedRows);
      } catch (err) {
        console.error("❌ [SchoolManagementUserTable] Error fetching students:", err);
        setError(err.response?.data?.message || err.message || "Failed to fetch students");
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [instituteId]);

  const handleEditClick = (index) => {
    if (editingRowIndex === index) {
      setEditingRowIndex(null);
    } else {
      setEditingRowIndex(index);
      setFormData({ ...rows[index] });
    }
  };

  const handleDelete = () => {
    // Just close edit mode for now; no delete API wired yet
    setEditingRowIndex(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = (index) => {
    const updatedRows = [...rows];
    updatedRows[index] = { ...formData };
    setRows(updatedRows);
    setEditingRowIndex(null);
  };

  const handleCancel = () => {
    setEditingRowIndex(null);
    setFormData({});
  };

  const inputStyle = `w-full border border-gray-300 rounded px-2 py-1 text-sm`;

  if (loading) {
    return (
      <div className="mt-3 mb-3 w-[95%] mx-auto text-center py-8">
        <Spinner className="h-6 w-6 mx-auto text-[#C01824]" />
        <p className="mt-2 text-gray-500 text-sm">Loading students...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-3 mb-3 w-[95%] mx-auto text-center py-8">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  if (!rows || rows.length === 0) {
    return (
      <div className="mt-3 mb-3 w-[95%] mx-auto text-center py-8">
        <p className="text-gray-500">No students found for this school.</p>
      </div>
    );
  }

  return (
    <>
      <div className="mt-3 mb-3 w-[95%] mx-auto border border-gray-200 rounded-md shadow overflow-x-auto">
        <table className="w-full text-center table-fixed">
          <thead className="bg-[#EEEEEE]">
            <tr>
              {[
                'Name', 'Title', 'Phone#1', 'Phone#2',
                'Email', 'Supervisor', 'Retail Username', 'Grade', 'Actions',
              ].map((header) => (
                <th
                  key={header}
                  className="px-3 py-3 text-[14px] font-bold text-[#141516] border-b border-[#D9D9D9]"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={row.id} className="border-b hover:bg-gray-50">
                {editingRowIndex === index ? (
                  <>
                    <td className="px-3 py-2"><input name="name" value={formData.name} onChange={handleChange} className={inputStyle} /></td>
                    <td className="px-3 py-2"><input name="title" value={formData.title} onChange={handleChange} className={inputStyle} /></td>
                    <td className="px-3 py-2"><input name="phone1" value={formData.phone1} onChange={handleChange} className={inputStyle} /></td>
                    <td className="px-3 py-2"><input name="phone2" value={formData.phone2} onChange={handleChange} className={inputStyle} /></td>
                    <td className="px-3 py-2"><input name="email" value={formData.email} onChange={handleChange} className={inputStyle} /></td>
                    <td className="px-3 py-2"><input name="supervisor" value={formData.supervisor} onChange={handleChange} className={inputStyle} /></td>
                    <td className="px-3 py-2"><input name="username" value={formData.username} onChange={handleChange} className={inputStyle} /></td>
                    <td className="px-3 py-2"><input name="grade" value={formData.grade} onChange={handleChange} className={inputStyle} /></td>
                    <td className="px-3 py-2 flex flex-col gap-1">
                      <button onClick={() => handleSave(index)} className="bg-green-600 text-white px-3 py-1 text-xs rounded">Save</button>
                      <button onClick={handleCancel} className="bg-gray-500 text-white px-3 py-1 text-xs rounded">Cancel</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="px-3 py-2 text-sm">{row.name || 'N/A'}</td>
                    <td className="px-3 py-2 text-sm">{row.title || 'N/A'}</td>
                    <td className="px-3 py-2 text-sm">{row.phone1 || 'N/A'}</td>
                    <td className="px-3 py-2 text-sm">{row.phone2 || 'N/A'}</td>
                    <td className="px-3 py-2 text-sm">{row.email || 'N/A'}</td>
                    <td className="px-3 py-2 text-sm">{row.supervisor || 'N/A'}</td>
                    <td className="px-3 py-2 text-sm">{row.username || 'N/A'}</td>
                    <td className="px-3 py-2 text-sm">{row.grade || 'N/A'}</td>
                    <td className="px-3 py-2 flex flex-col gap-1">
                      <button
                        onClick={() => handleEditClick(index)}
                        className="bg-blue-600 text-white px-3 py-1 text-xs rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={handleDelete}
                        className="bg-red-600 text-white px-3 py-1 text-xs rounded"
                      >
                        Delete
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-4">
        <nav className="flex gap-1">
          <button className="px-3 py-2 border rounded bg-[#919EAB]"><FaAngleLeft color="#fff" /></button>
          {[1, 2, 3].map((page) => (
            <button
              key={page}
              className={`px-3 py-1 border rounded ${page === 1 ? 'bg-red-600 text-white' : 'hover:bg-gray-200'}`}
            >
              {page}
            </button>
          ))}
          <span className="px-3 py-1">...</span>
          <button className="px-3 py-1 border rounded hover:bg-gray-200">12</button>
          <button className="px-3 py-1 border rounded bg-[#919EAB]"><FaAngleRight color="#fff" /></button>
        </nav>
      </div>
    </>
  );
};

export default SchoolManagementUserTable;
