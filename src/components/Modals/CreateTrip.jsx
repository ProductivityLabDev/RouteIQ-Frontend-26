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
import { calendericonred, locationicon } from "@/assets";

export function CreateTrip({ open, handleOpen }) {
    const timeSlots = ["08:00 AM", "10:00 AM", "12:00 PM", "02:00 PM", "04:00 PM"];
    const drivers = ["Driver A", "Driver B", "Driver C"];

    return (
        <Dialog className="p-3" open={open} handler={handleOpen}>
            <DialogHeader className="text-[32px] font-bold">Create Trip</DialogHeader>
            <DialogBody>
                <form className="my-2 max-w-screen-lg">
                    <div className="flex justify-between space-x-7">
                        <div className="mb-1 flex flex-col gap-5 w-full">
                            <Typography variant="paragraph" className="-mb-3 text-[14px] text-[#2C2F32] font-semibold">
                                Pickup
                            </Typography>
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Enter pickup location"
                                    className=" bg-[#F5F6FA] rounded-[6px] p-3 w-full outline-none"
                                />
                                <img src={locationicon} alt="not found" className="absolute right-3 top-4 h-5 w-5" />
                            </div>
                            <Typography variant="paragraph" className="-mb-3 text-[14px] text-[#2C2F32] font-semibold">
                                Date
                            </Typography>
                            <div className="relative">
                                <input
                                    type="date"
                                    placeholder="Select date"
                                    className=" bg-[#F5F6FA] rounded-[6px] p-3 w-full outline-none"
                                />
                                <img src={calendericonred} alt="not found" className="absolute right-3 top-4 h-5 w-5" />
                            </div>
                        </div>
                        <div className="mb-1 flex flex-col gap-5 w-full">
                            <Typography variant="paragraph" className="-mb-3 text-[14px] text-[#2C2F32] font-semibold">
                                Drop
                            </Typography>
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Enter drop location"
                                    className=" bg-[#F5F6FA] rounded-[6px] p-3 w-full outline-none"
                                />
                                <img src={locationicon} className="absolute right-3 top-4 h-5 w-5" />
                            </div>
                            <Typography variant="paragraph" className="-mb-3 text-[14px] text-[#2C2F32] font-semibold">
                                Time
                            </Typography>
                            <Menu>
                                <MenuHandler>
                                    <div className="relative">
                                        <input
                                            type="time"
                                            placeholder="Select time"
                                            className=" bg-[#F5F6FA] rounded-[6px] p-3 w-full outline-none"

                                        />
                                        <ChevronDownIcon className="absolute right-3 top-4 h-6 w-6 text-gray-400" />
                                    </div>
                                </MenuHandler>
                                <MenuList>
                                    {timeSlots.map((slot) => (
                                        <MenuItem key={slot}>{slot}</MenuItem>
                                    ))}
                                </MenuList>
                            </Menu>
                        </div>
                    </div>
                    <div className="flex justify-between space-x-7">
                        <div className="mb-1 mt-3 flex flex-col gap-5 w-full">
                            <Typography variant="paragraph" className="-mb-3 text-[14px] text-[#2C2F32] font-semibold">
                                No. of Persons
                            </Typography>
                            <input
                                type="number"
                                placeholder="Total persons"
                                className=" bg-[#F5F6FA] rounded-[6px] p-3 w-full outline-none"
                            />
                        </div>
                        <div className="mb-1 mt-3 flex flex-col gap-5 w-full">
                            <Typography variant="paragraph" className="-mb-3 text-[14px] text-[#2C2F32] font-semibold">
                                Driver
                            </Typography>
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Select Driver"
                                    className=" bg-[#F5F6FA] rounded-[6px] p-3 w-full outline-none"
                                />
                                <ChevronDownIcon className="absolute right-3 top-4 h-6 w-6 text-gray-400" />
                            </div>
                        </div>
                    </div>
                    <div className="mb-1 flex justify-between flex-wrap gap-2 mt-5">
                        <div className="flex flex-col w-full">
                            <Typography variant="paragraph" className="mb-2 text-sm font-medium">
                                Bus No
                            </Typography>
                            <input
                                type="number"
                                placeholder="Enter bus no"
                                className=" bg-[#F5F6FA] rounded-[6px] p-3 w-full outline-none"
                            />
                        </div>
                    </div>
                </form>
            </DialogBody>
            <DialogFooter className="space-x-4 flex justify-end mt-2">
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
