import React from "react";
import {
    Button,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Typography,
    Menu,
    MenuHandler,
    MenuList,
    MenuItem,
} from "@material-tailwind/react";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import { addIcon, calendericonred, closeicon, locationicon } from "@/assets";

export function TripPlannerModal({ open, handleOpen, isEditable, isEditableTrip }) {
    const timeSlots = ["08:00 AM", "10:00 AM", "12:00 PM", "02:00 PM", "04:00 PM"];
    const drivers = ["Driver A", "Driver B", "Driver C"];
    return (
        <Dialog className="p-6" open={open} handler={handleOpen}>
            <div className='flex justify-between items-center mb-6'>
                {isEditableTrip ?
                    <DialogHeader className="text-[32px] font-bold p-0">Edit</DialogHeader>
                    :
                    <DialogHeader className="text-[32px] font-bold p-0">{isEditable ? "Edit Trip" : "Create Trip"}</DialogHeader>
                }
                <Button className='p-1' variant="text" onClick={handleOpen}>
                    <img src={closeicon} className='w-[17px] h-[17px]' alt="" />
                </Button>
            </div>
            <DialogBody className="p-0">
                <form className="grid grid-cols-2 gap-x-6 gap-y-4">
                    <div className="col-span-1">
                        <Typography variant="paragraph" className="mb-2 text-[14px] text-[#2C2F32] font-semibold">
                            Pickup
                        </Typography>
                        <div className="flex flex-row bg-[#F5F6FA] rounded-[6px] p-3 w-full justify-between">
                            <input
                                type="text"
                                placeholder="Enter pickup location"
                                className="bg-[#F5F6FA] outline-none w-full"
                            />
                            <div className="flex flex-row gap-3 items-center">
                                {isEditableTrip ? null :
                                    <img src={addIcon} alt="not found" className="h-4 w-4" />
                                }
                                <img src={locationicon} alt="not found" className="h-5 w-5" />
                            </div>
                        </div>
                    </div>
                    <div className="col-span-1">
                        <Typography variant="paragraph" className="mb-2 text-[14px] text-[#2C2F32] font-semibold">
                            Drop Off
                        </Typography>
                        <div className="flex flex-row bg-[#F5F6FA] rounded-[6px] p-3 w-full justify-between relative">
                            <input
                                type="text"
                                placeholder="Enter drop location"
                                className="bg-[#F5F6FA] outline-none w-full"
                            />
                            <div className="flex flex-row gap-3 items-center">
                                {isEditableTrip ? null :
                                    <img src={addIcon} alt="not found" className="h-4 w-4" />
                                }
                                <img src={locationicon} alt="not found" className="h-5 w-5" />
                            </div>
                        </div>
                    </div>
                    <div className="col-span-3 grid grid-cols-3 gap-x-6">
                        <div>
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
                        <div>
                            <Typography variant="paragraph" className="mb-2 text-[14px] text-[#2C2F32] font-semibold">
                                Time
                            </Typography>
                            <Menu>
                                <MenuHandler>
                                    <div className="flex flex-row bg-[#F5F6FA] rounded-[6px] p-3 w-full justify-between">
                                        <input
                                            type="time"
                                            placeholder="Select time"
                                            className=" bg-[#F5F6FA] rounded-[6px] outline-none w-full"

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
                        <div>
                            <Typography variant="paragraph" className="mb-2 text-[14px] text-[#2C2F32] font-semibold">
                                No of Persons
                            </Typography>
                            <div className="flex flex-row bg-[#F5F6FA] rounded-[6px] p-3 w-full justify-between">
                                <input
                                    type="number"
                                    placeholder="Enter no of persons"
                                    className="bg-[#F5F6FA] rounded-[6px] w-full outline-none"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="col-span-3 grid grid-cols-2 gap-x-6 w-full">
                        <div className="flex-1 w-full">
                            <Typography variant="paragraph" className="mb-2 text-[14px] text-[#2C2F32] font-semibold">
                                Bus 1
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
                        <div className="flex-1 w-full">
                            <Typography variant="paragraph" className="mb-2 text-[14px] text-[#2C2F32] font-semibold">
                                Bus 1 Number
                            </Typography>
                            <div className="flex flex-row bg-[#F5F6FA] rounded-[6px] p-3 w-full justify-between">
                                <input
                                    type="text"
                                    placeholder="Enter bus no"
                                    className="bg-[#F5F6FA] rounded-[6px] outline-none flex-1"
                                />
                                {isEditableTrip ? null :
                                    <img src={addIcon} alt="not found" className="h-4 w-4" />
                                }
                            </div>
                        </div>
                    </div>

                    <div className="col-span-3 grid grid-cols-2 gap-x-6 w-full">
                        <div className="flex-1">
                            <Typography variant="paragraph" className="mb-2 text-[14px] text-[#2C2F32] font-semibold">
                                Bus 2
                            </Typography>
                            <Menu>
                                <MenuHandler>
                                    <div className="flex flex-row bg-[#F5F6FA] rounded-[6px] p-3 w-full justify-between">
                                        <input
                                            type="text"
                                            placeholder="Select driver"
                                            className="bg-[#F5F6FA] rounded-[6px] outline-none w-full"
                                            readOnly
                                        />
                                        <ChevronDownIcon className="h-5 w-5 text-gray-400" />
                                    </div>
                                </MenuHandler>
                                <MenuList>
                                    {drivers.map((driver) => (
                                        <MenuItem key={driver}>{driver}</MenuItem>
                                    ))}
                                </MenuList>
                            </Menu>
                        </div>
                        <div className="flex-1">
                            <Typography variant="paragraph" className="mb-2 text-[14px] text-[#2C2F32] font-semibold">
                                Bus 2 Number
                            </Typography>
                            <div className="flex flex-row bg-[#F5F6FA] rounded-[6px] p-3 w-full justify-between">
                                <input
                                    type="text"
                                    placeholder="Enter bus no"
                                    className="bg-[#F5F6FA] rounded-[6px] w-full outline-none"
                                />
                                {isEditableTrip ? null :
                                    <img src={addIcon} alt="not found" className="h-4 w-4" />
                                }
                            </div>
                        </div>
                    </div>
                </form>
            </DialogBody>
            <DialogFooter className="space-x-4 flex justify-end mt-6">
                <Button
                    size="lg"
                    variant="outlined"
                    onClick={handleOpen}
                    className="px-14 rounded-md text-[18px] capitalize border-2 border-[#C01824] py-3 text-[#C01824]"
                >
                    <span>Cancel</span>
                </Button>
                <Button
                    size="lg"
                    variant="filled"
                    onClick={handleOpen}
                    className="px-14 rounded-md text-[18px] capitalize bg-[#C01824] py-3"
                >
                    <span>Submit</span>
                </Button>
            </DialogFooter>
        </Dialog>
    );
}
