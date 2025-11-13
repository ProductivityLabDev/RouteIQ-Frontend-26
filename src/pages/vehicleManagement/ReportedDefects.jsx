import React, { useState } from 'react'
import VendorDashboardHeader from '@/components/VendorDashboardHeader';
import { Typography } from '@material-tailwind/react';
import ButtonComponent from '@/components/buttons/CustomButton';

const ReportedDefects = ({ vehicle, onBack, handleSeeMoreInfoClick, handleScheduleRepair }) => {
    // Debug: Log the vehicle data being passed
    console.log("🚌 Vehicle data received in ReportedDefects:", vehicle);

    const [isOpen, setIsOpen] = useState(false); // state for popup
    const [chatInput, setChatInput] = useState("");
    const [chatMessages, setChatMessages] = useState([
        { sender: "Driver", text: "Engine making noise" },
        { sender: "Mechanic", text: "Checking it today" },
    ]);

    const reportedDefects = [
        "Brake issue reported",
        "Low tire pressure",
        "Oil leakage",
    ];

    const handleSend = () => {
        if (!chatInput.trim()) return;
        setChatMessages([...chatMessages, { sender: "You", text: chatInput }]);
        setChatInput("");
    };

    if (!vehicle) {
        return (
            <section className='w-full h-full'>
                <div className='bg-white w-full rounded-[4px] border shadow-sm h-full'>
                    <VendorDashboardHeader title='Reported Defects' icon={true} TextClassName='md:text-[22px]' className='ms-12' handleNavigate={onBack} />
                    <div className='flex items-center justify-center h-[50vh]'>
                        <Typography className="text-center font-bold text-[16px] text-gray-500">
                            No vehicle data available. Please go back and select a vehicle.
                        </Typography>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className='w-full h-full'>
            <div className='bg-white w-full rounded-[4px] border shadow-sm h-full'>
                <VendorDashboardHeader title='Reported Defects' icon={true} TextClassName='md:text-[22px]' className='ms-12' handleNavigate={onBack} />
                <div className='flex flex-row w-[97%] justify-between h-[33vh] m-5 border-b-2 border-[#d3d3d3]'>
                    <div className='flex flex-row w-[60%] gap-[59px]'>
                        <img 
                            src={vehicle?.vehiclImg || vehicle?.VehicleImage || '/src/assets/vechicelSvg.svg'} 
                            alt={vehicle?.VehicleName || vehicle?.vehicleName || "vehicle"} 
                            className="w-48 h-32 object-cover rounded"
                        />
                        <div className='flex flex-col h-full w-[65%] gap-[13px]'>
                            <Typography className="mb-2 text-start font-extrabold text-[19px] text-black">
                                {vehicle?.VehicleName || vehicle?.vehicleName || "N/A"}
                            </Typography>
                            <div className='flex flex-row gap-[85px]'>
                                <Typography className="mb-2 text-center font-bold text-[16px] text-black">
                                    Bus type
                                </Typography>
                                <Typography className="mb-2 text-center font-bold text-[16px] text-black">
                                    {vehicle?.BusType || vehicle?.busType || "School Bus"}
                                </Typography>
                            </div>
                            <div className='flex flex-row gap-[50px]'>
                                <Typography className="mb-2 text-center font-bold text-[16px] text-black">
                                    Vehicle Make
                                </Typography>
                                <Typography className="mb-2 text-center font-bold text-[16px] text-black">
                                    {vehicle?.VehicleMake || vehicle?.vehicleMake || "N/A"}
                                </Typography>
                            </div>
                            <div className='flex flex-row gap-[45px]'>
                                <Typography className="mb-2 text-center font-bold text-[16px] text-black">
                                    Number Plate
                                </Typography>
                                <Typography className="mb-2 text-center font-bold text-[16px] text-black">
                                    {vehicle?.NumberPlate || vehicle?.numberPlate || vehicle?.LicensePlate || "N/A"}
                                </Typography>
                            </div>
                            <div className='flex flex-row gap-[45px]'>
                                <Typography className="mb-2 text-center font-bold text-[16px] text-black">
                                    Terminal
                                </Typography>
                                <Typography className="mb-2 text-center font-bold text-[16px] text-black">
                                    {vehicle?.AssignedTerminal || vehicle?.assignedTerminal || "N/A"}
                                </Typography>
                            </div>
                            <ButtonComponent sx={{ width: '145px', height: '42px', fontSize: '13px' }} label='See more Info' Icon={false} onClick={() => handleSeeMoreInfoClick(vehicle)} />
                        </div>
                    </div>
                </div>

                {/* ------------------------------- Reported Defect Content ------------------------- */}
                <div className='flex flex-col h-[34vh] w-[65%] gap-[16px] px-12'>
                    <Typography className="mb-2 text-start font-extrabold text-[19px] text-black">
                        Reported Defect
                    </Typography>
                    <div className='flex flex-row gap-5'>
                        <Typography className="mb-2 text-center font-bold text-[16px] text-black">
                            Defect Type:
                        </Typography>
                        <Typography className="mb-2 text-center font-bold text-[16px] text-black">
                            Braking system
                        </Typography>
                    </div>
                    <div className='flex flex-row gap-5'>
                        <Typography className="mb-2 text-center font-bold text-[16px] text-black">
                            Defect Description:
                        </Typography>
                        <Typography className="mb-2 text-center font-bold text-[16px] text-black">
                            Spongy or soft Brake pedal When pressing
                        </Typography>
                    </div>
                    <div className='flex flex-row gap-5'>
                        <Typography className="mb-2 text-center font-bold text-[16px] text-black">
                            Reported by:
                        </Typography>
                        <Typography className="mb-2 text-center font-bold text-[16px] text-black">
                            James Fisher
                        </Typography>
                    </div>
                    <div className='flex flex-row gap-3'>
                        <ButtonComponent sx={{ width: '175px', height: '42px', fontSize: '13px' }} label='Schedule Repair' Icon={false} onClick={handleScheduleRepair} />

                        <ButtonComponent
                            sx={{
                                width: '175px',
                                height: '42px',
                                fontSize: '13px',
                                backgroundColor: '#28A745',
                                "&:hover": { backgroundColor: '#28A745' },
                            }}
                            label='Keep Running'
                            Icon={false}
                            onClick={() => setIsOpen(true)} // ✅ Popup open yahan hoga
                        />
                    </div>
                </div>
            </div>

            {/* ---------------- POPUP ---------------- */}
            {isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-lg w-full max-w-3xl p-6 relative">
                        {/* Close Button */}
                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
                        >
                            ✖
                        </button>

                        <h2 className="text-xl font-bold mb-4">Communication Hub</h2>

                        {/* Notify Driver */}
                        <div className="mb-4">
                            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                                Notify Driver
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Reported Defects */}
                            <div>
                                <h3 className="font-semibold mb-2">Reported Defects</h3>
                                <ul className="list-disc list-inside text-gray-700 space-y-1 bg-gray-100 p-3 rounded-lg">
                                    {reportedDefects.map((defect, idx) => (
                                        <li key={idx}>{defect}</li>
                                    ))}
                                </ul>
                            </div>

                            {/* Chat Window */}
                            <div>
                                <h3 className="font-semibold mb-2">Chat (Driver & Mechanic)</h3>
                                <div className="border rounded-lg h-48 p-3 overflow-y-auto mb-3 bg-gray-50">
                                    {chatMessages.map((msg, idx) => (
                                        <p key={idx} className="mb-1">
                                            <span className="font-bold">{msg.sender}:</span> {msg.text}
                                        </p>
                                    ))}
                                </div>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="Type message..."
                                        value={chatInput}
                                        onChange={(e) => setChatInput(e.target.value)}
                                        className="border rounded-lg p-2 flex-1"
                                    />
                                    <button
                                        onClick={handleSend}
                                        className="bg-green-600 text-white px-4 rounded-lg hover:bg-green-700"
                                    >
                                        Send
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </section>
    )
}

export default ReportedDefects;
