import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDocuments } from '@/redux/slices/employeeDashboardSlice';
import { PDFIcon } from '@/assets';
import dayjs from 'dayjs';

export default function PDFIcons() {
  const dispatch = useDispatch();
  const { documents, loading } = useSelector((s) => s.employeeDashboard);

  useEffect(() => {
    dispatch(fetchDocuments());
  }, [dispatch]);

  if (loading.documents) {
    return (
      <div className="bg-white p-8 rounded-lg w-full h-[69vh] flex items-center justify-center">
        <p className="text-gray-400 text-sm">Loading documents...</p>
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <div className="bg-white p-8 rounded-lg w-full h-[69vh] flex items-center justify-center">
        <p className="text-gray-400 text-sm">No documents uploaded yet</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-lg w-full h-[69vh]">
      <div className="flex flex-wrap gap-6">
        {documents.map((doc) => (
          <a
            key={doc.id}
            href={doc.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center group"
          >
            <div className="mb-1">
              <img src={PDFIcon} alt="pdf" className="w-12 h-12" />
            </div>
            <span className="text-gray-700 text-sm font-medium group-hover:text-red-600 transition-colors">
              {doc.documentName || doc.documentType}
            </span>
            {doc.expiryDate && (
              <span className="text-gray-400 text-xs">
                Exp: {dayjs(doc.expiryDate).format('MMM D, YYYY')}
              </span>
            )}
          </a>
        ))}
      </div>
    </div>
  );
}
