import React, { useState } from 'react';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa6';

const SchoolTable = () => {
  const [editingRowIndex, setEditingRowIndex] = useState(null);
  const [formData, setFormData] = useState({});

  const initialRows = Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    name: `Name ${i + 1}`,
    title: `Title ${i + 1}`,
    phone1: `0300-000000${i}`,
    phone2: `0311-000000${i}`,
    email: `user${i}@example.com`,
    supervisor: `Supervisor ${i + 1}`,
    username: `retailUser${i + 1}`,
    grade: `Grade ${i + 1}`,
  }));

  const [rows, setRows] = useState(initialRows);

  const handleEditClick = (index) => {
    if (editingRowIndex === index) {
      setEditingRowIndex(null);
    } else {
      setEditingRowIndex(index);
      setFormData({ ...rows[index] });
    }
  };

  const handleDelete = (index) => {
    const updated = [...rows];
    updated.splice(index, 1); // remove the row
    setRows(updated);
    setEditingRowIndex(null); // just in case the deleted row was in edit mode
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
                    <td className="px-3 py-2 text-sm">{row.name}</td>
                    <td className="px-3 py-2 text-sm">{row.title}</td>
                    <td className="px-3 py-2 text-sm">{row.phone1}</td>
                    <td className="px-3 py-2 text-sm">{row.phone2}</td>
                    <td className="px-3 py-2 text-sm">{row.email}</td>
                    <td className="px-3 py-2 text-sm">{row.supervisor}</td>
                    <td className="px-3 py-2 text-sm">{row.username}</td>
                    <td className="px-3 py-2 text-sm">{row.grade}</td>
                    <td className="px-3 py-2 flex flex-col gap-1">
                      <button
                        onClick={() => handleEditClick(index)}
                        className="bg-blue-600 text-white px-3 py-1 text-xs rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(index)}
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

export default SchoolTable;
