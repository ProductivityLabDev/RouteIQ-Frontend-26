import React from "react";
import { Button, Dialog } from "@material-tailwind/react";
import { closeicon, driver as driverPlaceholder } from "@/assets";

export function DrivingLicense({ open, handleOpen, driver }) {
  const licenseUrl = driver?.drivingLicense || '';
  const isPdf = licenseUrl.toLowerCase().includes('.pdf');
  const driverName = driver?.name || '--';

  return (
    <Dialog open={open} handler={handleOpen} className="rounded-[6px]" size="lg">
      <Button
        className='pt-5 pr-5 hover:bg-white float-right'
        variant="text"
        onClick={handleOpen}
      >
        <img src={closeicon} className='w-[17px] h-[17px]' alt="" />
      </Button>

      <div className="py-6 px-6 space-y-4">
        {/* Driver info header */}
        <div className="flex items-center gap-3 border-b pb-4">
          {driver?.profilePhoto ? (
            <img src={driver.profilePhoto} className="w-[50px] h-[50px] rounded-full object-cover" alt="" />
          ) : (
            <div className="w-[50px] h-[50px] rounded-full bg-[#C01824] flex items-center justify-center text-white font-bold text-[20px]">
              {driverName.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <h2 className="text-[18px] font-bold text-[#141516]">{driverName}</h2>
            <p className="text-[13px] text-gray-500">{driver?.phone || ''}</p>
          </div>
        </div>

        {/* License document */}
        <h1 className="text-[18px] text-[#141516] font-bold text-center">Driving License</h1>

        {!licenseUrl ? (
          <div className="flex items-center justify-center h-[300px] border border-dashed border-gray-300 rounded-lg">
            <p className="text-gray-400 text-sm">No license document available</p>
          </div>
        ) : isPdf ? (
          <iframe
            src={licenseUrl}
            className="w-full rounded-lg border border-gray-200"
            style={{ height: '450px' }}
            title="Driving License"
          />
        ) : (
          <img
            src={licenseUrl}
            alt="Driving License"
            className="w-full max-h-[450px] object-contain rounded-lg border border-gray-200"
          />
        )}

        {licenseUrl && (
          <div className="text-center">
            <a
              href={licenseUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#C01824] text-sm font-medium hover:underline"
            >
              Open in new tab
            </a>
          </div>
        )}
      </div>
    </Dialog>
  );
}
