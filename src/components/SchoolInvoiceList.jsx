import { dashboardicon, Reddashboard, redHumbuger, RosewoodSchoolLogo, school10, school11, school12, school13, school2, school3, school4, school5, school7, school9, SkylineSchoolLogo, SpringdaleSchoolLogo } from '@/assets';
import { schoolsNames } from '@/data/dummyData';
import React, { useState } from 'react';

const SchoolCard = ({ logo, name, type, onClick }) => {
    return (
        <div className="bg-red-50 p-6 rounded-lg flex flex-col items-center justify-center text-center" onClick={onClick}>
            <div className="mb-3">
                {logo}
            </div>
            <div>
                <h3 className="text-base font-medium">{name}</h3>
                <p className="text-sm">{type}</p>
            </div>
        </div>
    );
};

export default function SchoolInvoiceList({ handleSchoolBack, setSchoolData }) {
    const [schoolNameTable, setSchoolNameTable] = useState(false)
    const leftSchools = schoolsNames.slice(0, 6);
    const rightSchools = schoolsNames.slice(6, 12);
    const schools = [
        {
            name: "Lakeview High",
            type: "School",
            logo: (
                <div className="w-16 h-16 bg-red-900 rounded-full flex items-center justify-center text-white">
                    <div className="text-xs text-center">
                        <img src={school9} />
                    </div>
                </div>
            )
        },
        {
            name: "Springdale Elementary",
            type: "School",
            logo: (
                <div className="w-16 h-16 rounded-full flex items-center justify-center text-blue-900 font-bold text-3xl">
                    <img src={SkylineSchoolLogo} />
                </div>
            )
        },
        {
            name: "Eaglecrest Middle",
            type: "School",
            logo: (
                <div className="w-16 h-16 flex items-center rounded-full justify-center">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center">
                        <img src={SpringdaleSchoolLogo} />
                    </div>
                </div>
            )
        },
        {
            name: "Rosewood Elementary",
            type: "School",
            logo: (
                <div className="w-16 h-16  rounded-full flex items-center justify-center text-white text-xs text-center">
                    <div>
                        <img src={school5} />
                    </div>
                </div>
            )
        },
        {
            name: "Meadowbrook",
            type: "Academy",
            logo: (
                <div className="w-16 h-16  rounded-full flex items-center justify-center">
                    <div className="w-10 h-6 border-t-4 border-white flex items-end justify-center">
                        <img src={school2} />
                    </div>
                </div>
            )
        },
        {
            name: "Skyline High",
            type: "School",
            logo: (
                <div className="w-16 h-16 rounded-lg flex items-center justify-center text-white text-xs text-center p-2">
                    <div>
                        <img src={school10} />
                    </div>
                </div>
            )
        },
        {
            name: "Brookwood Middle",
            type: "School",
            logo: (
                <div className="w-16 h-16  rounded-full flex items-center justify-center text-white font-bold text-3xl">
                    <img src={school7} />
                </div>
            )
        },
        {
            name: "Horizon Elementary",
            type: "School",
            logo: (
                <div className="w-16 h-16  rounded-full flex items-center justify-center text-white text-center">
                    <div>
                        <img src={school4} />
                    </div>
                </div>
            )
        },
        {
            name: "Ivy League Prep",
            type: "",
            logo: (
                <div className="w-16 h-16  rounded-full flex items-center justify-center text-white">
                    <div>
                        <img src={school3} className='w-[100%] h-[100%]' />
                    </div>
                </div>
            )
        },
        {
            name: "Riverdale High",
            type: "School",
            logo: (
                <div className="w-16 h-16  rounded-full flex items-center justify-center text-white text-xs text-center">
                    <div>
                        <img src={school11} />
                    </div>
                </div>
            )
        },
        {
            name: "Maplebrook Middle",
            type: "School",
            logo: (
                <div className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-4xl">
                    <img src={school12} />
                </div>
            )
        },
        {
            name: "Birchwood Elementary",
            type: "School",
            logo: (
                <div className="w-16 h-16  rounded-full flex items-center justify-center text-white font-bold text-3xl">
                    <img src={school13} />
                </div>
            )
        },
    ];
    const handleSchoolClick = (school) => {
        console.log("School clicked:", school.name);
        setSchoolData(true)
    };
    return (
        <div className="p-4 max-w-6xl mx-auto">
            <div className="flex justify-end mb-4">
                <button className="border border-gray-300 p-2 rounded" onClick={() => setSchoolNameTable(!schoolNameTable)}>
                    <img src={schoolNameTable ? Reddashboard : redHumbuger} />
                </button>
            </div>
            {schoolNameTable ? (
                <div className="flex justify-center items-center w-full">
                    <div className="w-full px-4">
                        <table className="w-full border-collapse">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="py-2 px-4 border text-left font-semibold">S. No</th>
                                    <th className="py-2 px-4 border text-left font-semibold">School Names</th>
                                    <th className="py-2 px-4 border text-left font-semibold">S. No</th>
                                    <th className="py-2 px-4 border text-left font-semibold">School Names</th>
                                </tr>
                            </thead>
                            <tbody>
                                {leftSchools.map((leftSchool, index) => {
                                    const rightSchool = rightSchools[index];
                                    const isEven = index % 2 === 1;

                                    return (
                                        <tr key={leftSchool.id} className={isEven ? "bg-gray-50" : "bg-white"}>
                                            <td className="py-2 px-4 border">{leftSchool.id}</td>
                                            <td className="py-2 px-4 border">
                                                <a className="text-red-600 underline cursor-pointer" onClick={() => setSchoolData(true)}>{leftSchool.name}</a>
                                            </td>
                                            <td className="py-2 px-4 border">{rightSchool.id}</td>
                                            <td className="py-2 px-4 border">
                                                <a className="text-red-600  underline cursor-pointer">{rightSchool.name}</a>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) :
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                    {schools.map((school, index) => (
                        <SchoolCard
                            key={index}
                            logo={school.logo}
                            name={school.name}
                            type={school.type}
                            onClick={() => handleSchoolClick(school)}
                        />
                    ))}
                </div>

            }
        </div>
    );
}