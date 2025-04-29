import { useState } from 'react';
import { drivers } from '@/data/dummyData';
import { invoiceSlip } from '@/assets';
import RequestModal from './RequestModal';

export default function DriverTable({ handleEdit }) {
    const [routeRate, setRouteRate] = useState('$30/hr');
    const [tripRate, setTripRate] = useState('$30/hr');
    const [payPeriod, setPayPeriod] = useState('August');
    const [year, setYear] = useState('2024');
    const [paySlip, setPaySlip] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [isOpen, setIsOpen] = useState(false);


    const toggleDropdown = (driverId) => {
        if (activeDropdown === driverId) {
            setActiveDropdown(null);
        } else {
            setActiveDropdown(driverId);
        }
    };

    const closeDropdown = () => {
        setActiveDropdown(null);
    };
    const openModal = () => {
        setIsOpen(true);
    };

    const closeModal = () => {
        setIsOpen(false);
    };

    return (
        <div className="w-full mx-auto p-6">
            {/* Header controls */}
            <div className="flex flex-wrap  justify-end gap-2 mb-4">
                <div className="flex items-center rounded-lg bg-[#F9FBFF] border border-[#D9D9D9] p-2">
                    <span className="text-sm text-gray-600 mr-2">Route Rate :</span>
                    <span className="mr-1">{routeRate}</span>
                    <button className="text-gray-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                    </button>
                </div>

                <div className="flex items-center rounded-lg bg-[#F9FBFF] border border-[#D9D9D9] p-2">
                    <span className="text-sm text-gray-600 mr-2">Trip Rate :</span>
                    <span className="mr-1">{tripRate}</span>
                    <button className="text-gray-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                    </button>
                </div>

                <div className="flex items-center rounded-lg bg-[#F9FBFF] border border-[#D9D9D9] p-2">
                    <span className="text-sm text-gray-600 mr-2">Pay Period :</span>
                    <span className="mr-1">{payPeriod}</span>
                    <button className="text-gray-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                </div>

                <div className="flex items-center rounded-lg bg-[#F9FBFF] border border-[#D9D9D9] p-2">
                    <span className="text-sm text-gray-600 mr-2">Year :</span>
                    <span className="mr-1">{year}</span>
                    <button className="text-gray-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                    <thead className="bg-[#EEEEEE]">
                        <tr>
                            <th className="text-left py-3 px-4 uppercase font-bold text-sm">Title</th>
                            <th className="text-left py-3 px-4 uppercase font-bold text-sm">Name</th>
                            <th className="text-left py-3 px-4 uppercase font-bold text-sm">Requests</th>
                            <th className="text-left py-3 px-4 uppercase font-bold text-sm">Work Hours</th>
                            <th className="text-left py-3 px-4 uppercase font-bold text-sm">No # of Trips</th>
                            <th className="text-left py-3 px-4 uppercase font-bold text-sm">Pay Cycle</th>
                            <th className="text-left py-3 px-4 uppercase font-bold text-sm">Pay Type</th>
                            <th className="text-left py-3 px-4 uppercase font-bold text-sm">Job</th>
                            <th className="text-left py-3 px-4 uppercase font-bold text-sm">Fedral Tax</th>
                            <th className="text-left py-3 px-4 uppercase font-bold text-sm">State Tax</th>
                            <th className="text-left py-3 px-4 uppercase font-bold text-sm">Local Tax</th>
                            <th className="text-left py-3 px-4 uppercase font-bold text-sm">SSN</th>
                            <th className="text-left py-3 px-4 uppercase font-bold text-sm">Pay Status</th>
                            <th className="text-left py-3 px-4 uppercase font-bold text-sm">YTD</th>
                            <th className="text-left py-3 px-4 uppercase font-bold text-sm">Current Pay Period</th>
                            <th className="text-left py-3 px-4 uppercase font-bold text-sm">Pay Stub</th>
                            <th className="text-left py-3 px-4 uppercase font-bold text-sm">Action</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-700" onClick={closeDropdown}>
                        {drivers.map((driver) => (
                            <tr key={driver.id} className="border-t border-gray-200">
                                <td className="py-3 text-black px-4">Driver</td>
                                <td className="py-3 px-4">
                                    <div className="flex items-center">
                                        <img className="h-8 w-8 rounded-full mr-2" src={driver.image} />
                                        <p className='text-black'>{driver.name}</p>
                                    </div>
                                </td>
                                <td className="py-3 px-4">
                                    <span className="text-[#C01824] font-bold cursor-pointer" onClick={openModal}>Veiw</span>
                                </td>
                                <td className="py-3 px-4 text-black">{driver.workHours}</td>
                                <td className="py-3 px-4 text-black">{driver.trips}</td>
                                <td className="py-3 px-4 text-black">{driver.payCycle}</td>
                                <td className="py-3 px-4 text-black">{driver.payType}</td>
                                <td className="py-3 px-4 text-black">{driver.job}</td>
                                <td className="py-3 px-4 text-black">{driver.fedralTax}</td>
                                <td className="py-3 px-4 text-black">{driver.stateTax}</td>
                                <td className="py-3 px-4 text-black">{driver.localTax}</td>
                                <td className="py-3 px-4 text-black">{driver.ssn}</td>
                                <td className="py-3 px-4">
                                    {driver.payStatus === 'Processed' ? (
                                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">Processed</span>
                                    ) : (
                                        <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm">In review</span>
                                    )}
                                </td>
                                <td className="py-3 px-4 text-black">{driver.ytd}</td>
                                <td className="py-3 px-4 text-black">{driver.currentPayPeriod}</td>
                                <td className="py-3 px-4">
                                    <span className="text-[#C01824] font-bold cursor-pointer" onClick={() => setPaySlip(!paySlip)}>{driver.payStub}</span>
                                </td>
                                <td className="py-3 px-4">
                                    <button className="text-gray-500"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            toggleDropdown(driver.id);
                                        }}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                                        </svg>
                                    </button>
                                </td>
                                {activeDropdown === driver.id && (
                                    <div
                                        className="absolute right-3 mt-1 w-32 bg-white border border-gray-200 rounded shadow-lg z-10"
                                        onClick={handleEdit}

                                    >
                                        <ul>
                                            <li className="py-2 px-4 text-black hover:bg-gray-100 cursor-pointer">Edit</li>
                                        </ul>
                                    </div>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
                {isOpen && <RequestModal closeModal={() => setIsOpen(false)} />}
                {paySlip &&
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" onClick={() => setPaySlip(!paySlip)}>
                        <div className="bg-white p-4 rounded-lg max-w-lg w-full relative">
                            <img src={invoiceSlip} className="mt-4" />
                        </div>
                    </div>
                }
            </div>
        </div>
    );
}