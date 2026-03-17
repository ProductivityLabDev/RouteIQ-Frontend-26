import React from 'react';
import { TranspportVan } from '@/assets';
import { Typography, Button } from '@material-tailwind/react';
import { Box } from '@mui/material';
import { TranportInvoicedata } from '@/data/school-inovice-data';
import { FaChevronLeft } from "react-icons/fa";
import EditInvoiceForm from './EditInvoiceForm ';

const pick = (...values) => values.find((value) => value !== undefined && value !== null && value !== "");

const formatCurrency = (value) => {
  const amount = Number(value ?? 0);
  return `$${amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const formatDate = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString("en-US");
};

const statusClassName = (status) => {
  if (status === "Open") return "bg-yellow-100 text-yellow-800";
  if (status === "Invoice Sent") return "bg-blue-100 text-blue-800";
  if (status === "Pending Payment") return "bg-orange-100 text-orange-800";
  if (status === "Paid") return "bg-green-100 text-green-800";
  return "bg-gray-100 text-gray-800";
};

const InvoiceForm = ({ handleback, schoolInvoice, invoiceData, setEditInvoice, editInvoice, handleBatchInvoice, batchInvoice }) => {
  const invoiceId = pick(invoiceData?.InvoiceId, invoiceData?.invoiceId, invoiceData?.id);
  const invoiceNumber = pick(invoiceData?.InvoiceNumber, invoiceData?.invoiceNumber, invoiceData?.invoiceNo, invoiceId, '12501');
  const billTo = pick(invoiceData?.BillTo, invoiceData?.billTo, invoiceData?.companyName, 'Maplebrook Country Day School');
  const billDate = formatDate(pick(invoiceData?.InvoiceDate, invoiceData?.invoiceDate, invoiceData?.date));
  const deliveryDate = formatDate(pick(invoiceData?.DeliveryDate, invoiceData?.deliveryDate));
  const dueDate = formatDate(pick(invoiceData?.DueDate, invoiceData?.dueDate));
  const invoiceType = pick(invoiceData?.InvoiceType, invoiceData?.type, invoiceData?.InvoiceMode, invoiceData?.invoiceMode, 'Monthly');
  const glCode = pick(invoiceData?.GLCode, invoiceData?.glCode, '-');
  const glCodeName = pick(invoiceData?.GLCodeName, invoiceData?.glCodeName, '');
  const totalAmount = formatCurrency(pick(invoiceData?.TotalAmount, invoiceData?.invoiceTotal, invoiceData?.totalAmount, 0));
  const subTotal = formatCurrency(pick(invoiceData?.SubTotal, invoiceData?.subTotal, 0));
  const taxAmount = formatCurrency(pick(invoiceData?.TaxAmount, invoiceData?.taxAmount, 0));
  const termsOfPayment = pick(invoiceData?.PaymentTerms, invoiceData?.paymentTerms, 'Within 15 days');
  const notes = pick(invoiceData?.Notes, invoiceData?.notes, 'No notes available.');
  const status = pick(invoiceData?.Status, invoiceData?.status, 'Open');
  const billFrom = pick(invoiceData?.BillFrom, invoiceData?.billFrom, 'RouteIQ Inc');
  const terminalName = pick(invoiceData?.terminalName, invoiceData?.TerminalName, invoiceData?.schoolName, '-');
  const vendorTitle = pick(invoiceData?.vendorCompany, billFrom, 'Transportation Vendor');
  const vendorName = pick(invoiceData?.vendorName, invoiceData?.createdByName, 'John Brandon');
  const vendorEmail = pick(invoiceData?.vendorEmail, invoiceData?.createdByName, '-');
  const vendorPhone = pick(invoiceData?.vendorPhone, '-');
  const createdByName = pick(invoiceData?.createdByName, '-');
  const noOfBuses = pick(invoiceData?.NoOfBuses, invoiceData?.noOfBuses, '-');
  const lineItems = Array.isArray(invoiceData?.lineItems) && invoiceData.lineItems.length > 0 ? invoiceData.lineItems : TranportInvoicedata;

  return (
    <section className="w-full h-full px-8 py-8">
      {editInvoice ? (
        <div className='w-full'>
          <div className="flex justify-between items-center my-3 pb-2">
            <div className="flex w-full justify-between items-center mt-3 pb-2">
              <div className="flex flex-col items-center gap-2">
                <h2 className="text-[22px] lg:text-[26px] xl:text-[29px] font-bold text-black">
                  Edit Invoice
                </h2>
                {batchInvoice && (
                  <h2 className="text-[22px] ps-12 lg:text-[26px] xl:text-[29px] mx-3 font-bold text-black">
                    {`Invoice # ${invoiceNumber}`}
                  </h2>
                )}
              </div>
              <div className="flex flex-row items-center flex-wrap gap-4 justify-end">
                <Button
                  className="border border-[#C01824] bg-transparent text-[#C01824] px-12 py-2 rounded-[4px]"
                  variant="outlined"
                  size="lg"
                  onClick={() => setEditInvoice(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="bg-[#C01824] md:!px-10 !py-3 capitalize text-sm md:text-[16px] font-normal flex items-center"
                  variant="filled"
                  size="lg"
                  onClick={() => setEditInvoice(false)}
                >
                  Save Invoice
                </Button>
              </div>
            </div>
          </div>
          <EditInvoiceForm batchInvoice={batchInvoice} />
        </div>
      ) : (
        <>
          <div className='flex flex-row items-center'>
            <FaChevronLeft color='#C01824' size={33} className='cursor-pointer' onClick={handleback} />
            <Typography className="text-[23px] md:text-[32px] font-[700] text-[#000] mt-0 ps-2" sx={{ fontSize: { xs: '23px', md: '38px' }, fontWeight: 800 }}>
              {`Invoice # ${invoiceNumber}`}
            </Typography>
          </div>
          {invoiceData && (
            <div className="mt-4 grid grid-cols-1 gap-4 rounded-xl border border-[#E7EAF3] bg-[#F8FAFC] p-4 md:grid-cols-5">
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8A94A6]">Bill Date</div>
                <div className="mt-1 text-sm font-semibold text-[#141516]">{billDate}</div>
              </div>
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8A94A6]">Bill To</div>
                <div className="mt-1 text-sm font-semibold text-[#141516]">{billTo}</div>
              </div>
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8A94A6]">Invoice Type</div>
                <div className="mt-1 text-sm font-semibold text-[#141516]">{invoiceType}</div>
              </div>
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8A94A6]">GL Code</div>
                <div className="mt-1 text-sm font-semibold text-[#141516]">{glCode}{glCodeName ? ` - ${glCodeName}` : ''}</div>
              </div>
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8A94A6]">Invoice Total</div>
                <div className="mt-1 text-sm font-semibold text-[#141516]">{totalAmount}</div>
              </div>
            </div>
          )}
          <div className='bg-white rounded-lg shadow-md p-4 my-3 w-full'>
            <Box className="flex items-center mb-4">
              <div className='flex flex-row justify-between w-[100%] h-[26vh]'>
                <div className='flex flex-row justify-center w-[40%] h-[20vh] gap-2 items-center'>
                  <img src={TranspportVan} alt="Transport Vendor" className="mr-4 h-[80px] w-[100px]" />
                  <div>
                    <Typography variant="h4">{vendorTitle}</Typography>
                    <Typography variant="h6" className='text-[#667085] text-[12px] font-normal'>{vendorName}</Typography>
                    <Typography variant="body2" className='text-[#667085] text-[12px] font-normal'>{billFrom}</Typography>
                    <Typography variant="body2" className='text-[#667085] text-[12px] font-normal'>{vendorPhone} | {vendorEmail}</Typography>
                    <Typography variant="body2" className='text-[#667085] text-[12px] font-semibold'>Created By: {createdByName}</Typography>
                    <Typography variant="body2" className='text-[#667085] text-[12px] font-semibold'>Status: {status}</Typography>
                  </div>
                </div>
                <div className='w-[100%] flex flex-row justify-end gap-20'>
                  <div className='flex flex-col w-[35%] items-end gap-4'>
                    <div className='bg-[#F4F5F6] w-[120px] h-[35px] rounded-[8px] pt-2'>
                      <Typography variant="lead" className='font-bold text-[12px] text-[#000] text-center'>{`${invoiceNumber}`}</Typography>
                    </div>
                    <div className='flex flex-col items-end'>
                      <Typography variant="h6" className='text-[#667085] weight-[500] text-[13px]'>Total Amount</Typography>
                      <Typography variant="h5" className='text-[#333843] weight-[700] text-[19px]'>{totalAmount}</Typography>
                    </div>
                  </div>
                  <div className='flex flex-col gap-3 w-[30%]'>
                    {schoolInvoice && (
                      <div className="bg-white rounded-2xl shadow-lg w-full max-w-[500px] p-6 border border-gray-200">
                        <div className="flex flex-col gap-4">
                          <Button
                            className="bg-[#C01824] hover:bg-[#a8141e] transition-all duration-300 text-white px-6 py-3 capitalize text-sm md:text-base font-medium rounded-lg flex items-center justify-center"
                            variant="filled"
                            size="md"
                          >
                            Send
                          </Button>
                          <Button
                            className="bg-[#C01824] hover:bg-[#a8141e] transition-all duration-300 text-white px-6 py-3 capitalize text-sm md:text-base font-medium rounded-lg flex items-center justify-center"
                            variant="filled"
                            size="md"
                            onClick={() => setEditInvoice(true)}
                          >
                            Edit Invoice
                          </Button>
                          <Button
                            className="bg-[#C01824] hover:bg-[#a8141e] transition-all duration-300 text-white px-6 py-3 capitalize text-sm md:text-base font-medium rounded-lg flex items-center justify-center"
                            variant="filled"
                            size="md"
                            onClick={handleBatchInvoice}
                          >
                            Convert Into Batch Invoice
                          </Button>
                        </div>
                      </div>
                    )}
                    <div className="bg-white rounded-lg shadow-md w-[100%] max-w-[400px]">
                      <div className="mt-2">
                        <h3 className="text-gray-800 text-lg ps-4 font-bold mb-4 border-grey p-3">
                          Summary
                        </h3>
                        <div className="space-y-2">
                          <div className="flex justify-between p-3 bg-[#FAFAFA]">
                            <span className="text-black-600 text-md font-bold">Total</span>
                            <span className="text-gray-800 text-md font-medium">{totalAmount}</span>
                          </div>
                          <div className="flex justify-between p-4">
                            <span className="text-black-600 text-md font-bold">Invoice #{invoiceNumber}</span>
                          </div>
                          <div className="flex justify-between w-[79%] ms-10">
                            <span className="text-gray-600 text-md font-medium">No. of Buses</span>
                            <span className="text-gray-800 text-md font-bold">{noOfBuses}</span>
                          </div>
                          <div className="flex justify-between w-[79%] ms-10">
                            <span className="text-gray-600 text-md font-medium">Total Amount</span>
                            <span className="text-gray-800 text-md font-bold">{subTotal}</span>
                          </div>
                          <div className="flex justify-between w-[79%] ms-10">
                            <span className="text-gray-600 text-md font-medium">Total VAT</span>
                            <span className="text-gray-800 text-md font-bold">{taxAmount}</span>
                          </div>
                          <div className="flex justify-between w-[80%] ms-9 py-4 border-t border-grey">
                            <span className="text-black-600 text-md font-bold">Total Price</span>
                            <span className="text-gray-800 text-md font-bold">{totalAmount}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Box>
            <Box className="mb-4 gap-7 flex flex-row">
              <div className='bg-[#FAFAFA] rounded-lg shadow-md p-5 w-[16%] h-[25vh] flex flex-col'>
                <Typography variant="h6" className='text-[#667085] font-normal'>Bill Date</Typography>
                <Typography variant="body2" className='font-semibold'>{billDate}</Typography>
                <Typography variant="body2" className='text-[#667085] font-semibold'>Delivery Date</Typography>
                <Typography variant="body2" className='font-normal'>{deliveryDate}</Typography>
                <Typography variant="body2" className='text-[#667085] font-semibold'>Terms of Payment</Typography>
                <Typography variant="body2" className='font-normal'>{termsOfPayment}</Typography>
                <Typography variant="body2" className='text-[#667085] font-semibold'>Payment Deadline</Typography>
                <Typography variant="body2" className='font-semibold'>{dueDate}</Typography>
              </div>
              <Box className="mb-4 m-3">
                <Typography variant="h6" className='text-[#667085] text-[12px] font-normal'>Billing Address</Typography>
                <Typography variant="h6" className='text-[#333843] text-[14px] font-semibold'>{billTo}</Typography>
                <Typography variant="body2" className='text-[#667085] text-[14px] font-normal'>{terminalName}</Typography>
                <Typography variant="body2" className='text-[#667085] text-[14px] font-normal'>{invoiceType} | {status}</Typography>
                <Typography variant="body2" className='font-semibold text-[#667085] text-[14]'>Bill From: {billFrom}</Typography>
                <Typography variant="body2" className='font-semibold text-[#667085] text-[14]'>GL Code: {glCode}{glCodeName ? ` - ${glCodeName}` : ''}</Typography>
                <Typography variant="body2" className='text-[#667085] text-[12px]'>Note</Typography>
                <Typography variant="body2" className='font-medium text-[#333843] text-[12px] break-words w-[500px]'>{notes}</Typography>
              </Box>
            </Box>
            <div className="overflow-x-auto">
              <table className={`${schoolInvoice ? 'min-w-[70%]' : 'min-w-full'} mt-[100px]`}>
                <thead className="bg-[#FAFAFA]">
                  <tr>
                    <th className="px-6 py-3 border-b text-left text-[11px] font-medium text-[#667085]">NO.</th>
                    <th className="px-6 py-3 border-b text-left text-[11px] font-medium text-[#667085]">Assignment</th>
                    <th className="px-6 py-3 border-b text-left text-[11px] font-medium text-[#667085]">GL Code ID</th>
                    <th className="px-6 py-3 border-b text-left text-[11px] font-medium text-[#667085]">Description</th>
                    <th className="px-6 py-3 border-b text-left text-[11px] font-medium text-[#667085]">Vehicle</th>
                    <th className="px-6 py-3 border-b text-left text-[11px] font-medium text-[#667085]">BUSES</th>
                    <th className="px-6 py-3 border-b text-left text-[11px] font-medium text-[#667085]">UNIT PRICE</th>
                    <th className="px-6 py-3 border-b text-left text-[11px] font-medium text-[#667085]">QUANTITY</th>
                    <th className="px-6 py-3 border-b text-left text-[11px] font-medium text-[#667085]">TOTAL AMOUNT</th>
                    <th className="px-6 py-3 border-b text-left text-[11px] font-medium text-[#667085]">STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {lineItems.map((item, index) => {
                    const rowStatus = pick(item.status, status);
                    const isApiLineItem = item.LineItemId || item.InvoiceId || item.assignmentName;
                    return (
                      <tr key={item.LineItemId || index} className='bg-[tranparent]'>
                        <td className="px-6 py-4 border-b border-gray-300 text-sm font-medium text-gray-900">{index + 1}</td>
                        <td className="px-6 py-4 border-b border-gray-300 text-sm font-medium text-gray-900">{pick(item.assignmentName, item.routeNumber, "-")}</td>
                        <td className="px-6 py-4 border-b border-gray-300 text-sm font-medium text-gray-900">{pick(item.GLCodeId, item.glCodeId, item.tripNumber, "-")}</td>
                        <td className="px-6 py-4 border-b border-gray-300 text-sm font-medium text-gray-900">{pick(item.ItemDescription, item.itemDescription, item.routeDescription, "-")}</td>
                        <td className="px-6 py-4 border-b border-gray-300 text-sm font-medium text-gray-900">{pick(item.VehicleName, item.vehicleName, item.NumberPlate, item.numberPlate, item.tripDescription, "-")}</td>
                        <td className="px-6 py-4 border-b border-gray-300 text-sm font-medium text-gray-900">{isApiLineItem ? noOfBuses : pick(item.buses, "-")}</td>
                        <td className="px-6 py-4 border-b border-gray-300 text-sm font-medium text-gray-900">{isApiLineItem ? formatCurrency(pick(item.UnitPrice, item.unitPrice, 0)) : pick(item.unitPrice, "-")}</td>
                        <td className="px-6 py-4 border-b border-gray-300 text-sm font-medium text-gray-900">{pick(item.Quantity, item.quantity, item.mileage, 0)}</td>
                        <td className="px-6 py-4 border-b border-gray-300 text-sm font-medium text-gray-900">{isApiLineItem ? formatCurrency(pick(item.TotalAmount, item.totalAmount, 0)) : pick(item.totalAmount, "-")}</td>
                        <td className="px-6 py-4 border-b border-gray-300">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${statusClassName(rowStatus)}`}>
                            {rowStatus}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <div className="mt-4 flex flex-row w-[85%] justify-between h-[17vh]">
                <div className="mt-4 flex flex-col">
                  <p className="text-sm font-medium text-gray-700">Terms & Conditions</p>
                  <p className="text-sm font-medium text-[#333843]">
                    {notes}
                  </p>
                </div>
                <div className='flex flex-col gap-4 w-[20%]'>
                  <div className='flex flex-row justify-between w-[100%]'>
                    <Typography variant="body2" className='font-normal text-[#667085]'>No. of Buses</Typography>
                    <Typography variant="body2" className='font-normal text-[#000]'>{noOfBuses}</Typography>
                  </div>
                  <div className='flex flex-row justify-between w-[100%]'>
                    <Typography variant="body2" className='font-normal text-[#667085]'>Total Amount</Typography>
                    <Typography variant="body2" className='font-normal text-[#000]'>{subTotal}</Typography>
                  </div>
                  <div className='flex flex-row justify-between w-[100%]'>
                    <Typography variant="body2" className='font-normal text-[#667085]'>Total VAT</Typography>
                    <Typography variant="body2" className='font-normal text-[#000]'>{taxAmount}</Typography>
                  </div>
                  <div className='flex flex-row justify-between w-[100%]'>
                    <Typography variant="body2" className='font-bold text-[#000]'>Total Price</Typography>
                    <Typography variant="body2" className='font-bold text-[#000]'>{totalAmount}</Typography>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </section>
  );
};

export default InvoiceForm;
