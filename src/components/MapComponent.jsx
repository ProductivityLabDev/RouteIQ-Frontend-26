import React, { useState } from 'react';
import { arrow_back_ios, BusIcon, Mapnotations, VendorMap2 } from '@/assets';
import { Button } from '@material-tailwind/react';

const MapComponent = ({ onBack, isRouteMap, closeCard, showCard }) => {
    const [distance, setDistance] = useState(0);

    const handleImport = () => {
        console.log('Import button clicked');
    };

    const handleOk = () => {
        console.log(`OK clicked with distance: ${distance} km`);
    };

    return (
        <div className="relative w-full h-full">
            <img
                src={VendorMap2}
                className="w-full h-auto"
                alt="Vendor Map"
            />
            <div className="absolute top-0 left-0 right-0 flex flex-row justify-between items-center p-4">
                <img
                    src={arrow_back_ios}
                    className="z-10"
                    alt="Back Arrow"
                    onClick={onBack}
                />
                <img
                    src={Mapnotations}
                    className="z-20"
                    alt="Map Notations"
                    onClick={onBack}
                />
            </div>
            {showCard && (
                <div className="absolute top-[89%] left-1/2 transform -translate-x-1/2 z-30">
                    <div className="relative top-0 mb-6 left-4 z-30 bg-white rounded-lg shadow-lg w-80">
                        <div className="p-4 relative">
                            {/* Header with ABC title and close button */}
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-2xl font-bold">ABC</h2>
                                <button className="p-1 rounded-full bg-gray-100" onClick={closeCard}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="18" y1="6" x2="6" y2="18"></line>
                                        <line x1="6" y1="6" x2="18" y2="18"></line>
                                    </svg>
                                </button>
                            </div>

                            {/* Red bus time banner */}
                            <div className="bg-[#C01824] text-white p-3 gap-2 rounded-md flex items-center justify-center mb-4">
                                <img src={BusIcon} />
                                <span className="font-medium">7 minutes</span>
                            </div>

                            {/* Time section */}
                            <div className="border-b pb-4 mb-4">
                                <p className="text-gray-500 text-sm mb-1">Time</p>
                                <p className="font-medium">17:00 - 00:00</p>
                            </div>

                            {/* Details section */}
                            <div className="mb-2">
                                <h3 className="text-lg font-bold mb-3">Details</h3>
                            </div>

                            {/* Phone section */}
                            <div className="border-b pb-4 mb-4">
                                <p className="text-gray-500 text-sm mb-1">Phone</p>
                                <a href="tel:+375173271045" className="text-blue-500 font-medium">+375 (17) 327-10-45</a>
                            </div>

                            {/* Address section */}
                            <div className="pb-2 flex justify-between">
                                <div>
                                    <p className="text-gray-500 text-sm mb-1">Address</p>
                                    <p className="font-medium">Hoover Elementary School</p>
                                    <p className="font-medium">950 Hunt Ave Neenah, WI 54956</p>
                                </div>
                                <button className="self-end bg-blue-500 text-white rounded-full h-8 w-8 flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="9 18 15 12 9 6"></polyline>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {isRouteMap &&
                (
                    <div className="absolute bottom-1 left-4 right-4 flex items-center gap-4">
                        <Button
                            onClick={handleImport}
                            className="px-12 py-4 bg-[#C01824] text-[#fff] text-[14px] capitalize rounded-[6px]"
                            variant='filled' size='lg'
                        >
                            Import
                        </Button>
                        <div className='flex items-center justify-between bg-white p-2 rounded h-[8vh] w-[25%]'>
                            <div className="flex-grow mx-4 flex-col w-[25%]">
                                <span className="text-[12px] text-[#000] font-[700]">Distance Range</span>
                                <input
                                    type="range"
                                    min="0"
                                    max="59"
                                    value={distance}
                                    onChange={(e) => setDistance(e.target.value)}
                                    className="flex-grow w-[100%] custom-range"
                                />
                                <span className="ml-2">{distance} km</span>
                            </div>
                            <Button
                                onClick={handleOk}
                                className="bg-green-500 text-white px-8 py-2 rounded"
                            >
                                Ok
                            </Button>
                        </div>
                    </div>
                )
            }
        </div>
    );
};

export default MapComponent;