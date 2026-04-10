import React, { useState } from 'react';
import { Button, Dialog, Card, Typography } from '@material-tailwind/react';
import { distance, locationicon, penicon, redbusicon, timeline } from '@/assets';
import { closeicon } from '@/assets';

function ApproveModal({ open, onClose, onConfirm, submitting }) {
    const [form, setForm] = useState({ quotedAmount: '', vehicleId: '', driverId: '' });

    const onChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onConfirm({
            status: 'Accepted',
            quotedAmount: Number(form.quotedAmount),
            vehicleId: Number(form.vehicleId),
            driverId: Number(form.driverId),
        });
    };

    return (
        <Dialog className="px-7 py-6 rounded-[4px]" open={open} handler={onClose}>
            <Card color="transparent" shadow={false}>
                <div className="flex justify-between items-center mb-5">
                    <Typography className="text-[24px] text-[#202224] font-bold">Approve Trip</Typography>
                    <Button className="p-1" variant="text" onClick={onClose}>
                        <img src={closeicon} className="w-[17px] h-[17px]" alt="" />
                    </Button>
                </div>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                        <Typography variant="paragraph" className="mb-1 text-[#2C2F32] text-[14px] font-bold">
                            Quoted Amount
                        </Typography>
                        <input
                            type="number"
                            name="quotedAmount"
                            value={form.quotedAmount}
                            onChange={onChange}
                            placeholder="e.g. 800"
                            required
                            className="w-full outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-3 bg-[#F5F6FA]"
                        />
                    </div>
                    <div>
                        <Typography variant="paragraph" className="mb-1 text-[#2C2F32] text-[14px] font-bold">
                            Vehicle ID
                        </Typography>
                        <input
                            type="number"
                            name="vehicleId"
                            value={form.vehicleId}
                            onChange={onChange}
                            placeholder="e.g. 100"
                            required
                            className="w-full outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-3 bg-[#F5F6FA]"
                        />
                    </div>
                    <div>
                        <Typography variant="paragraph" className="mb-1 text-[#2C2F32] text-[14px] font-bold">
                            Driver ID
                        </Typography>
                        <input
                            type="number"
                            name="driverId"
                            value={form.driverId}
                            onChange={onChange}
                            placeholder="e.g. 51"
                            required
                            className="w-full outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-3 bg-[#F5F6FA]"
                        />
                    </div>
                    <div className="flex justify-end space-x-4 mt-2">
                        <Button
                            onClick={onClose}
                            className="px-10 py-2.5 border-2 border-[#C01824] text-[#C01824] capitalize rounded-[6px]"
                            variant="outlined"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={submitting}
                            className="px-10 py-2.5 bg-[#28A745] capitalize rounded-[6px]"
                            variant="filled"
                        >
                            {submitting ? 'Approving...' : 'Confirm Approve'}
                        </Button>
                    </div>
                </form>
            </Card>
        </Dialog>
    );
}

