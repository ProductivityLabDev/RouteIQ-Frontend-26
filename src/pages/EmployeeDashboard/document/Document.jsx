import React, { useState } from 'react'
import { Button, Typography } from '@material-tailwind/react';
import DashboardLayout from '@/components/DashboardLayout'
import PDFIcons from '@/components/PDFIcons';
import { uploadDocumentIcon } from '@/assets';
import { useDispatch, useSelector } from 'react-redux';
import { uploadEmployeeDocument } from '@/redux/slices/employeeDashboardSlice';

const DOCUMENT_TYPES = ['Contract', 'ID Card', 'License', 'Certificate', 'Medical', 'Other'];

const Document = () => {
  const dispatch   = useDispatch();
  const submitting = useSelector((s) => s.employeeDashboard.loading.submitting);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [file, setFile]               = useState(null);
  const [form, setForm]               = useState({
    documentType:     '',
    documentName:     '',
    issueDate:        '',
    expiryDate:       '',
    issuingAuthority: '',
  });

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async () => {
    if (!file || !form.documentType) return;

    const fd = new FormData();
    fd.append('file', file);
    fd.append('documentType', form.documentType);
    if (form.documentName)     fd.append('documentName',     form.documentName);
    if (form.issueDate)        fd.append('issueDate',        form.issueDate);
    if (form.expiryDate)       fd.append('expiryDate',       form.expiryDate);
    if (form.issuingAuthority) fd.append('issuingAuthority', form.issuingAuthority);

    const result = await dispatch(uploadEmployeeDocument(fd));
    if (!result.error) {
      setIsModalOpen(false);
      setFile(null);
      setForm({ documentType: '', documentName: '', issueDate: '', expiryDate: '', issuingAuthority: '' });
    }
  };

  return (
    <DashboardLayout>
      <div className='w-[100%] flex flex-row justify-between items-center mb-5'>
        <Typography className="text-[23px] md:text-[32px] font-[700] text-[#000] mt-5 ps-2">
          Document
        </Typography>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="mt-8 px-8 py-2.5 bg-[#C01824] text-[14px] capitalize rounded-[6px]"
          variant='filled'
        >
          Upload Document
        </Button>
      </div>

      <PDFIcons />

      {/* Upload Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h2 className="text-lg font-semibold text-gray-900">Upload Document</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
            </div>

            <div className="px-6 py-5 space-y-4">
              {/* File drop zone */}
              <label className="block border-4 border-dashed border-[#C01824] rounded-md p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-red-50 transition-colors">
                <img src={uploadDocumentIcon} alt="upload" className="mb-2" />
                <span className="text-[#C01824] font-bold text-sm">
                  {file ? file.name : 'Click or Drag and Drop Files'}
                </span>
                <span className="text-gray-400 text-xs mt-1">PDF, JPG, PNG supported</span>
                <input type="file" className="hidden" onChange={(e) => setFile(e.target.files[0] || null)} accept=".pdf,.jpg,.jpeg,.png" />
              </label>

              {/* Document Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Document Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="documentType"
                  value={form.documentType}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
                >
                  <option value="">Select type</option>
                  {DOCUMENT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              {/* Document Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Document Name (optional)</label>
                <input
                  type="text"
                  name="documentName"
                  value={form.documentName}
                  onChange={handleChange}
                  placeholder="e.g. Driving License 2025"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
                />
              </div>

              {/* Issue & Expiry */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Issue Date</label>
                  <input
                    type="date"
                    name="issueDate"
                    value={form.issueDate}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                  <input
                    type="date"
                    name="expiryDate"
                    value={form.expiryDate}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
                  />
                </div>
              </div>

              {/* Issuing Authority */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Issuing Authority (optional)</label>
                <input
                  type="text"
                  name="issuingAuthority"
                  value={form.issuingAuthority}
                  onChange={handleChange}
                  placeholder="e.g. Traffic Police"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-1">
                <button
                  onClick={handleSubmit}
                  disabled={submitting || !file || !form.documentType}
                  className="flex-1 bg-[#C01824] hover:bg-red-700 disabled:opacity-60 text-white font-semibold py-2.5 rounded-lg text-sm"
                >
                  {submitting ? 'Uploading...' : 'Upload'}
                </button>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-600 font-medium py-2.5 rounded-lg text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}

export default Document
