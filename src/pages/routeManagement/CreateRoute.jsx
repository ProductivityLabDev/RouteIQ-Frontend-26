import React, { useState } from 'react';
import { calendericonred, locationicon, studentfive, addIcon } from '@/assets';
import {
    Button,
    Typography,
    Menu,
    MenuHandler,
    MenuList,
    MenuItem,
} from '@material-tailwind/react';
import { ChevronDownIcon } from "@heroicons/react/24/solid";

const StudentSeatSelection = ({ onBack, editRoute, isEditable, handleBackTrip }) => {
    const [showSeats, setShowSeats] = useState(false);

    const handleFieldClick = () => {
        setShowSeats(true);
    };
    const drivers = ["Driver A", "Driver B", "Driver C"];
    const timeSlots = [
        "8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
        "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"
    ];
    return (
        <section className='w-full h-full'>
            <Typography fontWeight={700} className="text-[#202224] font-[Nunito Sans] font-bold py-3 ps-2 text-[32px]" marginInline={1}>
                {editRoute ? "Edit Route" : isEditable ? 'Edit Trip' : 'Create Route'}
            </Typography>
            {
                isEditable ?
                    <div className="w-full p-4 bg-white h-[75vh] rounded-[4px] border shadow-sm">
                        <form className="grid grid-cols-2 gap-x-6 gap-y-4 py-16 ps-5 w-[50%]">
                            {/* Pickup field */}
                            <div className="col-span-1">
                                <Typography variant="paragraph" className="mb-2 text-[14px] text-[#2C2F32] font-semibold">
                                    Pickup
                                </Typography>
                                <div className="flex flex-row bg-[#F5F6FA] border border-[#D5D5D5] rounded-[6px] p-3 w-full justify-between">
                                    <input
                                        type="text"
                                        placeholder="Enter pickup location"
                                        className="bg-[#F5F6FA] outline-none w-full"
                                    />
                                    <div className="flex flex-row gap-3 items-center">
                                        {!isEditable && <img src={addIcon} alt="add" className="h-4 w-4" />}
                                        <img src={locationicon} alt="location" className="h-5 w-5" />
                                    </div>
                                </div>
                            </div>

                            {/* Dropoff field */}
                            <div className="col-span-1">
                                <Typography variant="paragraph" className="mb-2 text-[14px] text-[#2C2F32] font-semibold">
                                    Dropoff
                                </Typography>
                                <div className="flex flex-row bg-[#F5F6FA] border border-[#D5D5D5] rounded-[6px] p-3 w-full justify-between relative">
                                    <input
                                        type="text"
                                        placeholder="Enter drop location"
                                        className="bg-[#F5F6FA] outline-none w-full"
                                    />
                                    <div className="flex flex-row gap-3 items-center">
                                        {!isEditable && <img src={addIcon} alt="add" className="h-4 w-4" />}
                                        <img src={locationicon} alt="location" className="h-5 w-5" />
                                    </div>
                                </div>
                            </div>

                            {/* Date and Time fields */}
                            <div className="col-span-1">
                                <Typography variant="paragraph" className="mb-2 text-[14px] text-[#2C2F32] font-semibold">
                                    Date
                                </Typography>
                                <div className="flex flex-row bg-[#F5F6FA] border border-[#D5D5D5] rounded-[6px] p-3 w-full justify-between">
                                    <input
                                        type="text"
                                        placeholder="Select date"
                                        className="bg-[#F5F6FA] rounded-[6px] outline-none w-full"
                                    />
                                    <img src={calendericonred} alt="calendar" className="h-5 w-5" />
                                </div>
                            </div>

                            <div className="col-span-1">
                                <Typography variant="paragraph" className="mb-2 text-[14px] text-[#2C2F32] font-semibold">
                                    Time
                                </Typography>
                                <Menu>
                                    <MenuHandler>
                                        <div className="flex flex-row bg-[#F5F6FA] border border-[#D5D5D5] rounded-[6px] p-3 w-full justify-between">
                                            <input
                                                placeholder="Select time"
                                                className="bg-[#F5F6FA] rounded-[6px] outline-none w-full"
                                                readOnly
                                            />
                                        </div>
                                    </MenuHandler>
                                    <MenuList>
                                        {timeSlots.map((slot) => (
                                            <MenuItem key={slot}>{slot}</MenuItem>
                                        ))}
                                    </MenuList>
                                </Menu>
                            </div>

                            {/* Number of Persons field */}
                            <div className="col-span-2 w-[47%]">
                                <Typography variant="paragraph" className="mb-2 text-[14px] text-[#2C2F32] font-semibold">
                                    No. of Persons
                                </Typography>
                                <div className="flex flex-row bg-[#F5F6FA] border border-[#D5D5D5] rounded-[6px] p-3 w-full justify-between">
                                    <input
                                        type="number"
                                        placeholder="Enter no of persons"
                                        className="bg-[#F5F6FA] rounded-[6px] w-full outline-none"
                                    />
                                </div>
                            </div>

                            {/* Driver field */}
                            <div className="col-span-1">
                                <Typography variant="paragraph" className="mb-2 text-[14px] text-[#2C2F32] font-semibold">
                                    Driver
                                </Typography>
                                <Menu>
                                    <MenuHandler>
                                        <div className="flex flex-row bg-[#F5F6FA] border border-[#D5D5D5] rounded-[6px] p-3 w-full justify-between">
                                            <input
                                                type="text"
                                                placeholder="Select driver"
                                                className="bg-[#F5F6FA] rounded-[6px] outline-none flex-1"
                                                readOnly
                                            />
                                            <ChevronDownIcon className="h-5 w-5 text-gray-400 ml-2" />
                                        </div>
                                    </MenuHandler>
                                    <MenuList>
                                        {drivers.map((driver) => (
                                            <MenuItem key={driver}>{driver}</MenuItem>
                                        ))}
                                    </MenuList>
                                </Menu>
                            </div>

                            {/* Bus No field */}
                            <div className="col-span-1">
                                <Typography variant="paragraph" className="mb-2 text-[14px] text-[#2C2F32] font-semibold">
                                    Bus No (Total Seats)
                                </Typography>
                                <div className="flex flex-row bg-[#F5F6FA] border border-[#D5D5D5] rounded-[6px] p-3 w-full justify-between">
                                    <input
                                        type="text"
                                        placeholder="Enter bus no"
                                        className="bg-[#F5F6FA] rounded-[6px] outline-none flex-1"
                                    />
                                </div>
                            </div>

                            {/* Buttons */}
                            <div className="col-span-2 flex mt-20 space-x-4">
                                <Button
                                    className="border border-[#C01824] bg-white text-[#C01824] px-12 py-2 rounded-[4px]"
                                    variant="outlined"
                                    onClick={handleBackTrip}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    className="bg-[#B8B9BC] text-white px-12 py-2 rounded-[4px]"
                                    variant="filled"
                                    type="submit"
                                    onClick={handleBackTrip}
                                >
                                    Submit
                                </Button>
                            </div>
                        </form>
                    </div>
                    :
                    <div className="w-full p-4 bg-white rounded-[4px] border shadow-sm h-[75vh] flex flex-row gap-20">
                        <div className="flex flex-col space-y-4 w-[46%] ps-3">
                            <div className="flex flex-col">
                                <Typography variant="paragraph" className="mb-2 text-[14px] text-[#2C2F32] font-semibold">
                                    Pickup
                                </Typography>
                                <div className="flex flex-row bg-[#F5F6FA] rounded-[6px] p-3 w-full justify-between">
                                    <input
                                        type="text"
                                        placeholder="Enter pickup location"
                                        className="bg-[#F5F6FA] outline-none w-full"
                                        onClick={handleFieldClick}
                                    />
                                    <img src={locationicon} alt="not found" className="h-5 w-5" />
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <Typography variant="paragraph" className="mb-2 text-[14px] text-[#2C2F32] font-semibold">
                                    Drop Off
                                </Typography>
                                <div className="flex flex-row bg-[#F5F6FA] rounded-[6px] p-3 w-full justify-between relative">
                                    <input
                                        type="text"
                                        placeholder="Enter drop location"
                                        className="bg-[#F5F6FA] outline-none w-full"
                                        readOnly
                                    />
                                    <img src={locationicon} alt="not found" className="h-5 w-5" />
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <Typography variant="paragraph" className="mb-2 text-[14px] text-[#2C2F32] font-semibold">
                                    Date
                                </Typography>
                                <div className="flex flex-row bg-[#F5F6FA] rounded-[6px] p-3 w-full justify-between">
                                    <input
                                        type="text"
                                        placeholder="Select date"
                                        className="bg-[#F5F6FA] rounded-[6px] outline-none w-full"
                                    />
                                    <img src={calendericonred} alt="not found" className="h-5 w-5" />
                                </div>
                            </div>
                            {editRoute && (
                                <div className="flex flex-col">
                                    <Typography variant="paragraph" className="mb-2 text-[14px] text-[#2C2F32] font-semibold">
                                        Time
                                    </Typography>
                                    <div className="flex flex-row bg-[#F5F6FA] rounded-[6px] p-3 w-full justify-between">
                                        <input
                                            type="date"
                                            placeholder="Select date"
                                            className="bg-[#F5F6FA] rounded-[6px] outline-none w-full"
                                        />
                                        {/* <img src={calendericonred} alt="not found" className="h-5 w-5" /> */}
                                    </div>
                                </div>
                            )}
                            <div className="flex flex-col">
                                <Typography variant="paragraph" className="mb-2 text-[14px] text-[#2C2F32] font-semibold">
                                    Driver
                                </Typography>
                                <Menu>
                                    <MenuHandler>
                                        <div className="flex flex-row bg-[#F5F6FA] rounded-[6px] p-3 w-full justify-between">
                                            <input
                                                type="text"
                                                placeholder="Select driver"
                                                className="bg-[#F5F6FA] rounded-[6px] outline-none flex-1"
                                                readOnly
                                            />
                                            <ChevronDownIcon className="h-5 w-5 text-gray-400 ml-2" />
                                        </div>
                                    </MenuHandler>
                                    <MenuList>
                                        {drivers.map((driver) => (
                                            <MenuItem key={driver}>{driver}</MenuItem>
                                        ))}
                                    </MenuList>
                                </Menu>
                            </div>
                            <div className="flex flex-col">
                                <Typography variant="paragraph" className="mb-2 text-[14px] text-[#2C2F32] font-semibold">
                                    Bus No
                                </Typography>
                                <div className="flex flex-row bg-[#F5F6FA] rounded-[6px] p-3 w-full justify-between">
                                    <input
                                        type="text"
                                        placeholder="Enter bus no"
                                        className="bg-[#F5F6FA] rounded-[6px] outline-none flex-1"
                                    />
                                </div>
                            </div>
                            <div className="flex flex-row space-x-4 mt-4">
                                <Button className="mt-8 px-12 py-4 border border-[#C01824] bg-[#fff] text-[#C01824] text-[14px] capitalize rounded-[6px]" variant='filled' size='lg' onClick={onBack}>
                                    Cancel
                                </Button>
                                <Button className="mt-8 px-12 py-4 bg-[#B8B9BC] text-[#fff] text-[14px] capitalize rounded-[6px]" variant='filled' size='lg' onClick={onBack}>
                                    Submit
                                </Button>
                            </div>

                        </div>
                        {showSeats ?
                            <div className="flex flex-col w-[100%]">
                                <div className="text-xl font-bold mb-4">Select Students (10 seats)</div>
                                <div className="grid grid-cols-3 gap-4">
                                    {Array.from({ length: 10 }).map((_, index) => (
                                        <div key={index} className="flex items-center space-x-2 p-2 w-[75%] h-[6vh] border border-gray-300 rounded-lg">
                                            <img
                                                src={studentfive}
                                                className="h-10 w-10 rounded-full"
                                            />
                                            <span>Jane Cooper</span>
                                            <input type="checkbox" className="form-checkbox custom-checkbox2" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                            :
                            <div className="flex flex-col w-[100%]">
                                <div className="text-xl font-bold mb-4">Select Students {editRoute ? "(0 seats)" : "(10 seats)"}</div>
                                <Typography variant="paragraph" className="mb-2 text-[14px] text-[#2C2F32] font-semibold">
                                    Please first enter Pickup and Dropoff location to show the student records.
                                </Typography>
                            </div>
                        }
                    </div>
            }
        </section >
    );
};

export default StudentSeatSelection;
