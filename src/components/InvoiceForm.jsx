import React, { useEffect, useMemo, useState } from 'react';
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

const toDateInputValue = (value) => {
  if (!value) return "";
  const s = String(value);
  if (/^\d{4}-\d{2}-\d{2}/.test(s)) return s.slice(0, 10);
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? "" : d.toISOString().slice(0, 10);
};

const buildEditFormFromInvoice = (invoice) => {
  if (!invoice) return null;
  const rawItems = Array.isArray(invoice.lineItems) ? invoice.lineItems : [];
  const lineItems =
    rawItems.length > 0
      ? rawItems.map((item, idx) => {
          const lid = item.LineItemId ?? item.lineItemId ?? item.id;
          return {
            id: lid != null && lid !== "" ? lid : idx + 1,
            itemDescription: pick(item.ItemDescription, item.itemDescription, item.routeDescription, "") || "",
            glCodeId: String(pick(item.GLCodeId, item.glCodeId, "") ?? ""),
            unitPrice:
              pick(item.UnitPrice, item.unitPrice, "") === "" || pick(item.UnitPrice, item.unitPrice, "") === undefined
                ? ""
                : String(pick(item.UnitPrice, item.unitPrice, "")),
            quantity:
              pick(item.Quantity, item.quantity, "") === "" || pick(item.Quantity, item.quantity, "") === undefined
                ? ""
                : String(pick(item.Quantity, item.quantity, "")),
            totalAmount:
              pick(item.TotalAmount, item.totalAmount, "") === "" || pick(item.TotalAmount, item.totalAmount, "") === undefined
                ? ""
                : String(pick(item.TotalAmount, item.totalAmount, "")),
            tripId: String(pick(item.TripId, item.tripId, "") ?? ""),
          };
        })
      : [
          {
            id: 1,
            itemDescription: "",
            glCodeId: "",
            unitPrice: "",
            quantity: "",
            totalAmount: "",
            tripId: "",
          },
        ];

  const headerGl = pick(
    invoice.GLCodeId,
    invoice.glCodeId,
    rawItems[0]?.GLCodeId,
    rawItems[0]?.glCodeId,
    ""
  );
  const subNum = Number(pick(invoice.SubTotal, invoice.subTotal, 0));
  const taxNum = Number(pick(invoice.TaxAmount, invoice.taxAmount, 0));

  return {
    terminalId: String(
      pick(invoice.TerminalId, invoice.terminalId, invoice.InstituteTerminalId, invoice.instituteTerminalId, "") ?? ""
    ),
    glCodeId: headerGl !== "" && headerGl !== undefined && headerGl !== null ? String(headerGl) : "",
    invoiceDate: toDateInputValue(pick(invoice.InvoiceDate, invoice.invoiceDate, invoice.date)),
    dueDate: toDateInputValue(pick(invoice.DueDate, invoice.dueDate)),
    billFrom: pick(invoice.BillFrom, invoice.billFrom, "RouteIQ Inc") || "",
    billTo: pick(invoice.BillTo, invoice.billTo, invoice.companyName, "") || "",
    subTotal: subNum ? String(Number(subNum.toFixed(2))) : "",
    taxAmount: taxNum ? String(Number(taxNum.toFixed(2))) : "",
    notes: pick(invoice.Notes, invoice.notes, "") || "",
    lineItems,
  };
};

