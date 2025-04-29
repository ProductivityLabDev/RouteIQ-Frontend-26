import React from 'react';
import { TranspportVan } from '@/assets';
import { Typography, Button } from '@material-tailwind/react';
import { Box, Grid } from '@mui/material';
import { TranportInvoicedata } from '@/data/school-inovice-data';

const InvoiceTransport = () => {
    return (
        <section className="w-full h-full px-8 py-8">
            <Typography className="text-[23px] md:text-[32px] font-[700] text-[#000] mt-5 ps-2" sx={{ fontSize: { xs: '23px', md: '38px' }, fontWeight: 800 }}>GL # 202-05</Typography>
            <Box className="flex items-center mb-4">
                <div className='flex flex-row justify-between w-[100%] h-[26vh]'>
                    <div className='flex flex-row justify-center w-[40%] h-[20vh] gap-2 items-center'>
                        <img src={TranspportVan} alt="Transport Vendor" className="mr-4 h-[83px] w-[85px]" />
                        <div>
                            <Typography variant="h4">Transportation Vendor</Typography>
                            <Typography variant="h6">John Brandon</Typography>
                            <Typography variant="body2">789/1 Sector-2c, 38200 Gandhinagar, France</Typography>
                            <Typography variant="body2">848172194 | contact@beta.se</Typography>
                            <Typography variant="body2" className='font-normal'>SIRET: 362 521 879 00034</Typography>
                            <Typography variant="body2" className='font-normal'>VAT: 842-484021</Typography>
                        </div>
                    </div>
                    <div className='w-[100%] flex flex-row justify-end gap-20'>
                        <div className='flex flex-col w-[35%] items-end gap-4'>
                            <div className='bg-[#F4F5F6] w-[120px] h-[35px] rounded-[8px] pt-2'>
                                <Typography variant="lead" className='font-bold text-[12px] text-[#000] text-center'>#2020-05-0001</Typography>
                            </div>
                            <div className='flex flex-col items-end'>
                                <Typography variant="h6" className='text-[#667085] weight-[500] text-[13px]'>Total Amount</Typography>
                                <Typography variant="h5">€250,000.00</Typography>
                            </div>
                        </div>
                        <div className='flex flex-col gap-3 w-[30%]'>
                            <div className="bg-white rounded-lg shadow-md p-4 w-full max-w-[400px] h-[8vh]">
                                <Button className="bg-[#C01824] text-white px-6 py-3 rounded-md w-full text-sm font-normal">
                                    Send
                                </Button>
                            </div>
                            <div className="bg-white rounded-lg shadow-md w-[100%] max-w-[400px]">
                                <div className="mt-2">
                                    <h3 className="text-gray-800 text-lg ps-4 font-bold mb-4 border-b border-grey p-3">
                                        Summary
                                    </h3>
                                    <div className="space-y-2">
                                        <div className="flex justify-between p-3">
                                            <span className="text-black-600 text-md font-bold">Total</span>
                                            <span className="text-gray-800 text-md font-medium">€250,000 Incl. VAT</span>
                                        </div>
                                        <div className="flex justify-between p-4">
                                            <span className="text-black-600 text-md font-bold">Deposit No. 2020-04-0006</span>
                                        </div>
                                        <div className="flex justify-between w-[79%] ms-10">
                                            <span className="text-gray-600 text-md font-medium">Total Mileage</span>
                                            <span className="text-gray-800 text-md font-bold">€1250</span>
                                        </div>
                                        <div className="flex justify-between w-[79%] ms-10">
                                            <span className="text-gray-600 text-md font-medium">Total Amount</span>
                                            <span className="text-gray-800 text-md font-bold">€250,000</span>
                                        </div>
                                        <div className="flex justify-between w-[79%] ms-10">
                                            <span className="text-gray-600 text-md font-medium">Total VAT</span>
                                            <span className="text-gray-800 text-md font-bold">€0</span>
                                        </div>
                                        <div className="flex justify-between w-[80%] ms-9 py-4 border-t border-grey">
                                            <span className="text-black-600 text-md font-bold">Total Price</span>
                                            <span className="text-gray-800 text-md font-bold">€250,000.00</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Box>
            <Box className="mb-4 gap-7 flex flex-row">
                <div className='bg-white rounded-lg shadow-md p-4 w-[16%] h-[25vh] flex flex-col'>
                    <Typography variant="h6">Bill Date</Typography>
                    <Typography variant="body2" className='font-normal'>03/05/2020</Typography>
                    <Typography variant="body2">Delivery Date</Typography>
                    <Typography variant="body2" className='font-normal'>03/05/2020</Typography>
                    <Typography variant="body2">Terms of Payment</Typography>
                    <Typography variant="body2" className='font-normal'>Within 15 days</Typography>
                    <Typography variant="body2">Payment Deadline</Typography>
                    <Typography variant="body2" className='font-normal'>05/18/2020</Typography>
                </div>
                <Box className="mb-4 m-3">
                    <Typography variant="h6">Maplebrook Country Day School</Typography>
                    <Typography variant="body2">1445 West Norwood Avenue, Itasca, Illinois, USA</Typography>
                    <Typography variant="body2">97223041054 | om@om.com</Typography>
                    <Typography variant="body2" className='font-normal'>SIRET: 362 521 879 00034</Typography>
                    <Typography variant="body2" className='font-normal'>VAT: 842-484021</Typography>
                    <Typography variant="body2">Note</Typography>
                    <Typography variant="body2" className='font-bold break-words max-w-xl'>This is a custom message that might be relevant to the customer. It can span up to three or four rows. It can span up to three or four rows.</Typography>
                </Box>
            </Box>
            <div className="overflow-x-auto">
                <table className="min-w-full">
                    <thead className="bg-white">
                        <tr>
                            <th className="px-6 py-3 border-b text-left text-sm font-medium text-gray-700">NO.</th>
                            <th className="px-6 py-3 border-b text-left text-sm font-medium text-gray-700">BUSES</th>
                            <th className="px-6 py-3 border-b text-left text-sm font-medium text-gray-700">UNIT PRICE</th>
                            <th className="px-6 py-3 border-b text-left text-sm font-medium text-gray-700">MILEAGE</th>
                            <th className="px-6 py-3 border-b text-left text-sm font-medium text-gray-700">TOTAL AMOUNT</th>
                        </tr>
                    </thead>
                    <tbody>
                        {TranportInvoicedata.map((item, index) => (
                            <tr key={index} className={'bg-[tranparent]'}>
                                <td className="px-6 py-4 border-b border-gray-300 text-sm font-medium text-gray-900">{index + 1}</td>
                                <td className="px-6 py-4 border-b border-gray-300 text-sm font-medium text-gray-900">{item.buses}</td>
                                <td className="px-6 py-4 border-b border-gray-300 text-sm font-medium text-gray-900">{item.unitPrice}</td>
                                <td className="px-6 py-4 border-b border-gray-300 text-sm font-medium text-gray-900">{item.mileage}</td>
                                <td className="px-6 py-4 border-b border-gray-300 text-sm font-medium text-gray-900">{item.totalAmount}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="mt-4 flex flex-row w-[85%] justify-between h-[17vh]">
                    <div className="mt-4 flex flex-col">
                        <p className="text-sm font-medium text-gray-700">
                            Terms & Conditions
                        </p>
                        <p className="text-sm font-medium text-gray-700">
                            Please pay within 15 days of receiving this invoice.
                        </p>
                    </div>
                    <div className='flex flex-col gap-4 w-[20%]'>
                        <div className='flex flex-row justify-between w-[100%]'>
                            <Typography variant="body2" className='font-normal text-[#667085]'>Total Mileage</Typography>
                            <Typography variant="body2" className='font-normal text-[#000]'>€1250</Typography>
                        </div>
                        <div className='flex flex-row justify-between w-[100%]'>
                            <Typography variant="body2" className='font-normal text-[#667085]'>Total Amount</Typography>
                            <Typography variant="body2" className='font-normal text-[#000]'>€250,000</Typography>
                        </div>
                        <div className='flex flex-row justify-between w-[100%]'>
                            <Typography variant="body2" className='font-normal text-[#667085]'>Total VAT</Typography>
                            <Typography variant="body2" className='font-normal text-[#000]'>€0</Typography>
                        </div>
                        <div className='flex flex-row justify-between w-[100%]'>
                            <Typography variant="body2" className='font-bold text-[#000]'>Total Price</Typography>
                            <Typography variant="body2" className='font-bold text-[#000]'>€250,000.00</Typography>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default InvoiceTransport;