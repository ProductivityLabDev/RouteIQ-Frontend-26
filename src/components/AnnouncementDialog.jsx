import React from 'react';
import { Dialog, DialogBody, IconButton } from "@material-tailwind/react";
import { announcementcardimg, closeicon } from '@/assets';

const AnnouncementDialog = ({ size, handleOpen }) => (
  <Dialog
    open={size === "sm"}
    size={size || "lg"}
    handler={handleOpen}
    className="text-center text-balance flex h-[450px] items-center flex-col overflow-hidden rounded-2xl relative"
  >
    <img src={announcementcardimg} className='w-full h-[200px] p-3 object-cover rounded-3xl' alt="not found" />

    <div className='p-2 text-[24px] font-bold text-black flex justify-between items-center'>
      <span>Report Heading</span>

    </div>

    <DialogBody className="overflow-y-auto mb-2 text-[14px] text-[#151920]/80">
      The key to more success is to have a lot of pillows. Put it this way,
      it took me twenty five years to get these plants, twenty five years of
      blood sweat and tears, and I&apos;m never giving up, I&apos;m just
      getting started. I&apos;m up to something. Fan luv. Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quia amet id modi porro iste error odit nihil iure, nulla deserunt unde? Nostrum, molestias? Itaque, obcaecati repellat velit quis unde hic.
    </DialogBody>
    <div className='absolute top-6 right-6'>
      <IconButton
        size="small"
        className='bg-none bg-transparent'
        onClick={() => handleOpen(null)}
      >
        <img src={closeicon} alt="close" className="w-4 h-4" />
      </IconButton>
    </div>
  </Dialog>
);

export default AnnouncementDialog;