export function VendorPendingCard({ trips, onEditClick, selectedTab, handleMapScreenClick, handleEditRoute, onApprove, onReject, updating }) {
    const [approveTarget, setApproveTarget] = useState(null);

    const handleApproveConfirm = (payload) => {
        if (typeof onApprove === 'function') {
            onApprove(approveTarget, payload);
        }
        setApproveTarget(null);
    };

    return (
        <div className='w-full max-w-[530px]'>
            {trips.map((trip) => (
                <div key={trip.id} className='border-4 border-[#FEB700] rounded-md p-4 mb-4'>
                    <div className='flex justify-between items-center md:flex-row flex-col'>
                        <div className='flex space-x-4 items-center'>
                            <img src={redbusicon} alt="not found" />
                            <p className='text-black text-md md:text-[22px] font-semibold'>{trip.busNumber}</p>
                            <p className='text-xs md:text-[12px] text-black font-medium bg-[#FEB700] px-2 py-1 rounded-[4px]'>{trip.status}</p>
                        </div>
                        <div>
                            <p className='font-semibold text-xs md:text-[14px] text-[#141516]/80 md:pt-0 pt-3'>{trip.time}</p>
                        </div>
                    </div>
                    <div className='flex justify-between items-center mt-5 md:flex-nowrap flex-wrap'>
                        <div className='flex items-center space-x-2 md:pb-0 pb-10'>
                            <div className='flex flex-col space-y-1 items-center'>
                                <p className='font-semibold text-xs md:text-[14px]'>Pickup</p>
                                <img src={timeline} className='w-3 h-16' alt="not found" />
                                <p className='font-semibold text-xs md:text-[14px]'>Dropoff</p>
                            </div>
                            <div className='flex flex-col space-y-3 md:space-y-6'>
                                <div className='flex space-x-2'>
                                    <img src={locationicon} className='w-[25px] h-[25px] mt-2' alt="not found" />
                                    <div className='text-black'>
                                        <h6 className='text-xs md:text-[14px] font-semibold'>{trip.pickup.location}</h6>
                                        <p className='font-normal text-[12px]'>{trip.pickup.address}</p>
                                    </div>
                                </div>
                                <div className='flex space-x-2'>
                                    <img src={locationicon} className='w-[25px] h-[25px] mt-2' alt="not found" />
                                    <div className='text-black'>
                                        <h6 className='text-xs md:text-[14px] font-semibold'>{trip.dropoff.location}</h6>
                                        <p className='font-normal text-[12px]'>{trip.dropoff.address}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='flex flex-col relative mt-5'>
                            <div className='bg-[#fff] flex flex-col justify-end p-1.5 h-[75px] w-[120px] rounded-md text-center shadow-xl text-white'>
                                <p className='text-[11px] font-normal text-[#000]'>Driver</p>
                                <p className='text-[12.5px] font-semibold text-[#000]'>{trip.driver.name}</p>
                                <img src={trip.driver.image} className='rounded-full w-14 h-14 object-cover absolute -top-8 left-8' alt="not found" />
                            </div>
                            <p className='text-[#565656] text-[14px] font-medium pt-2 text-[#000]'>No. of Persons: <span className='text-black font-semibold text-[#000]'>{trip.noOfPersons}</span></p>
                        </div>
                        <div className='space-y-3'>
                            {selectedTab === "Trip Planner" ?
                                <Button className='text-[#fff] bg-[#C01824] border-[#C01824] text-[12px] w-[70px] rounded-[4px] py-0.5 flex items-center justify-center capitalize' variant='outlined' size='sm' onClick={handleMapScreenClick}><img src={distance} className='w-4 h-4 mr-0.5' alt="not found" />Map</Button>
                                :
                                <Button className='text-[#fff] bg-[#C01824] border-[#C01824] text-[12px] w-[70px] rounded-[4px] py-0.5 flex items-center justify-center capitalize' variant='outlined' size='sm'><img src={distance} className='w-4 h-4 mr-0.5' alt="not found" />Map</Button>
                            }
                            {selectedTab === "Trip Planner" ?
                                <Button className='text-[#C01824] border-[#C01824] text-[12px] w-[70px] rounded-[4px] py-0.5 flex items-center justify-center capitalize' variant='outlined' size='sm' onClick={onEditClick}><img src={penicon} className='w-4 h-4 mr-0.5' alt="not found" />Edit</Button>
                                :
                                <Button className='text-[#C01824] border-[#C01824] text-[12px] w-[70px] rounded-[4px] py-0.5 flex items-center justify-center capitalize' variant='outlined' size='sm' onClick={handleEditRoute}><img src={penicon} className='w-4 h-4 mr-0.5' alt="not found" />Edit</Button>
                            }
                            <Button
                                className='text-white bg-[#28A745] text-[12px] w-[70px] rounded-[4px] py-1 flex items-center justify-center capitalize'
                                variant='filled'
                                size='sm'
                                disabled={updating}
                                onClick={() => setApproveTarget(trip)}
                            >
                                Approve
                            </Button>
                            <Button
                                className='text-white bg-[#C01824] text-[12px] w-[70px] rounded-[4px] py-1 flex items-center justify-center capitalize'
                                variant='filled'
                                size='sm'
                                disabled={updating}
                                onClick={() => typeof onReject === 'function' && onReject(trip)}
                            >
                                Reject
                            </Button>
                        </div>
                    </div>
                </div>
            ))}

            <ApproveModal
                open={!!approveTarget}
                onClose={() => setApproveTarget(null)}
                onConfirm={handleApproveConfirm}
                submitting={updating}
            />
        </div>
    );
}

export default VendorPendingCard;
