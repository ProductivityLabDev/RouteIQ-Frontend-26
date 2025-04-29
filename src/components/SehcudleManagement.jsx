import { backArrow, editicon } from '@/assets';
import React from 'react'

const SehcudleManagement = ({ onBack }) => {
    const maintenanceData = [
        {
            description: 'Service A (Air Compressor, Brakes, Lube',
            pn: '12135',
            partDescription: 'Gearbox Repair',
            qty: 3,
            vendor: 'Easy ways',
            partCost: '$50',
            mileage: '150Km',
            estimatedCompletion: '3 Hours',
            terminal: 'R1',
        }
    ];
    return (
        <section className=" bg-white w-full h-full">
            <div className="flex items-center mb-8 mt-8 gap-7 ms-4">
                <img src={backArrow} alt="Back" onClick={onBack} />
                <h1 className="text-xl font-bold">Scheduled Maintenance</h1>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-[#EEEEEE]">
                            {['Repair/Service Description', 'P/N', 'Part Description', 'Qty', 'Vendor', 'Part Cost', 'Mileage', 'Estimated Completion', 'Terminal', 'Notes'].map((header, index) => (
                                <th key={index} className="p-2 text-left text-sm font-bold text-[#141516] border">{header}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {maintenanceData.map((item, index) => (
                            <tr key={index} className="border-b">
                                <td className="p-2 border">{item.description}</td>
                                <td className="p-2 border">{item.pn}</td>
                                <td className="p-2 border">{item.partDescription}</td>
                                <td className="p-2 border">{item.qty}</td>
                                <td className="p-2 border">{item.vendor}</td>
                                <td className="p-2 border">{item.partCost}</td>
                                <td className="p-2 border">{item.mileage}</td>
                                <td className="p-2 border">{item.estimatedCompletion}</td>
                                <td className="p-2 border">{item.terminal}</td>
                                <td className="p-2 border">
                                    <div className="flex items-center justify-between ">
                                        <span className="text-[#C01824] underline mr-2">See Notes</span>
                                        <img src={editicon} className="cursor-pointer" alt="Edit Icon" />
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    )
}

export default SehcudleManagement
