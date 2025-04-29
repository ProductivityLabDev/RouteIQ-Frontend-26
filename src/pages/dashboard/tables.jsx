import React from 'react';
import { Typography, Card, Button } from '@material-tailwind/react';
import { useNavigate } from 'react-router-dom';

export function TableComponent({ title, link, tableHead, tableRows }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(link, { state: { tab: title } });
  };
  return (
    <div className="bg-white h-fit px-4 py-4 rounded-[4px]">
      <div className="flex items-center justify-between pl-3">
        <Typography variant="h4" className="font-bold text-[24px]">{title}</Typography>
        {link && (
          <Button onClick={handleClick} variant="text" className="bg-transparent shadow-none text-[#C01824] text-[12px] mb-2">View All</Button>
        )}
      </div>
      <Card className="h-full w-full overflow-auto rounded-[6px]">
        <table className="w-full min-w-max table-auto text-left">
          <thead>
            <tr>
              {tableHead.map((head) => (
                <th key={head} className="border-b border-blue-gray-100 bg-[#EEEEEE] px-5 py-4">
                  <Typography color="blue-gray" className="font-bold text-[#141516] leading-none text-[14px]">{head}</Typography>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableRows.map(({ id, name, grade, lastname, contact }, index) => {
              const isLast = index === tableRows.length - 1;
              const classes = isLast ? "py-3 px-5" : "py-3 px-5 border-b border-[#D9D9D9]";
              return (
                <tr key={id}>
                  <td className={classes}><Typography className="font-semibold text-[14px] text-[#141516]">{name}</Typography></td>
                  <td className={classes}><Typography className="font-semibold text-[14px] text-[#141516]">{lastname}</Typography></td>
                  <td className={classes}><Typography className="font-semibold text-[14px] text-[#141516]">{grade}</Typography></td>
                  <td className={classes}><Typography className="font-semibold text-[14px] text-[#141516]">{contact}</Typography></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
    </div>
  );
};