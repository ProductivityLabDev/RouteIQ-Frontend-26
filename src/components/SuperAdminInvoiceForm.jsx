import React, { useEffect, useMemo, useState } from "react";

const invoiceTypes = ["School", "Trip", "Batch", "Terminal", "Retailer"];

const createDefaultLineItem = (id = 1) => ({
  id,
  itemDescription: "",
  quantity: "",
  unitPrice: "",
  totalAmount: "",
  routeId: "",
  glCodeId: "",
});

const getToday = () => new Date().toISOString().slice(0, 10);

const createInitialState = () => ({
  invoiceType: "School",
  instituteId: "",
  tripId: "",
  terminalId: "",
  retailId: "",
  glCodeId: "",
  invoiceDate: getToday(),
  dueDate: getToday(),
  deliveryDate: "",
  invoiceMode: "Monthly",
  paymentTerms: "Within 15 days",
  billFrom: "RouteIQ Inc",
  billTo: "",
  noOfBuses: "",
  taxAmount: "",
  notes: "",
  lineItems: [createDefaultLineItem()],
});

const parseNumber = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const normalizeTerminal = (terminal) => ({
  id:
    terminal?.TerminalId ??
    terminal?.terminalId ??
    terminal?.VehicleTerminalId ??
    terminal?.id ??
    terminal?.Id ??
    "",
  name:
    terminal?.TerminalName ??
    terminal?.terminalName ??
    terminal?.name ??
    terminal?.Name ??
    terminal?.terminalCode ??
    "",
});

const normalizeSchool = (school) => ({
  id:
    school?.instituteId ??
    school?.InstituteId ??
    school?.id ??
    school?.Id ??
    "",
  name:
    school?.instituteName ??
    school?.InstituteName ??
    school?.schoolName ??
    school?.SchoolName ??
    school?.name ??
    school?.Name ??
    "",
});

const normalizeGlCode = (code) => ({
  id: code?.glCodeId ?? code?.GLCodeId ?? code?.id ?? code?.Id ?? "",
  label:
    code?.glCode && code?.glCodeName
      ? `${code.glCode} - ${code.glCodeName}`
      : code?.GLCode && code?.GLCodeName
      ? `${code.GLCode} - ${code.GLCodeName}`
      : code?.glCode ??
        code?.GLCode ??
        code?.glCodeName ??
        code?.GLCodeName ??
        code?.name ??
        `GL Code #${code?.glCodeId ?? code?.GLCodeId ?? code?.id ?? ""}`,
});

