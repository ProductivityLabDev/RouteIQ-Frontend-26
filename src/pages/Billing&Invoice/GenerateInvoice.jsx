import React from 'react'
import { Button, Card, CardBody, Typography } from '@material-tailwind/react'
import { CiSearch } from 'react-icons/ci'
import { Box, CardContent } from '@mui/material'
import { TranportInvoicedata } from '@/data/school-inovice-data'
import { Driver6, InvoiceTransportLogo } from '@/assets'

const GenerateInvoice = () => {
    return (
        <section className='w-[100%] h-[100%]'>
            {/* ------------------- Header Content --------------------- */}
            <div className='w-[98%] flex flex-col md:flex-row bg-red justify-between h-[auto] md:h-[45px] mt-6 mb-6 p-4 md:p-0'>
                <div className='flex flex-col justify-center w-full md:w-[50%] h-auto md:h-[50px] text-start p-2'>
                    <Typography className="text-[23px] md:text-[32px] font-[700] text-black">
                        GL # 202-05
                    </Typography>
                    <Typography className="text-[15px] md:text-[15px] font-[700] text-[#667085]">
                        Paid on June 27, 2023
                    </Typography>
                </div>
                <div className="w-full md:w-[25%] flex items-center bg-white  rounded-[12px] p-2 md:ml-auto mt-4 md:mt-0">
                    <CiSearch size={25} color='#787878' />
                    <input
                        type='search'
                        placeholder="Search"
                        className='w-full text-[#090909] font-light outline-none rounded-[6px] p-2'
                    />
                </div>
            </div>
            <div className="flex flex-row w-full justify-between gap-x-6 lg:gap-x-9 xl:gap-x-10">
                <Card className="w-full lg:w-[87%] max-w-screen-xl shadow-lg rounded-lg">
                    <Box className="flex flex-col gap-4 w-full max-w-screen-xl mx-auto p-4">
                        <Box className="flex flex-col md:flex-row justify-between items-center md:items-start mb-4">
                            <Box className="flex items-center w-full md:w-[45%] mb-4 md:mb-0">
                                <img
                                    src={InvoiceTransportLogo}
                                    alt="Transport Vendor"
                                    className="h-[150px] w-[150px] md:h-[200px] md:w-[200px] mr-4"
                                />
                                <Box>
                                    <Typography variant="h4" className="text-gray-900 font-bold">Transportation Vendor</Typography>
                                    <Typography variant="h6" className="text-gray-600">John Brandon</Typography>
                                    <Typography variant="body2" className="text-gray-600">789/1 Sector-2c, 38200 Gandhinagar, France</Typography>
                                    <Typography variant="body2" className="text-gray-600">848172194 | contact@beta.se</Typography>
                                    <Typography variant="body2" className="text-gray-600 font-normal">SIRET: 362 521 879 00034</Typography>
                                    <Typography variant="body2" className="text-gray-600 font-normal">VAT: 842-484021</Typography>
                                </Box>
                            </Box>
                            <Box className="flex flex-col w-full md:w-auto items-end gap-4">
                                <Box className="bg-gray-200 w-[120px] h-[35px] rounded-lg flex items-center justify-center">
                                    <Typography variant="subtitle1" className="font-bold text-[12px] text-black">#2020-05-0001</Typography>
                                </Box>
                                <Box className="flex flex-col items-end">
                                    <Typography variant="h6" className="text-gray-500 font-medium text-[13px]">Total Amount</Typography>
                                    <Typography variant="h5" className="text-gray-900 font-bold">€4,400.00</Typography>
                                </Box>
                            </Box>
                        </Box>
                        <CardContent>
                            <Box className="flex flex-col md:flex-row w-full gap-12 pt-3 ps-4 border border-gray-200 rounded-[12px]">
                                <Box className="bg-[#FAFAFA] rounded-lg shadow-md p-4 w-full md:w-[27%] h-auto md:h-[33vh] gap-2 flex flex-col">
                                    <Typography variant="h6">Bill Date</Typography>
                                    <Typography variant="body2" className="font-normal">03/05/2020</Typography>
                                    <Typography variant="body2">Delivery Date</Typography>
                                    <Typography variant="body2" className="font-normal">03/05/2020</Typography>
                                    <Typography variant="body2">Terms of Payment</Typography>
                                    <Typography variant="body2" className="font-normal">Within 15 days</Typography>
                                    <Typography variant="body2">Payment Deadline</Typography>
                                    <Typography variant="body2" className="font-normal">05/18/2020</Typography>
                                </Box>
                                <Box className="w-full md:w-[50%]">
                                    <Typography variant="h5" className="text-gray-900 font-bold">Payment Details</Typography>
                                    <Box className="flex items-center gap-4 mt-2">
                                        <img src={Driver6} className="rounded-full w-12 h-12" alt="Driver" />
                                        <Box>
                                            <Typography variant="h6" className="text-gray-900">Alrene McCoy</Typography>
                                            <Typography variant="subtitle1" className="text-gray-600">Employee ID: B456788</Typography>
                                        </Box>
                                    </Box>
                                    <Typography variant="h5" className="text-gray-900 font-bold mt-4">Beneficiary Bank Details</Typography>
                                    <Box className="flex flex-col gap-2 mt-2">
                                        <Typography variant="subtitle1" className="text-gray-600">Bank Name: Bank Name</Typography>
                                        <Typography variant="subtitle1" className="text-gray-600">IBAN: 97223041054</Typography>
                                        <Typography variant="subtitle1" className="text-gray-600">Address: 3549 Dietrich Burgs Apt. 808</Typography>
                                    </Box>
                                    <Typography variant="h5" className="text-gray-900 font-bold mt-4">Note</Typography>
                                    <Typography variant="body2" className="text-gray-600 mt-2">
                                        This is a custom message that might be relevant to the customer. It can span up to three or four rows. It can span up to three or four rows.
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Box>
                    {/* ------------------------ Table-Content-------------------------------------- */}
                    <div className="overflow-x-auto mt-3">
                        <table className="min-w-full">
                            <thead className="bg-[#FAFAFA]">
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
                                    <tr key={index} className="bg-[transparent]">
                                        <td className="px-6 py-4 border-b border-gray-300 text-sm font-medium text-gray-900">{index + 1}</td>
                                        <td className="px-6 py-4 border-b border-gray-300 text-sm font-medium text-gray-900">{item.buses}</td>
                                        <td className="px-6 py-4 border-b border-gray-300 text-sm font-medium text-gray-900">{item.unitPrice}</td>
                                        <td className="px-6 py-4 border-b border-gray-300 text-sm font-medium text-gray-900">{item.mileage}</td>
                                        <td className="px-6 py-4 border-b border-gray-300 text-sm font-medium text-gray-900">{item.totalAmount}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="mt-4 flex flex-col md:flex-row w-full md:w-[85%] justify-between h-auto md:h-[17vh]">
                            <div className="justify-end ps-6 flex flex-col">
                                <p className="text-sm font-medium text-gray-700">
                                    Terms & Conditions
                                </p>
                                <p className="text-sm font-[500] text-[#333843]">
                                    Please pay within 15 days of receiving this invoice.
                                </p>
                            </div>
                            <div className="flex flex-col gap-4 w-full md:w-[20%]">
                                <div className="flex flex-row justify-between w-full">
                                    <Typography variant="body2" className="font-normal text-[#667085]">Total Mileage</Typography>
                                    <Typography variant="body2" className="font-normal text-[#000]">€1250</Typography>
                                </div>
                                <div className="flex flex-row justify-between w-full">
                                    <Typography variant="body2" className="font-normal text-[#667085]">Total Amount</Typography>
                                    <Typography variant="body2" className="font-normal text-[#000]">€250,000</Typography>
                                </div>
                                <div className="flex flex-row justify-between w-full">
                                    <Typography variant="body2" className="font-normal text-[#667085]">Total VAT</Typography>
                                    <Typography variant="body2" className="font-normal text-[#000]">€0</Typography>
                                </div>
                                <div className="flex flex-row justify-between w-full">
                                    <Typography variant="body2" className="font-bold text-[#000]">Total Price</Typography>
                                    <Typography variant="body2" className="font-bold text-[#000]">€250,000.00</Typography>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Second div */}
                <div className='flex flex-col gap-3 w-[30%]'>
                    <div className="bg-white rounded-lg shadow-md p-4 w-full max-w-[350px] h-[8vh]">
                        <Button className="bg-[#C01824] text-white px-6 py-3 rounded-md w-full text-sm font-normal">
                            Pay
                        </Button>
                    </div>
                    <div className="bg-white rounded-lg shadow-md w-[92%] max-w-[400px]">
                        <div className="mt-2">
                            <h3 className="text-gray-800 text-lg ps-4 font-bold mb-4 border-b border-grey p-3">
                                Summary
                            </h3>
                            <div className="space-y-2">
                                <div className="flex justify-between p-3">
                                    <span className="text-black-600 text-md font-bold">Total</span>
                                    <span className="text-gray-800 text-md font-medium">€250,000 Incl. VAT</span>
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
        </section>
    )
}

export default GenerateInvoice
