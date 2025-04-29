import React from 'react';
import {
    Typography,
    Avatar,
} from '@material-tailwind/react';

export const DriverInvoice = ({ name, id, hours, payroll, date, avatarSrc }) => (
    <div className="flex items-center py-4 border-b">
        <div className="flex items-center w-1/3">
            <Avatar src={avatarSrc} alt={name} size="md" className="mr-3" />
            <div>
                <Typography variant="h6" className="font-semibold">{name}</Typography>
                <Typography variant="small" color="gray">{id}</Typography>
            </div>
        </div>
        <div className="w-1/3 text-center">
            <Typography>{hours} hours</Typography>
        </div>
        <div className="w-1/3 text-right">
            <Typography className="font-semibold">${payroll}</Typography>
            <Typography variant="small" color="gray">{date}</Typography>
        </div>
    </div>
);