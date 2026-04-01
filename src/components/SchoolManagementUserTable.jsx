import React, { useEffect, useState } from 'react';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa6';
import { Spinner } from '@material-tailwind/react';
import { toast } from 'react-hot-toast';
import { schoolService } from '@/services/schoolService';

const PAGE_SIZE = 10;

const mapStudentToRow = (student) => ({
  id: student.StudentId,
  studentName: student.StudentName || '',
  busNo: student.BusNo || '',
  routeNo: student.RouteNo || '',
  grade: student.Grade || '',
  emergencyContact: student.EmergencyContact || '',
  enrollment: student.Enrollment || '',
  address: student.Address || '',
  guardian1: student.Guardian1 || '',
  guardian2: student.Guardian2 || '',
  guardianEmail: student.GuardianEmail || '',
  guardian1Phone: student.Guardian1Phone || '',
  guardian2Phone: student.Guardian2Phone || '',
});

/**
 * @type {React.FC<import('@/pages/schoolManagement/SchoolManagement').SchoolManagementUserTableProps>}
 */
const SchoolManagementUserTable = ({ instituteId }) => {
  const [rows, setRows] = useState([]);
  const [editingRowId, setEditingRowId] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRows, setTotalRows] = useState(0);

  const resolvedInstituteId =
    typeof instituteId === 'string' ? parseInt(instituteId, 10) : Number(instituteId);

  const loadStudents = async (page = currentPage) => {
    if (!resolvedInstituteId || Number.isNaN(resolvedInstituteId)) {
      setError(`Invalid InstituteId: ${instituteId}`);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const offset = (page - 1) * PAGE_SIZE;
      const response = await schoolService.getStudentsBySchool(resolvedInstituteId, {
        limit: PAGE_SIZE,
        offset,
      });

      const students = response.data?.rows || [];
      setRows(students.map(mapStudentToRow));
      setTotalRows(Number(response.data?.total || 0));
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch students');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [instituteId]);

  useEffect(() => {
    loadStudents(currentPage);
  }, [instituteId, currentPage]);

  const handleEditClick = (row) => {
    setEditingRowId(row.id);
    setFormData({ ...row });
  };

  const handleCancel = () => {
    setEditingRowId(null);
    setFormData({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    if (!editingRowId) return;

    try {
      setSaving(true);

      const payload = {
        StudentName: formData.studentName?.trim() || '',
        BusNo: formData.busNo?.trim() || null,
        RouteNo: formData.routeNo?.trim() || null,
        Grade: formData.grade?.trim() || '',
        EmergencyContact: formData.emergencyContact?.trim() || '',
        Enrollment: formData.enrollment?.trim() || '',
        Address: formData.address?.trim() || '',
        Guardian1: formData.guardian1?.trim() || '',
        Guardian2: formData.guardian2?.trim() || null,
        GuardianEmail: formData.guardianEmail?.trim() || '',
        Guardian1Phone: formData.guardian1Phone?.trim() || '',
        Guardian2Phone: formData.guardian2Phone?.trim() || null,
      };

      await schoolService.updateStudent(resolvedInstituteId, editingRowId, payload);
      toast.success('Student updated successfully');
      setEditingRowId(null);
      setFormData({});
      loadStudents(currentPage);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Failed to update student');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (studentId) => {
    if (!studentId) return;

    try {
      setDeletingId(studentId);
      await schoolService.deleteStudent(resolvedInstituteId, studentId);
      toast.success('Student deleted successfully');

      const nextPage =
        rows.length === 1 && currentPage > 1 ? currentPage - 1 : currentPage;
      if (nextPage !== currentPage) {
        setCurrentPage(nextPage);
      } else {
        loadStudents(currentPage);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Failed to delete student');
    } finally {
      setDeletingId(null);
    }
  };

  const totalPages = Math.max(1, Math.ceil(totalRows / PAGE_SIZE));

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    setCurrentPage(page);
  };

  const getVisiblePages = () => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, index) => index + 1);
    if (currentPage <= 3) return [1, 2, 3, 4, 5];
    if (currentPage >= totalPages - 2) {
      return [totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }
    return [currentPage - 2, currentPage - 1, currentPage, currentPage + 1, currentPage + 2];
  };

  const inputStyle = 'w-full min-w-[130px] border border-gray-300 rounded px-2 py-1 text-sm';
  const headers = [
    'Student Name',
    'Bus No',
    'Route No',
    'Grade',
    'Emergency Contact',
    'Enrollment',
    'Address',
    'Guardian 1',
    'Guardian 2',
    'Guardian Email',
    'Guardian 1 Phone',
    'Guardian 2 Phone',
    'Actions',
  ];

  if (!instituteId) {
    return (
      <div className="mt-3 mb-3 w-[95%] mx-auto text-center py-8">
        <p className="text-red-500">Error: No Institute ID provided for this school.</p>
      </div>
    );
  }

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

  if (!rows.length) {
    return (
      <div className="mt-3 mb-3 w-[95%] mx-auto text-center py-8">
        <p className="text-gray-500">No students found for this school.</p>
      </div>
    );
  }

  return (
    <>
      <div className="mt-3 mb-3 w-[95%] mx-auto border border-gray-200 rounded-md shadow overflow-x-auto">
        <table className="w-full text-left min-w-[1800px]">
          <thead className="bg-[#EEEEEE]">
            <tr>
              {headers.map((header) => (
                <th
                  key={header}
                  className="px-3 py-3 text-[13px] font-bold text-[#141516] border-b border-[#D9D9D9]"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const isEditing = editingRowId === row.id;

              return (
                <tr key={row.id} className="border-b hover:bg-gray-50 align-top">
                  {isEditing ? (
                    <>
                      <td className="px-3 py-2"><input name="studentName" value={formData.studentName || ''} onChange={handleChange} className={inputStyle} /></td>
                      <td className="px-3 py-2"><input name="busNo" value={formData.busNo || ''} onChange={handleChange} className={inputStyle} /></td>
                      <td className="px-3 py-2"><input name="routeNo" value={formData.routeNo || ''} onChange={handleChange} className={inputStyle} /></td>
                      <td className="px-3 py-2"><input name="grade" value={formData.grade || ''} onChange={handleChange} className={inputStyle} /></td>
                      <td className="px-3 py-2"><input name="emergencyContact" value={formData.emergencyContact || ''} onChange={handleChange} className={inputStyle} /></td>
                      <td className="px-3 py-2"><input name="enrollment" value={formData.enrollment || ''} onChange={handleChange} className={inputStyle} /></td>
                      <td className="px-3 py-2"><input name="address" value={formData.address || ''} onChange={handleChange} className={inputStyle} /></td>
                      <td className="px-3 py-2"><input name="guardian1" value={formData.guardian1 || ''} onChange={handleChange} className={inputStyle} /></td>
                      <td className="px-3 py-2"><input name="guardian2" value={formData.guardian2 || ''} onChange={handleChange} className={inputStyle} /></td>
                      <td className="px-3 py-2"><input name="guardianEmail" value={formData.guardianEmail || ''} onChange={handleChange} className={inputStyle} /></td>
                      <td className="px-3 py-2"><input name="guardian1Phone" value={formData.guardian1Phone || ''} onChange={handleChange} className={inputStyle} /></td>
                      <td className="px-3 py-2"><input name="guardian2Phone" value={formData.guardian2Phone || ''} onChange={handleChange} className={inputStyle} /></td>
                      <td className="px-3 py-2">
                        <div className="flex flex-col gap-1 min-w-[90px]">
                          <button
                            onClick={handleSave}
                            disabled={saving}
                            className="bg-green-600 text-white px-3 py-1 text-xs rounded disabled:opacity-60"
                          >
                            {saving ? 'Saving...' : 'Save'}
                          </button>
                          <button
                            onClick={handleCancel}
                            disabled={saving}
                            className="bg-gray-500 text-white px-3 py-1 text-xs rounded disabled:opacity-60"
                          >
                            Cancel
                          </button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-3 py-2 text-sm">{row.studentName || 'N/A'}</td>
                      <td className="px-3 py-2 text-sm">{row.busNo || 'N/A'}</td>
                      <td className="px-3 py-2 text-sm">{row.routeNo || 'N/A'}</td>
                      <td className="px-3 py-2 text-sm">{row.grade || 'N/A'}</td>
                      <td className="px-3 py-2 text-sm">{row.emergencyContact || 'N/A'}</td>
                      <td className="px-3 py-2 text-sm">{row.enrollment || 'N/A'}</td>
                      <td className="px-3 py-2 text-sm">{row.address || 'N/A'}</td>
                      <td className="px-3 py-2 text-sm">{row.guardian1 || 'N/A'}</td>
                      <td className="px-3 py-2 text-sm">{row.guardian2 || 'N/A'}</td>
                      <td className="px-3 py-2 text-sm">{row.guardianEmail || 'N/A'}</td>
                      <td className="px-3 py-2 text-sm">{row.guardian1Phone || 'N/A'}</td>
                      <td className="px-3 py-2 text-sm">{row.guardian2Phone || 'N/A'}</td>
                      <td className="px-3 py-2">
                        <div className="flex flex-col gap-1 min-w-[90px]">
                          <button
                            onClick={() => handleEditClick(row)}
                            className="bg-blue-600 text-white px-3 py-1 text-xs rounded"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(row.id)}
                            disabled={deletingId === row.id}
                            className="bg-red-600 text-white px-3 py-1 text-xs rounded disabled:opacity-60"
                          >
                            {deletingId === row.id ? 'Deleting...' : 'Delete'}
                          </button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center mt-4">
        <nav className="flex gap-1">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-3 py-2 border rounded ${currentPage === 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-[#919EAB]'}`}
          >
            <FaAngleLeft color="#fff" />
          </button>
          {getVisiblePages().map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`px-3 py-1 border rounded ${page === currentPage ? 'bg-red-600 text-white' : 'hover:bg-gray-200'}`}
            >
              {page}
            </button>
          ))}
          {totalPages > 5 && getVisiblePages()[getVisiblePages().length - 1] < totalPages && (
            <>
              <span className="px-3 py-1">...</span>
              <button
                onClick={() => handlePageChange(totalPages)}
                className="px-3 py-1 border rounded hover:bg-gray-200"
              >
                {totalPages}
              </button>
            </>
          )}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-3 py-2 border rounded ${currentPage === totalPages ? 'bg-gray-300 cursor-not-allowed' : 'bg-[#919EAB]'}`}
          >
            <FaAngleRight color="#fff" />
          </button>
        </nav>
      </div>
      <p className="mt-2 text-center text-xs text-gray-500">
        Showing {rows.length} of {totalRows} students
      </p>
    </>
  );
};

export default SchoolManagementUserTable;
