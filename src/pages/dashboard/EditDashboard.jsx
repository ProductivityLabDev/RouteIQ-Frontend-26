import { leftColumnOptions, rightColumnOptions } from '@/data/dummyData';
import React, { useMemo, useState } from 'react';

const OPTION_TO_WIDGET_KEY = {
    'No of Vehicles': 'vehiclesCard',
    'No of Schools': 'schoolsCard',
    'Total Trips': 'tripsCard',
    'Schools': 'schoolsTable',
    'Routes': 'routesTable',
    'Invoices': 'invoicesTable',
    'Drivers': 'driversTable',
};

const DEFAULT_WIDGETS = {
    vehiclesCard: true,
    schoolsCard: true,
    tripsCard: true,
    schoolsTable: true,
    routesTable: true,
    invoicesTable: true,
    driversTable: true,
};

const buildSelectedOptions = (visibleWidgets = {}) => {
    const mergedWidgets = { ...DEFAULT_WIDGETS, ...visibleWidgets };
    const initialSelections = {};

    [...leftColumnOptions, ...rightColumnOptions].forEach((option) => {
        const widgetKey = OPTION_TO_WIDGET_KEY[option];
        initialSelections[option] = widgetKey ? mergedWidgets[widgetKey] !== false : false;
    });

    return initialSelections;
};

const EditDashboard = ({ onBack, visibleWidgets, onSave }) => {
    const [selectedOptions, setSelectedOptions] = useState(() => buildSelectedOptions(visibleWidgets));

    const nextWidgets = useMemo(() => ({
        vehiclesCard: selectedOptions['No of Vehicles'],
        schoolsCard: selectedOptions['No of Schools'],
        tripsCard: selectedOptions['Total Trips'],
        schoolsTable: selectedOptions['Schools'],
        routesTable: selectedOptions['Routes'],
        invoicesTable: selectedOptions['Invoices'],
        driversTable: selectedOptions['Drivers'],
    }), [selectedOptions]);

    const handleChange = (option) => {
        setSelectedOptions({
            ...selectedOptions,
            [option]: !selectedOptions[option]
        });
    };

    const handleUpdate = () => {
        onSave?.(nextWidgets);
        onBack?.();
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
                    onClick={handleUpdate}
                >
                    Update
                </button>
            </div>
        </div>
    );
};

export default EditDashboard;