const InvoiceForm = ({
  handleback,
  schoolInvoice,
  invoiceData,
  setEditInvoice,
  editInvoice,
  handleBatchInvoice,
  batchInvoice,
  terminals = [],
  glCodes = [],
  selectedSchoolName = "",
}) => {
  const editFormSeed = useMemo(() => buildEditFormFromInvoice(invoiceData), [invoiceData]);
  const [editFormData, setEditFormData] = useState(editFormSeed);

  useEffect(() => {
    if (editInvoice && editFormSeed) {
      setEditFormData(editFormSeed);
    }
  }, [editInvoice, editFormSeed]);

  const handleEditFormChange = (field, value) => {
    setEditFormData((prev) => {
      const base = prev ?? editFormSeed;
      if (!base) return { [field]: value };
      return { ...base, [field]: value };
    });
  };

  const effectiveEditForm = editFormData ?? editFormSeed;
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
    const notes = pick(
      invoiceData?.Notes,
      invoiceData?.notes,
      'Payment is due by the stated deadline. Please review all invoice details carefully and contact us promptly if you notice any discrepancy. Late or partial payments may affect service continuity under the applicable agreement.'
    );
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
          <EditInvoiceForm
            batchInvoice={batchInvoice}
            schoolInvoice={schoolInvoice}
            selectedSchoolName={selectedSchoolName}
            terminals={terminals}
            glCodes={glCodes}
            formData={effectiveEditForm}
            onFormChange={handleEditFormChange}
            isEditing
          />
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
            <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-4 rounded-xl border border-[#E7EAF3] bg-[#F8FAFC] p-5 sm:grid-cols-3 lg:grid-cols-5 lg:gap-x-8">
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#8A94A6]">Bill Date</div>
                <div className="mt-1.5 text-[15px] font-semibold leading-snug text-[#141516]">{billDate}</div>
              </div>
              <div className="min-w-0 lg:col-span-1">
                <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#8A94A6]">Bill To</div>
                <div className="mt-1.5 text-[15px] font-semibold leading-snug text-[#141516] break-words">{billTo}</div>
              </div>
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#8A94A6]">Invoice Type</div>
                <div className="mt-1.5 text-[15px] font-semibold leading-snug text-[#141516]">{invoiceType}</div>
              </div>
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#8A94A6]">GL Code</div>
                <div className="mt-1.5 text-[15px] font-semibold leading-snug text-[#141516]">{glCode}{glCodeName ? ` - ${glCodeName}` : ''}</div>
              </div>
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#8A94A6]">Invoice Total</div>
                <div className="mt-1.5 text-[15px] font-semibold leading-snug text-[#C01824]">{totalAmount}</div>
              </div>
            </div>
          )}
          <div className="my-4 w-full rounded-xl border border-[#E7EAF3] bg-white p-6 shadow-md md:p-8">
            <Box className="mb-8 border-b border-[#EEF1F6] pb-8">
              <div className="flex flex-col gap-8 xl:flex-row xl:items-start xl:justify-between">
                <div className="flex min-w-0 flex-1 flex-row items-start gap-5">
                  <img src={TranspportVan} alt="Transport Vendor" className="h-[76px] w-[96px] shrink-0 object-contain" />
                  <div className="min-w-0 space-y-1.5">
                    <Typography variant="h5" className="text-[#141516] !font-bold !tracking-tight">{vendorTitle}</Typography>
                    <Typography variant="body2" className="!text-[13px] !text-[#667085]">{vendorName}</Typography>
                    <Typography variant="body2" className="!text-[13px] !text-[#667085]">{billFrom}</Typography>
                    <Typography variant="body2" className="!text-[13px] !text-[#667085]">{vendorPhone} | {vendorEmail}</Typography>
                    <Typography variant="body2" className="!text-[13px] !font-semibold !text-[#445164]">Created By: {createdByName}</Typography>
                    <Typography variant="body2" className="!text-[13px] !font-semibold !text-[#445164]">Status: {status}</Typography>
                  </div>
                </div>
                <div className="flex shrink-0 flex-col gap-6 sm:flex-row sm:items-start xl:gap-8">
                  <div className="flex flex-col items-end gap-3 sm:min-w-[140px]">
                    <div className="rounded-lg bg-[#F4F5F6] px-4 py-2.5">
                      <Typography variant="body2" className="!text-center !text-[13px] !font-bold !text-[#141516]">{`${invoiceNumber}`}</Typography>
                    </div>
                    <div className="flex flex-col items-end text-right">
                      <Typography variant="body2" className="!text-[13px] !font-medium !text-[#667085]">Total Amount</Typography>
                      <Typography variant="h5" className="!mt-1 !text-[22px] !font-bold !text-[#141516]">{totalAmount}</Typography>
                    </div>
                  </div>
                  <div className="flex w-full min-w-[260px] max-w-[340px] flex-col gap-4">
                    {schoolInvoice && (
                      <div className="w-full rounded-xl border border-[#E7EAF3] bg-[#FAFBFD] p-5 shadow-sm">
                        <div className="flex flex-col gap-3">
                          <Button
                            className="bg-[#C01824] hover:bg-[#a8141e] text-white capitalize text-sm font-medium rounded-lg"
                            variant="filled"
                            size="md"
                          >
                            Send
                          </Button>
                          <Button
                            className="bg-[#C01824] hover:bg-[#a8141e] text-white capitalize text-sm font-medium rounded-lg"
                            variant="filled"
                            size="md"
                            onClick={() => setEditInvoice(true)}
                          >
                            Edit Invoice
                          </Button>
                          <Button
                            className="bg-[#C01824] hover:bg-[#a8141e] text-white capitalize text-sm font-medium rounded-lg"
                            variant="filled"
                            size="md"
                            onClick={handleBatchInvoice}
                          >
                            Convert Into Batch Invoice
                          </Button>
                        </div>
                      </div>
                    )}
                    <div className="w-full rounded-xl border border-[#E7EAF3] bg-[#FAFBFD] shadow-sm">
                      <h3 className="border-b border-[#EEF1F6] px-4 py-3 text-base font-bold text-[#141516]">
                        Summary
                      </h3>
                      <div className="space-y-0 px-1 pb-2">
                        <div className="flex justify-between px-4 py-3">
                          <span className="text-sm font-bold text-[#141516]">Total</span>
                          <span className="text-sm font-semibold text-[#333843]">{totalAmount}</span>
                        </div>
                        <div className="px-4 py-2">
                          <span className="text-sm font-bold text-[#141516]">Invoice #{invoiceNumber}</span>
                        </div>
                        <div className="flex justify-between px-4 py-2">
                          <span className="text-sm text-[#667085]">No. of Buses</span>
                          <span className="text-sm font-semibold text-[#141516]">{noOfBuses}</span>
                        </div>
                        <div className="flex justify-between px-4 py-2">
                          <span className="text-sm text-[#667085]">Total Amount</span>
                          <span className="text-sm font-semibold text-[#141516]">{subTotal}</span>
                        </div>
                        <div className="flex justify-between px-4 py-2">
                          <span className="text-sm text-[#667085]">Total VAT</span>
                          <span className="text-sm font-semibold text-[#141516]">{taxAmount}</span>
                        </div>
                        <div className="mx-3 flex justify-between border-t border-[#EEF1F6] px-1 py-4">
                          <span className="text-sm font-bold text-[#141516]">Total Price</span>
                          <span className="text-sm font-bold text-[#141516]">{totalAmount}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Box>
            <Box className="mb-8 flex flex-col gap-6 lg:flex-row lg:gap-8">
              <div className="flex shrink-0 flex-col gap-3 rounded-xl border border-[#E7EAF3] bg-[#FAFAFA] p-5 lg:max-w-[300px] lg:flex-1">
                <Typography variant="body2" className="!text-[12px] !font-medium !text-[#667085]">Bill Date</Typography>
                <Typography variant="body1" className="!text-[15px] !font-semibold !text-[#141516]">{billDate}</Typography>
                <Typography variant="body2" className="!mt-2 !text-[12px] !font-medium !text-[#667085]">Delivery Date</Typography>
                <Typography variant="body1" className="!text-[15px] !text-[#141516]">{deliveryDate}</Typography>
                <Typography variant="body2" className="!mt-2 !text-[12px] !font-medium !text-[#667085]">Terms of Payment</Typography>
                <Typography variant="body1" className="!text-[15px] !text-[#141516]">{termsOfPayment}</Typography>
                <Typography variant="body2" className="!mt-2 !text-[12px] !font-medium !text-[#667085]">Payment Deadline</Typography>
                <Typography variant="body1" className="!text-[15px] !font-semibold !text-[#141516]">{dueDate}</Typography>
              </div>
              <Box className="min-w-0 flex-1 rounded-xl border border-[#E7EAF3] bg-[#FAFBFC] p-5 lg:p-6">
                <Typography variant="body2" className="!text-[12px] !font-medium !text-[#667085]">Billing Address</Typography>
                <Typography variant="h6" className="!mt-1 !text-[17px] !font-bold !text-[#141516]">{billTo}</Typography>
                <Typography variant="body2" className="!mt-2 !text-[14px] !leading-relaxed !text-[#667085]">{terminalName}</Typography>
                <Typography variant="body2" className="!mt-3 !text-[14px] !text-[#667085]">{invoiceType} · {status}</Typography>
                <Typography variant="body2" className="!mt-4 !text-[14px] !font-semibold !text-[#445164]">Bill From: {billFrom}</Typography>
                <Typography variant="body2" className="!mt-1 !text-[14px] !font-semibold !text-[#445164]">GL Code: {glCode}{glCodeName ? ` - ${glCodeName}` : ''}</Typography>
                <Typography variant="body2" className="!mt-5 !text-[12px] !font-medium !text-[#667085]">Note</Typography>
                <Typography variant="body2" className="!mt-1 !max-w-3xl !text-[14px] !leading-relaxed !text-[#333843]">{notes}</Typography>
              </Box>
            </Box>
            <div className="overflow-x-auto rounded-xl border border-[#E7EAF3]">
              <table className="min-w-full">
                <thead className="bg-[#F4F5F7]">
                  <tr>
                    <th className="whitespace-nowrap px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-[#667085]">NO.</th>
                    <th className="whitespace-nowrap px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-[#667085]">Assignment</th>
                    <th className="whitespace-nowrap px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-[#667085]">GL Code ID</th>
                    <th className="whitespace-nowrap px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-[#667085]">Description</th>
                    <th className="whitespace-nowrap px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-[#667085]">Vehicle</th>
                    <th className="whitespace-nowrap px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-[#667085]">Buses</th>
                    <th className="whitespace-nowrap px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-[#667085]">Unit Price</th>
                    <th className="whitespace-nowrap px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-[#667085]">Quantity</th>
                    <th className="whitespace-nowrap px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-[#667085]">Total Amount</th>
                    <th className="whitespace-nowrap px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-[#667085]">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {lineItems.map((item, index) => {
                    const rowStatus = pick(item.status, status);
                    const isApiLineItem = item.LineItemId || item.InvoiceId || item.assignmentName;
                    return (
                      <tr key={item.LineItemId || index} className="bg-white hover:bg-[#FAFBFD]/80">
                        <td className="border-b border-[#EEF1F6] px-5 py-3.5 text-sm font-medium text-[#141516]">{index + 1}</td>
                        <td className="border-b border-[#EEF1F6] px-5 py-3.5 text-sm text-[#141516]">{pick(item.assignmentName, item.routeNumber, "-")}</td>
                        <td className="border-b border-[#EEF1F6] px-5 py-3.5 text-sm text-[#141516]">{pick(item.GLCodeId, item.glCodeId, item.tripNumber, "-")}</td>
                        <td className="border-b border-[#EEF1F6] px-5 py-3.5 text-sm text-[#141516]">{pick(item.ItemDescription, item.itemDescription, item.routeDescription, "-")}</td>
                        <td className="border-b border-[#EEF1F6] px-5 py-3.5 text-sm text-[#141516]">{pick(item.VehicleName, item.vehicleName, item.NumberPlate, item.numberPlate, item.tripDescription, "-")}</td>
                        <td className="border-b border-[#EEF1F6] px-5 py-3.5 text-sm text-[#141516]">{isApiLineItem ? noOfBuses : pick(item.buses, "-")}</td>
                        <td className="border-b border-[#EEF1F6] px-5 py-3.5 text-sm text-[#141516]">{isApiLineItem ? formatCurrency(pick(item.UnitPrice, item.unitPrice, 0)) : pick(item.unitPrice, "-")}</td>
                        <td className="border-b border-[#EEF1F6] px-5 py-3.5 text-sm text-[#141516]">{pick(item.Quantity, item.quantity, item.mileage, 0)}</td>
                        <td className="border-b border-[#EEF1F6] px-5 py-3.5 text-sm font-semibold text-[#141516]">{isApiLineItem ? formatCurrency(pick(item.TotalAmount, item.totalAmount, 0)) : pick(item.totalAmount, "-")}</td>
                        <td className="border-b border-[#EEF1F6] px-5 py-3.5">
                          <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${statusClassName(rowStatus)}`}>
                            {rowStatus}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
              <div className="mt-8 rounded-xl border border-[#E7EAF3] bg-[#FAFBFD] p-5 md:p-6">
                <div className="min-w-0">
                  <p className="text-sm font-bold text-[#141516]">Terms &amp; Conditions</p>
                  <p className="mt-2 text-sm leading-relaxed text-[#333843]">{notes}</p>
                </div>
              </div>
          </div>
        </>
      )}
    </section>
  );
};

export default InvoiceForm;
