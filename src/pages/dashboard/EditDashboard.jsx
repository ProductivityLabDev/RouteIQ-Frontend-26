import { leftColumnOptions, rightColumnOptions } from '@/data/dummyData';
import React, { useState } from 'react';

const EditDashboard = ({ onBack }) => {
    const [selectedOptions, setSelectedOptions] = useState({
        'No of Vehicles': true,
        'No of Schools': false,
        'Total Trips': true,
        'Schools': false,
        'Routes': true,
        'Invoices': false,
        'Drivers': true,
        'Total # of vehicle defects': false,
        'Total number of trips to be scheduled': false,
        'Total driver hrs per terminal': false,
        'Profit/Loss statement': true,
        'Profit/Loss per terminal': false,
        'Total accounts payable (date range)': true,
        'Accounts payable per terminal (date range)': true,
        'Total accounts receivable (date range)': false,
        'Accounts receivable per terminal (date range)': false,
        'Total Pending (quotes $)': true,
        'Pending quotes (number of quotes that are:)': true,
        'Total Pending (quotes $) per terminal': false,
        'Total number of schedule conflicts per terminal': false
    });

    const handleChange = (option) => {
        setSelectedOptions({
            ...selectedOptions,
            [option]: !selectedOptions[option]
        });
    };


    return (
        <div className="p-4 md:p-5 w-full min-h-screen bg-[#EEEBE0]">
            <div className="flex items-center mb-4">
                <button onClick={onBack} className="p-0 mr-2">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
                <h1 className="text-2xl md:text-3xl font-bold text-[#202224] font-[Nunito Sans]">
                    Edit Dashboard
                </h1>
            </div>

            <h2 className="text-lg md:text-2xl font-normal mb-6 font-[Nunito Sans]">
                Select options you want to populate in the dashboard
            </h2>

            <div className="flex flex-col lg:flex-row gap-20 mt-4">
                {/* First Column */}
                <div className="w-full lg:w-1/2">
                    {leftColumnOptions.map((option, index) => (
                        <div key={index} className="flex items-center justify-between mb-4 md:mb-6">
                            <span className="text-[24px] md:text-[24px] font-normal font-[Nunito Sans] pr-4 flex-1">{option}</span>
                            <div
                                className={`w-6 h-6 md:w-7 md:h-7 border-2 rounded flex items-center justify-center cursor-pointer ${selectedOptions[option] ? 'border-[#D21917] bg-transparent' : 'border-[#000] bg-transparent'
                                    }`}
                                onClick={() => handleChange(option)}
                            >
                                {selectedOptions[option] && (
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M5 12L10 17L20 7" stroke="#D21917" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                )}
                            </div>

                        </div>
                    ))}
                </div>

                {/* Second Column */}
                <div className="w-full lg:w-1/2">
                    {rightColumnOptions.map((option, index) => (
                        <div key={index} className="flex items-center justify-between mb-4 md:mb-6">
                            <span className="text-[24px] md:text-[24px] font-normal font-[Nunito Sans] pr-4 flex-1">{option}</span>
                            <div
                                className={`w-6 h-6 md:w-7 md:h-7 border-2 rounded flex items-center justify-center cursor-pointer ${selectedOptions[option] ? 'border-[#D21917] bg-transparent' : 'border-[#000] bg-transparent'
                                    }`}
                                onClick={() => handleChange(option)}
                            >
                                {selectedOptions[option] && (
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M5 12L10 17L20 7" stroke="#D21917" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                )}
                            </div>

                        </div>
                    ))}
                </div>
            </div>

            <div className="mt-8 md:mt-16">
                <button
                    className="bg-[#D21917] text-white py-2 px-8 md:py-3 md:px-12 rounded text-base md:text-lg font-[Nunito Sans]"
                    onClick={onBack}
                >
                    Update
                </button>
            </div>
        </div>
    );
};

export default EditDashboard;