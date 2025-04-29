import React from "react";
import {
  Button,
  Dialog,
} from "@material-tailwind/react";
import { closeicon, driver, greentickicon } from "@/assets";

export function DrivingLicense({ open, handleOpen }) {

  return (
    <>
      <Dialog open={open} handler={handleOpen} className="rounded-[6px]">
        <Button
          className='pt-5 pr-5 hover:bg-white float-right'
          variant="text"
          onClick={handleOpen}
        >
          <img src={closeicon} className='w-[17px] h-[17px]' alt="" />
        </Button>
        <div className="py-14 space-y-6">
          <div className="front-card">
            <h1 className="text-[21px] text-[#141516] font-bold text-center">Front Card</h1>
            <div className="border border-[#DDDDE1] w-full max-w-[350px] h-[234px] rounded-[8px] shadow-2xl flex flex-col justify-center mx-auto mt-1 overflow-hidden">
              <div className="bg-[#43080D] p-3 text-center">
                <p className="text-[18px] text-white font-semibold">Commercial Driver’s License</p>
              </div>
              <div className="p-3 flex">
                <img src={driver} className="w-[110px] h-[162px]" alt="" />
                <div className="w-full pl-2.5">
                  <div className="flex justify-between text-[14px] text-[#2C2F32] font-bold">
                    <p>ID: <span>B456788</span></p>
                    <p>Class <span>B</span></p>
                  </div>
                  <h1 className="text-[18px] text-[#2C2F32] font-extrabold py-1">MARK TOMMAY</h1>
                  <div className="text-[14px] text-[#2C2F32] font-bold space-y-3">
                    <p>Exp Date: <span className="bg-[#DDDDE1] px-1.5 py-0.5">7.8.2027</span></p>
                    <p>Renewal Date: <span className="bg-[#DDDDE1] px-1.5 py-0.5">8.8.2027</span></p>
                  </div>
                  <div className="flex items-center w-full justify-end space-x-1 mt-5">
                    <img src={greentickicon} className="w-[16px] h-[16px]" alt="" />
                    <p className="text-[#408235] text-[14px] font-semibold">Verified</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="back-card">
            <h1 className="text-[21px] text-[#141516] font-bold text-center">Back Card</h1>
            <div className="border border-[#DDDDE1] w-full max-w-[350px] h-[234px] rounded-[8px] shadow-2xl flex flex-col justify-center mx-auto mt-1 overflow-hidden py-2 px-9">
              <div className="w-full">
                <div className="flex justify-between text-[14px] text-[#2C2F32] font-bold">
                  <p>Restrictions</p>
                  <p>ID: <span>B456788</span></p>
                </div>
                <ul className="text-[12px] leading-tight text-[#2C2F32] list-disc font-medium space-y-2 pt-3">
                  <li>Lorem ipsum dolor sit amet, consectetur adipiscing</li>
                  <li>elit, sed do eiusmod tempor incididunt</li>
                  <li>ut labore et dolore magna aliqua. Ut enim ad minim</li>
                  <li>veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

      </Dialog>
    </>
  );
}
