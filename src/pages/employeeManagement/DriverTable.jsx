import { useState } from 'react';
import { drivers } from '@/data/dummyData';
import { invoiceSlip } from '@/assets';
import RequestModal from './RequestModal';
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";

export default function DriverTable({ handleEdit }) {
  const [routeRate] = useState('$30/hr');
  const [tripRate] = useState('$30/hr');
  const [payPeriod] = useState('August');
  const [year] = useState('2024');
  const [paySlip, setPaySlip] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 5;
  const totalPages = Math.ceil(drivers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentDrivers = drivers.slice(startIndex, startIndex + itemsPerPage);

  const toggleDropdown = (driverId) => {
    setActiveDropdown(prev => (prev === driverId ? null : driverId));
  };

  const closeDropdown = () => setActiveDropdown(null);
  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const renderPageNumbers = () => {
    const pages = [];
    pages.push(
      <button
        key="prev"
        className="flex items-center justify-center h-8 w-8 rounded bg-[#919EAB] text-[#C4CDD5]"
        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
      >
        <FaAngleLeft />
      </button>
    );

    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <button
          key={i}
          className={`flex items-center justify-center bg-white h-8 w-8 rounded mx-1 ${
            currentPage === i
              ? 'text-[#C01824] border border-[#C01824]'
              : 'border border-[#C4C6C9] text-black'
          }`}
          onClick={() => setCurrentPage(i)}
        >
          {i}
        </button>
      );
    }

    pages.push(
      <button
        key="next"
        className="flex items-center justify-center h-8 w-8 rounded bg-[#919EAB] text-[#C4CDD5]"
        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
      >
        <FaAngleRight />
      </button>
    );

    return pages;
  };

  return (
    <div className="w-full mx-auto p-6">
      {/* Header */}
      <div className="flex flex-wrap justify-end gap-2 mb-4">
        {[
          { label: 'Route Rate', value: routeRate },
          { label: 'Trip Rate', value: tripRate },
          { label: 'Pay Period', value: payPeriod },
          { label: 'Year', value: year },
        ].map(({ label, value }) => (
          <div key={label} className="flex items-center rounded-lg bg-[#F9FBFF] border border-[#D9D9D9] p-2">
            <span className="text-sm text-gray-600 mr-2">{label} :</span>
            <span className="mr-1">{value}</span>
            <button className="text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </button>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto relative">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-100">
            <tr>
              {[
                "Title", "Name", "Requests", "Work Hours", "Terminal assigned", "Pay Cycle", "Pay Type", "Job", "Fedral Tax",
                "State Tax", "Local Tax", "SSN", "Pay Status", "YTD", "Current Pay Period", "Current Pay Period Time", "Pay Stub", "401K", "Company Match", 
                "Health Insurance", "Savings Account", "Reimbursement", "Action"
              ].map((head) => (
                <th key={head} className="px-10 py-1 border whitespace-nowrap">{head}</th>
              ))}
            </tr>
          </thead>
          <tbody className="text-gray-700" onClick={closeDropdown}>
            {currentDrivers.map((driver) => (
              <tr key={driver.id} className="border-t border-gray-200 relative">
                <td className="px-10 py-1 border text-center text-[#141516]">Driver</td>
                <td className="px-10 py-1 border text-center">
                  <div className="flex items-center">
                    <img className="h-8 w-8 rounded-full mr-2" src={driver.image} alt="Driver" />
                    <h2 className='text-[#141516] w-40'>{driver.name}</h2>
                  </div>
                </td>
                <td className="px-10 py-1 border text-center">
                  <span className="text-[#C01824] font-bold cursor-pointer" onClick={openModal}>View</span>
                </td>
                <td className="px-10 py-1 border text-center text-[#141516]">{driver.workHours}</td>
                <td className="px-10 py-1 border text-center text-[#141516]">{driver.trips}</td>
                <td className="px-10 py-1 border text-center text-[#141516]">{driver.payCycle}</td>
                <td className="px-10 py-1 border text-center text-[#141516]">{driver.payType}</td>
                <td className="px-10 py-1 border text-center text-[#141516]">{driver.job}</td>
                <td className="px-10 py-1 border text-center text-[#141516]">{driver.fedralTax}</td>
                <td className="px-10 py-1 border text-center text-[#141516]">{driver.stateTax}</td>
                <td className="px-10 py-1 border text-center text-[#141516]">{driver.localTax}</td>
                <td className="px-10 py-1 border text-center text-[#141516]">{driver.ssn}</td>
                <td className="px-10 py-1 border text-center text-[#141516]">
                  {driver.payStatus === 'Processed' ? (
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">Processed</span>
                  ) : (
                    <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm">In review</span>
                  )}
                </td>
                <td className="px-10 py-1 border text-center text-[#141516]">{driver.ytd}</td>
                <td className="px-10 py-1 border text-center text-[#141516]">{driver.currentPayPeriod}</td>
                <td className="px-10 py-1 border text-center text-[#141516]">{driver.currentPayPeriodTime}</td>                
                <td className="px-10 py-1 border text-center text-[#141516]">
                  <span className="text-[#C01824] font-bold cursor-pointer" onClick={() => setPaySlip(true)}>{driver.payStub}</span>
                </td>
                <td className="px-10 py-1 border text-center text-[#141516]">
                 {driver.fourZeroOne}
                </td>
                <td className="px-10 py-1 border text-center text-[#141516]">
                 {driver.companyMatch}
                </td>
                <td className="px-10 py-1 border text-center text-[#141516]">
                  {driver.healthInsurance}
                </td>
                <td className="px-10 py-1 border text-center text-[#141516]">
                  {driver.savingsAccount}
                </td>
                <td className="px-10 py-1 border text-center text-[#141516]">
                 Training Fee: $100
                </td>

                <td className="px-10 py-1 border text-center relative">
                  <button className="text-[#141516]"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleDropdown(driver.id);
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                    </svg>
                  </button>
                  {activeDropdown === driver.id && (
                    <div
                      className="absolute right-0 top-full mt-1 w-32 bg-white border border-gray-200 rounded shadow-lg z-10"
                      onClick={handleEdit}
                    >
                      <ul>
                        <li className="py-2 px-4 text-black hover:bg-gray-100 cursor-pointer">Edit</li>
                      </ul>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {isOpen && <RequestModal closeModal={closeModal} />}

        {paySlip &&
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" onClick={() => setPaySlip(false)}>
            <div className="bg-white p-4 rounded-lg max-w-lg w-full relative">
              <img src={invoiceSlip} alt="Pay Stub" className="mt-4" />
            </div>
          </div>
        }
      </div>

      {/* Pagination */}
      <div className="mt-4 flex justify-center">
        {renderPageNumbers()}
      </div>
    </div>
  );
}
