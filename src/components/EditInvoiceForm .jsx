import React, { useEffect } from 'react';
import { FiTrash, FiPlus } from 'react-icons/fi';

const emptyLineItem = {
    id: 1,
    itemDescription: '',
    glCodeId: '',
    unitPrice: '',
    quantity: '',
    totalAmount: '',
    tripId: '',
};

const EditInvoiceForm = ({
    batchInvoice,
    schoolInvoice = false,
    selectedSchoolName = '',
    terminals = [],
    glCodes = [],
    selectedInvoiceIds = [],
    batchNotes = '',
    onBatchNotesChange,
    formData,
    onFormChange,
    isEditing = false,
}) => {
    const lineItems = Array.isArray(formData?.lineItems) && formData.lineItems.length > 0
        ? formData.lineItems
        : [emptyLineItem];

    const computedSubTotal = lineItems.reduce((sum, item) => {
        const quantity = Number(item?.quantity || 0);
        const unitPrice = Number(item?.unitPrice || 0);
        const computedLineTotal = Number(item?.totalAmount || quantity * unitPrice || 0);
        return sum + computedLineTotal;
    }, 0);

    useEffect(() => {
        if (batchInvoice) return;
        const nextSubTotal = computedSubTotal > 0 ? String(Number(computedSubTotal.toFixed(2))) : '';
        if ((formData?.subTotal || '') !== nextSubTotal) {
            onFormChange('subTotal', nextSubTotal);
        }
    }, [batchInvoice, computedSubTotal, formData?.subTotal, onFormChange]);

    const resolveGlCodeUnitPrice = (glCodeId) => {
        const selectedCode = glCodes.find((code) => String(code.glCodeId || code.GLCodeId || code.id) === String(glCodeId));
        if (!selectedCode) return '';

        const assignmentPrice = Array.isArray(selectedCode.items) && selectedCode.items.length > 0
            ? selectedCode.items[0]?.unitPrice
            : undefined;

        const nextPrice = assignmentPrice ?? selectedCode.defaultUnitPrice ?? selectedCode.DefaultUnitPrice ?? '';
        return nextPrice === null || nextPrice === undefined ? '' : String(nextPrice);
    };

    const updateLineItem = (id, field, value) => {
        const nextItems = lineItems.map((item) => {
            if (item.id !== id) return item;
            const nextItem = { ...item, [field]: value };
            if (field === 'glCodeId') {
                nextItem.unitPrice = resolveGlCodeUnitPrice(value);
            }
            const quantity = Number(nextItem.quantity || 0);
            const unitPrice = Number(nextItem.unitPrice || 0);
            if (field === 'quantity' || field === 'unitPrice' || field === 'glCodeId') {
                nextItem.totalAmount = quantity * unitPrice ? String(quantity * unitPrice) : '';
            }
            return nextItem;
        });
        onFormChange('lineItems', nextItems);
    };

    const handleAddItem = () => {
        const nextId = lineItems.length > 0 ? Math.max(...lineItems.map((item) => item.id || 0)) + 1 : 1;
        onFormChange('lineItems', [...lineItems, { ...emptyLineItem, id: nextId }]);
    };

    const handleRemoveItem = (id) => {
        const nextItems = lineItems.filter((item) => item.id !== id);
        onFormChange('lineItems', nextItems.length > 0 ? nextItems : [{ ...emptyLineItem, id: 1 }]);
    };

    if (batchInvoice) {
        return (
            <div className="p-4">
                <div className="mx-auto bg-white p-6 rounded shadow-sm border border-gray-200">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="font-bold text-[#333843] text-[23px]">Create Batch Invoice</h2>
                        <div className="text-right">
                            <div className="text-[16px] text-[#667085] font-medium">Selected Invoices</div>
                            <h2 className="text-[20px] font-bold text-[#333843]">{selectedInvoiceIds.length}</h2>
                        </div>
                    </div>

                    <hr className="border-t border-[#C2C2C2] my-4" />

                    <div className="grid grid-cols-1 gap-4">
                        <div>
                            <label className="block text-[14px] text-[#333843] font-bold mb-2">Invoice IDs</label>
                            <div className="min-h-[48px] w-full rounded border border-[#C1C1C1] bg-[#F9FAFB] p-3 text-sm text-[#141516]">
                                {selectedInvoiceIds.length > 0 ? selectedInvoiceIds.join(', ') : 'No invoices selected'}
                            </div>
                        </div>
                        <div>
                            <label className="block text-[14px] text-[#333843] font-bold mb-2">Notes</label>
                            <textarea
                                value={batchNotes}
                                onChange={(e) => onBatchNotesChange?.(e.target.value)}
                                className="min-h-[120px] w-full outline-none border border-[#C1C1C1] rounded p-3"
                                placeholder="Batch trip billing notes"
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4">
            <div className="mx-auto bg-white p-6 rounded shadow-sm border border-gray-200">
                <div className="flex justify-between items-center mb-2">
                    <h2 className="font-bold text-[#333843] text-[23px]">
                        {isEditing
                            ? (schoolInvoice ? 'Edit School Invoice' : 'Edit Trip Invoice')
                            : (schoolInvoice ? 'Create School Invoice' : 'Create Trip Invoice')}
                    </h2>
                    <div className="text-right">
                        <div className="text-[16px] text-[#667085] font-medium">Date</div>
                        <h2 className="text-[20px] font-bold text-[#333843]">{formData?.invoiceDate || '-'}</h2>
                    </div>
                </div>

                <hr className="border-t border-[#C2C2C2] my-4" />

                <div className="grid grid-cols-3 gap-4 mb-6">
                    <div>
                        <label className="block text-[14px] text-[#333843] font-bold mb-1">Terminal</label>
                        <select
                            value={formData?.terminalId || ''}
                            onChange={(e) => onFormChange('terminalId', e.target.value)}
                            className="w-full outline-none border border-[#C1C1C1] rounded p-2"
                        >
                            <option value="">Select terminal</option>
                            {terminals.map((terminal) => {
                                const terminalId = terminal.TerminalId || terminal.terminalId || terminal.id;
                                const terminalName = terminal.TerminalName || terminal.terminalName || terminal.name;
                                return (
                                    <option key={terminalId} value={terminalId}>
                                        {terminalName}
                                    </option>
                                );
                            })}
                        </select>
                    </div>

                    <div>
                        <label className="block text-[14px] text-[#333843] font-bold mb-1">GL Code ID</label>
                        <select
                            value={formData?.glCodeId || ''}
                            onChange={(e) => {
                                const nextValue = e.target.value;
                                onFormChange('glCodeId', nextValue);
                                if (lineItems.length === 1 && !lineItems[0]?.glCodeId) {
                                    updateLineItem(lineItems[0].id, 'glCodeId', nextValue);
                                }
                            }}
                            className="w-full outline-none border border-[#C1C1C1] rounded p-2"
                        >
                            <option value="">Select GL code</option>
                            {glCodes.map((code) => {
                                const glCodeId = code.glCodeId || code.GLCodeId || code.id;
                                const glCodeValue = code.glCode || code.GLCode || '';
                                const glCodeName = code.glCodeName || code.GLCodeName || code.name || '';
                                return (
                                    <option key={glCodeId} value={glCodeId}>
                                        {glCodeValue ? `${glCodeValue}${glCodeName ? ` - ${glCodeName}` : ''}` : `GL Code #${glCodeId}`}
                                    </option>
                                );
                            })}
                        </select>
                    </div>

                    <div>
                        <label className="block text-[14px] text-[#333843] font-bold mb-1">Invoice Date</label>
                        <input
                            type="date"
                            value={formData?.invoiceDate || ''}
                            onChange={(e) => onFormChange('invoiceDate', e.target.value)}
                            className="w-full outline-none border border-[#C1C1C1] rounded p-2"
                        />
                    </div>

                    <div>
                        <label className="block text-[14px] text-[#333843] font-bold mb-1">Due Date</label>
                        <input
                            type="date"
                            value={formData?.dueDate || ''}
                            onChange={(e) => onFormChange('dueDate', e.target.value)}
                            className="w-full outline-none border border-[#C1C1C1] rounded p-2"
                        />
                    </div>

                    <div>
                        <label className="block text-[14px] text-[#333843] font-bold mb-1">Bill From</label>
                        <input
                            type="text"
                            value={formData?.billFrom || ''}
                            onChange={(e) => onFormChange('billFrom', e.target.value)}
                            className="w-full outline-none border border-[#C1C1C1] rounded p-2"
                        />
                    </div>

                    <div>
                        <label className="block text-[14px] text-[#333843] font-bold mb-1">Bill To</label>
                        <input
                            type="text"
                            value={formData?.billTo || selectedSchoolName || ''}
                            onChange={(e) => onFormChange('billTo', e.target.value)}
                            className="w-full outline-none border border-[#C1C1C1] rounded p-2"
                        />
                    </div>
                </div>

                <div className="mb-6">
                    <label className="block text-[14px] text-[#333843] font-bold mb-1">Notes</label>
                    <textarea
                        value={formData?.notes || ''}
                        onChange={(e) => onFormChange('notes', e.target.value)}
                        className="min-h-[90px] w-full outline-none border border-[#C1C1C1] rounded p-2"
                    />
                </div>

                <hr className="border-t border-[#C2C2C2] my-4" />

                <div className="mb-6">
                    <div className="w-full bg-white rounded border border-gray-200 overflow-hidden">
                        <div className="grid grid-cols-7 gap-2 bg-[#EEEEEE] p-4">
                            <div className="font-bold text-[#141516] text-[14px]">Item</div>
                            <div className="font-bold text-[#141516] text-[14px]">Trip ID</div>
                            <div className="font-bold text-[#141516] text-[14px]">GL Code</div>
                            <div className="font-bold text-[#141516] text-[14px]">Unit Price</div>
                            <div className="font-bold text-[#141516] text-[14px]">Quantity</div>
                            <div className="font-bold text-[#141516] text-[14px]">Total Cost</div>
                            <div className="font-bold text-[#141516] text-[14px] flex items-center justify-center">Action</div>
                        </div>

                        {lineItems.map((item) => (
                            <div key={item.id} className="grid grid-cols-7 gap-2 p-2 items-center">
                                <input
                                    type="text"
                                    value={item.itemDescription || ''}
                                    onChange={(e) => updateLineItem(item.id, 'itemDescription', e.target.value)}
                                    className="w-full outline-none border border-gray-300 rounded p-2"
                                />
                                <input
                                    type="number"
                                    value={item.tripId || ''}
                                    onChange={(e) => updateLineItem(item.id, 'tripId', e.target.value)}
                                    className="w-full outline-none border border-gray-300 rounded p-2"
                                />
                                <select
                                    value={item.glCodeId || ''}
                                    onChange={(e) => updateLineItem(item.id, 'glCodeId', e.target.value)}
                                    className="w-full outline-none border border-gray-300 rounded p-2"
                                >
                                    <option value="">Select GL code</option>
                                    {glCodes.map((code) => {
                                        const glCodeId = code.glCodeId || code.GLCodeId || code.id;
                                        const glCodeValue = code.glCode || code.GLCode || '';
                                        const glCodeName = code.glCodeName || code.GLCodeName || code.name || '';
                                        return (
                                            <option key={glCodeId} value={glCodeId}>
                                                {glCodeValue ? `${glCodeValue}${glCodeName ? ` - ${glCodeName}` : ''}` : `GL Code #${glCodeId}`}
                                            </option>
                                        );
                                    })}
                                </select>
                                <input
                                    type="number"
                                    value={item.unitPrice || ''}
                                    onChange={(e) => updateLineItem(item.id, 'unitPrice', e.target.value)}
                                    className="w-full outline-none border border-gray-300 rounded p-2"
                                />
                                <input
                                    type="number"
                                    value={item.quantity || ''}
                                    onChange={(e) => updateLineItem(item.id, 'quantity', e.target.value)}
                                    className="w-full outline-none border border-gray-300 rounded p-2"
                                />
                                <input
                                    type="number"
                                    value={item.totalAmount || ''}
                                    readOnly
                                    className="w-full outline-none border border-gray-300 rounded p-2 bg-[#F9FAFB] text-[#667085]"
                                />
                                <div className="flex justify-center items-center">
                                    <button type="button" onClick={() => handleRemoveItem(item.id)}>
                                        <FiTrash color="#C01824" size={20} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex justify-end mb-6">
                    <button type="button" className="bg-[#C01824] text-white px-4 py-2 rounded flex items-center gap-2" onClick={handleAddItem}>
                        <FiPlus size={18} />
                        Add Item
                    </button>
                </div>

                <div className="flex justify-end">
                    <div className="w-1/2">
                        <div className="flex justify-end gap-2 items-center mb-2">
                            <div className="font-bold text-[#141516] text-[18px]">Sub Total:</div>
                            <input
                                type="number"
                                value={formData?.subTotal || ''}
                                readOnly
                                className="outline-none border border-gray-300 rounded p-1 w-32 bg-[#F9FAFB] text-[#667085]"
                            />
                        </div>
                        <div className="flex justify-end gap-2 items-center mb-2">
                            <div className="font-bold text-[#141516] text-[18px]">Tax Amount:</div>
                            <input
                                type="number"
                                value={formData?.taxAmount || ''}
                                onChange={(e) => onFormChange('taxAmount', e.target.value)}
                                className="outline-none border border-gray-300 rounded p-1 w-32"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditInvoiceForm;
