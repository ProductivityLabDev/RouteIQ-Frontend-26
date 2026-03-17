import { Reddashboard, redHumbuger } from '@/assets';
import { schoolsNames } from '@/data/dummyData';
import React, { useState } from 'react';
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";

export default function SchoolInvoiceList({ handleSchoolBack, setSchoolData, setSelectedInstituteId, setSelectedSchoolName, schools = [], loadingSchools = false }) {
  const [schoolNameTable, setSchoolNameTable] = useState(false);

  const handleSchoolClick = (school) => {
    if (setSelectedInstituteId) setSelectedInstituteId(school.instituteId);
    if (setSelectedSchoolName) setSelectedSchoolName(school.instituteName);
    setSchoolData(true);
  };

  // table view: split API schools into left/right columns
  const leftSchools = schools.slice(0, Math.ceil(schools.length / 2));
  const rightSchools = schools.slice(Math.ceil(schools.length / 2));

  return (
    <div className="p-4 w-[95%] mx-auto">
      <div className="flex justify-end mb-4">
        <button className="border border-gray-300 p-2 rounded" onClick={() => setSchoolNameTable(!schoolNameTable)}>
          <img src={schoolNameTable ? Reddashboard : redHumbuger} />
        </button>
      </div>

      {loadingSchools && (
        <p className="text-center text-gray-400 py-6">Loading schools...</p>
      )}

      {!loadingSchools && schools.length === 0 && (
        <p className="text-center text-gray-400 py-6">No schools found for this terminal</p>
      )}

      {!loadingSchools && schools.length > 0 && (
        schoolNameTable ? (
          <div className="flex justify-center items-center w-full">
            <div className="w-full px-4">
              <table className="w-full border-collapse">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-2 px-4 border text-left font-bold text-[#141516]">S. No</th>
                    <th className="py-2 px-4 border text-left font-bold text-[#141516]">School Names</th>
                    <th className="py-2 px-4 border text-left font-bold text-[#141516]">S. No</th>
                    <th className="py-2 px-4 border text-left font-bold text-[#141516]">School Names</th>
                  </tr>
                </thead>
                <tbody>
                  {leftSchools.map((leftSchool, index) => {
                    const rightSchool = rightSchools[index];
                    const isEven = index % 2 === 1;
                    return (
                      <tr key={leftSchool.instituteId} className={isEven ? "bg-gray-50" : "bg-white"}>
                        <td className="py-2 px-4 border text-[#141516] font-semibold">{index + 1}</td>
                        <td className="py-2 px-4 border">
                          <a className="text-[#C01824] underline cursor-pointer font-bold" onClick={() => handleSchoolClick(leftSchool)}>
                            {leftSchool.instituteName}
                          </a>
                        </td>
                        <td className="py-2 px-4 border text-[#141516] font-semibold">{rightSchool ? leftSchools.length + index + 1 : ''}</td>
                        <td className="py-2 px-4 border">
                          {rightSchool && (
                            <a className="text-[#C01824] underline cursor-pointer font-bold" onClick={() => handleSchoolClick(rightSchool)}>
                              {rightSchool.instituteName}
                            </a>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {schools.map((school) => (
                <div
                  key={school.instituteId}
                  className="bg-red-50 p-6 rounded-lg flex flex-col items-center justify-center text-center cursor-pointer hover:bg-red-100"
                  onClick={() => handleSchoolClick(school)}
                >
                  <div className="w-16 h-16 bg-[#C01824] rounded-full flex items-center justify-center text-white font-bold text-xl mb-3">
                    {school.instituteName?.charAt(0) ?? 'S'}
                  </div>
                  <h3 className="text-base font-medium">{school.instituteName}</h3>
                  <p className="text-sm text-gray-500">School</p>
                </div>
              ))}
            </div>

            <div className="flex justify-center mt-6">
              <nav className="flex gap-1">
                <button className="px-3 py-2 border rounded bg-[#919EAB]">
                  <FaAngleLeft color="#fff" />
                </button>
                <button className="px-3 py-1 border rounded bg-red-600 text-white">1</button>
                <button className="px-3 py-2 border rounded bg-[#919EAB]">
                  <FaAngleRight color="#fff" />
                </button>
              </nav>
            </div>
          </>
        )
      )}
    </div>
  );
}