export default function SuperAdminInvoiceForm({
  open,
  onClose,
  onSubmit,
  submitting = false,
  vendor,
  lookupWarning = "",
  glCodes = [],
  schoolTerminals = [],
  tripTerminals = [],
  vendorSchools = [],
  schoolsByTerminal = {},
  loadSchoolsByTerminal,
}) {
  const [form, setForm] = useState(createInitialState);

  useEffect(() => {
    if (!open) return;
    setForm(createInitialState());
  }, [open]);

  useEffect(() => {
    if (!open || form.invoiceType !== "School" || !form.terminalId || schoolsByTerminal[form.terminalId]) return;
    loadSchoolsByTerminal?.(form.terminalId);
  }, [open, form.invoiceType, form.terminalId, schoolsByTerminal, loadSchoolsByTerminal]);

  const activeTerminals = useMemo(() => {
    if (form.invoiceType === "Trip") return tripTerminals.map(normalizeTerminal);
    if (form.invoiceType === "School" || form.invoiceType === "Terminal") {
      return schoolTerminals.map(normalizeTerminal);
    }
    return [];
  }, [form.invoiceType, schoolTerminals, tripTerminals]);

  const schoolOptions = useMemo(() => {
    const terminalRows = form.terminalId ? schoolsByTerminal[form.terminalId] || [] : [];
    const fallbackRows = Array.isArray(vendorSchools) ? vendorSchools : [];
    const rows = terminalRows.length ? terminalRows : fallbackRows;
    const normalized = rows.map(normalizeSchool).filter((school) => school.id || school.name);
    const deduped = [];
    const seen = new Set();

    normalized.forEach((school) => {
      const key = String(school.id || school.name).toLowerCase();
      if (seen.has(key)) return;
      seen.add(key);
      deduped.push(school);
    });

    return deduped;
  }, [form.terminalId, schoolsByTerminal, vendorSchools]);

  const glCodeOptions = useMemo(() => glCodes.map(normalizeGlCode), [glCodes]);

  const computedSubTotal = useMemo(
    () =>
      form.lineItems.reduce((sum, item) => {
        const itemTotal = parseNumber(item.totalAmount || parseNumber(item.quantity) * parseNumber(item.unitPrice));
        return sum + itemTotal;
      }, 0),
    [form.lineItems]
  );

  const computedTotal = computedSubTotal + parseNumber(form.taxAmount);

  const updateField = (field, value) => {
    setForm((prev) => {
      const next = { ...prev, [field]: value };
      if (field === "invoiceType") {
        next.instituteId = "";
        next.tripId = "";
        next.terminalId = "";
        next.retailId = "";
        next.billTo = "";
      }
      if (field === "terminalId" && prev.invoiceType === "School") {
        next.instituteId = "";
        next.billTo = "";
      }
      if (field === "instituteId") {
        const selectedSchool = schoolOptions.find((school) => String(school.id) === String(value));
        next.billTo = selectedSchool?.name || prev.billTo || "";
      }
      return next;
    });
  };

  const updateLineItem = (id, field, value) => {
    setForm((prev) => ({
      ...prev,
      lineItems: prev.lineItems.map((item) => {
        if (item.id !== id) return item;
        const nextItem = { ...item, [field]: value };
        const quantity = parseNumber(nextItem.quantity);
        const unitPrice = parseNumber(nextItem.unitPrice);
        nextItem.totalAmount = quantity && unitPrice ? String(quantity * unitPrice) : "";
        return nextItem;
      }),
    }));
  };

  const addLineItem = () => {
    setForm((prev) => ({
      ...prev,
      lineItems: [...prev.lineItems, createDefaultLineItem(prev.lineItems.length + 1)],
    }));
  };

  const removeLineItem = (id) => {
    setForm((prev) => {
      const nextItems = prev.lineItems.filter((item) => item.id !== id);
      return {
        ...prev,
        lineItems: nextItems.length ? nextItems : [createDefaultLineItem()],
      };
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const filteredLineItems = form.lineItems
      .filter((item) => item.itemDescription || item.glCodeId || item.quantity || item.unitPrice)
      .map((item) => ({
        itemDescription: item.itemDescription || "",
        quantity: parseNumber(item.quantity),
        unitPrice: parseNumber(item.unitPrice),
        totalAmount: parseNumber(item.totalAmount || parseNumber(item.quantity) * parseNumber(item.unitPrice)),
        ...(item.routeId ? { routeId: parseNumber(item.routeId) } : {}),
        ...(item.glCodeId ? { glCodeId: parseNumber(item.glCodeId) } : {}),
      }));

    const payload = {
      vendorId: parseNumber(vendor?.id),
      invoiceType: form.invoiceType,
      ...(form.instituteId ? { instituteId: parseNumber(form.instituteId) } : {}),
      ...(form.tripId ? { tripId: parseNumber(form.tripId) } : {}),
      ...(form.terminalId ? { terminalId: parseNumber(form.terminalId) } : {}),
      ...(form.retailId ? { retailId: parseNumber(form.retailId) } : {}),
      ...(form.glCodeId ? { glCodeId: parseNumber(form.glCodeId) } : {}),
      invoiceDate: form.invoiceDate || undefined,
      dueDate: form.dueDate || undefined,
      ...(form.deliveryDate ? { deliveryDate: form.deliveryDate } : {}),
      invoiceMode: form.invoiceMode || undefined,
      paymentTerms: form.paymentTerms || undefined,
      billFrom: form.billFrom || undefined,
      billTo: form.billTo || undefined,
      ...(form.noOfBuses ? { noOfBuses: parseNumber(form.noOfBuses) } : {}),
      subTotal: Number(computedSubTotal.toFixed(2)),
      taxAmount: Number(parseNumber(form.taxAmount).toFixed(2)),
      totalAmount: Number(computedTotal.toFixed(2)),
      notes: form.notes || "",
      lineItems: filteredLineItems,
    };

    onSubmit?.(payload);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/45 p-4">
      <div className="max-h-[92vh] w-full max-w-6xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h3 className="text-2xl font-bold text-[#171a2a]">Create Invoice</h3>
            <p className="mt-1 text-sm text-[#7c7a73]">
              {vendor?.name ? `Creating invoice for ${vendor.name}` : "Select a vendor first."}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-[#e6dfd2] px-3 py-1.5 text-sm font-semibold text-[#171a2a]"
          >
            Close
          </button>
        </div>

        {lookupWarning ? (
          <div className="mb-6 rounded-2xl border border-[#f1d7a7] bg-[#fff8e8] px-4 py-3 text-sm text-[#8a6b1f]">
            {lookupWarning}
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <label className="mb-1 block text-sm font-semibold text-[#171a2a]">Vendor</label>
              <input
                value={vendor?.name || ""}
                disabled
                className="w-full rounded-2xl border border-[#e6dfd2] bg-[#f7f5ef] px-4 py-3 text-sm text-[#171a2a] outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold text-[#171a2a]">Invoice Type</label>
              <select
                value={form.invoiceType}
                onChange={(event) => updateField("invoiceType", event.target.value)}
                className="w-full rounded-2xl border border-[#e6dfd2] bg-white px-4 py-3 text-sm text-[#171a2a] outline-none"
              >
                {invoiceTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold text-[#171a2a]">GL Code</label>
              <select
                value={form.glCodeId}
                onChange={(event) => updateField("glCodeId", event.target.value)}
                className="w-full rounded-2xl border border-[#e6dfd2] bg-white px-4 py-3 text-sm text-[#171a2a] outline-none"
              >
                <option value="">Select GL code</option>
                {glCodeOptions.map((code) => (
                  <option key={code.id} value={code.id}>
                    {code.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {(form.invoiceType === "School" || form.invoiceType === "Trip" || form.invoiceType === "Terminal") ? (
              <div>
                <label className="mb-1 block text-sm font-semibold text-[#171a2a]">
                  Terminal {form.invoiceType === "Terminal" ? "" : "(Optional)"}
                </label>
                {activeTerminals.length ? (
                  <select
                    value={form.terminalId}
                    onChange={(event) => updateField("terminalId", event.target.value)}
                    className="w-full rounded-2xl border border-[#e6dfd2] bg-white px-4 py-3 text-sm text-[#171a2a] outline-none"
                  >
                    <option value="">Select terminal</option>
                    {activeTerminals.map((terminal) => (
                      <option key={terminal.id} value={terminal.id}>
                        {terminal.name || `Terminal ${terminal.id}`}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    value={form.terminalId}
                    onChange={(event) => updateField("terminalId", event.target.value)}
                    className="w-full rounded-2xl border border-[#e6dfd2] bg-white px-4 py-3 text-sm text-[#171a2a] outline-none"
                    placeholder="Enter terminal id"
                  />
                )}
              </div>
            ) : null}

            {form.invoiceType === "School" ? (
              <div>
                <label className="mb-1 block text-sm font-semibold text-[#171a2a]">School</label>
                {schoolOptions.length ? (
                  <select
                    value={form.instituteId}
                    onChange={(event) => updateField("instituteId", event.target.value)}
                    className="w-full rounded-2xl border border-[#e6dfd2] bg-white px-4 py-3 text-sm text-[#171a2a] outline-none"
                  >
                    <option value="">Select school</option>
                    {schoolOptions.map((school) => (
                      <option key={school.id} value={school.id}>
                        {school.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    value={form.instituteId}
                    onChange={(event) => updateField("instituteId", event.target.value)}
                    className="w-full rounded-2xl border border-[#e6dfd2] bg-white px-4 py-3 text-sm text-[#171a2a] outline-none"
                    placeholder="Enter institute id"
                  />
                )}
              </div>
            ) : null}

            {form.invoiceType === "Trip" ? (
              <div>
                <label className="mb-1 block text-sm font-semibold text-[#171a2a]">Trip ID</label>
                <input
                  value={form.tripId}
                  onChange={(event) => updateField("tripId", event.target.value)}
                  className="w-full rounded-2xl border border-[#e6dfd2] bg-white px-4 py-3 text-sm text-[#171a2a] outline-none"
                  placeholder="Enter trip id"
                />
              </div>
            ) : null}

            {form.invoiceType === "Retailer" ? (
              <div>
                <label className="mb-1 block text-sm font-semibold text-[#171a2a]">Retail ID</label>
                <input
                  value={form.retailId}
                  onChange={(event) => updateField("retailId", event.target.value)}
                  className="w-full rounded-2xl border border-[#e6dfd2] bg-white px-4 py-3 text-sm text-[#171a2a] outline-none"
                  placeholder="Enter retail id"
                />
              </div>
            ) : null}

            <div>
              <label className="mb-1 block text-sm font-semibold text-[#171a2a]">No. of Buses</label>
              <input
                value={form.noOfBuses}
                onChange={(event) => updateField("noOfBuses", event.target.value)}
                className="w-full rounded-2xl border border-[#e6dfd2] bg-white px-4 py-3 text-sm text-[#171a2a] outline-none"
                placeholder="Optional"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <label className="mb-1 block text-sm font-semibold text-[#171a2a]">Invoice Date</label>
              <input
                type="date"
                value={form.invoiceDate}
                onChange={(event) => updateField("invoiceDate", event.target.value)}
                className="w-full rounded-2xl border border-[#e6dfd2] bg-white px-4 py-3 text-sm text-[#171a2a] outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold text-[#171a2a]">Due Date</label>
              <input
                type="date"
                value={form.dueDate}
                onChange={(event) => updateField("dueDate", event.target.value)}
                className="w-full rounded-2xl border border-[#e6dfd2] bg-white px-4 py-3 text-sm text-[#171a2a] outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold text-[#171a2a]">Delivery Date</label>
              <input
                type="date"
                value={form.deliveryDate}
                onChange={(event) => updateField("deliveryDate", event.target.value)}
                className="w-full rounded-2xl border border-[#e6dfd2] bg-white px-4 py-3 text-sm text-[#171a2a] outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <div>
              <label className="mb-1 block text-sm font-semibold text-[#171a2a]">Invoice Mode</label>
              <input
                value={form.invoiceMode}
                onChange={(event) => updateField("invoiceMode", event.target.value)}
                className="w-full rounded-2xl border border-[#e6dfd2] bg-white px-4 py-3 text-sm text-[#171a2a] outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold text-[#171a2a]">Payment Terms</label>
              <input
                value={form.paymentTerms}
                onChange={(event) => updateField("paymentTerms", event.target.value)}
                className="w-full rounded-2xl border border-[#e6dfd2] bg-white px-4 py-3 text-sm text-[#171a2a] outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold text-[#171a2a]">Bill From</label>
              <input
                value={form.billFrom}
                onChange={(event) => updateField("billFrom", event.target.value)}
                className="w-full rounded-2xl border border-[#e6dfd2] bg-white px-4 py-3 text-sm text-[#171a2a] outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold text-[#171a2a]">Bill To</label>
              <input
                value={form.billTo}
                onChange={(event) => updateField("billTo", event.target.value)}
                className="w-full rounded-2xl border border-[#e6dfd2] bg-white px-4 py-3 text-sm text-[#171a2a] outline-none"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-[#171a2a]">Notes</label>
            <textarea
              value={form.notes}
              onChange={(event) => updateField("notes", event.target.value)}
              className="min-h-[96px] w-full rounded-2xl border border-[#e6dfd2] bg-white px-4 py-3 text-sm text-[#171a2a] outline-none"
              placeholder="Invoice notes"
            />
          </div>

          <div className="rounded-3xl border border-[#ebe6da] bg-[#fbfaf7] p-4">
            <div className="mb-4 flex items-center justify-between">
              <h4 className="text-lg font-bold text-[#171a2a]">Line Items</h4>
              <button
                type="button"
                onClick={addLineItem}
                className="rounded-2xl bg-[#c01824] px-4 py-2 text-sm font-semibold text-white"
              >
                Add Line
              </button>
            </div>

              <div className="space-y-3">
                {form.lineItems.map((item) => (
                  <div key={item.id} className="grid grid-cols-1 gap-3 rounded-2xl border border-[#ebe6da] bg-white p-4 md:grid-cols-5">
                    <input
                      value={item.itemDescription}
                      onChange={(event) => updateLineItem(item.id, "itemDescription", event.target.value)}
                      placeholder="Description"
                      className="rounded-2xl border border-[#e6dfd2] px-4 py-3 text-sm text-[#171a2a] outline-none md:col-span-2"
                  />
                  <select
                    value={item.glCodeId}
                    onChange={(event) => updateLineItem(item.id, "glCodeId", event.target.value)}
                    className="rounded-2xl border border-[#e6dfd2] px-4 py-3 text-sm text-[#171a2a] outline-none"
                  >
                    <option value="">GL Code</option>
                    {glCodeOptions.map((code) => (
                      <option key={code.id} value={code.id}>
                        {code.label}
                      </option>
                    ))}
                  </select>
                    <input
                      value={item.quantity}
                      onChange={(event) => updateLineItem(item.id, "quantity", event.target.value)}
                      placeholder="Qty"
                    className="rounded-2xl border border-[#e6dfd2] px-4 py-3 text-sm text-[#171a2a] outline-none"
                  />
                  <div className="flex gap-2">
                    <input
                      value={item.unitPrice}
                      onChange={(event) => updateLineItem(item.id, "unitPrice", event.target.value)}
                      placeholder="Unit Price"
                      className="w-full rounded-2xl border border-[#e6dfd2] px-4 py-3 text-sm text-[#171a2a] outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => removeLineItem(item.id)}
                      className="rounded-2xl border border-[#e6dfd2] px-3 text-sm font-semibold text-[#c01824]"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-[#ebe6da] bg-[#fbfaf7] px-4 py-3">
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8e8a80]">Sub Total</div>
              <div className="mt-2 text-xl font-bold text-[#171a2a]">{computedSubTotal.toFixed(2)}</div>
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold text-[#171a2a]">Tax Amount</label>
              <input
                value={form.taxAmount}
                onChange={(event) => updateField("taxAmount", event.target.value)}
                className="w-full rounded-2xl border border-[#e6dfd2] bg-white px-4 py-3 text-sm text-[#171a2a] outline-none"
                placeholder="0.00"
              />
            </div>
            <div className="rounded-2xl border border-[#ebe6da] bg-[#fbfaf7] px-4 py-3">
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8e8a80]">Total Amount</div>
              <div className="mt-2 text-xl font-bold text-[#171a2a]">{computedTotal.toFixed(2)}</div>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-2xl border border-[#e6dfd2] px-5 py-3 text-sm font-semibold text-[#171a2a]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || !vendor?.id}
              className="rounded-2xl bg-[#c01824] px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? "Creating..." : "Create Invoice"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
