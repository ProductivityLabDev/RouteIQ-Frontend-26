import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaPlus, FaTrash, FaCheck, FaTimes, FaPencilAlt, FaAngleDoubleRight } from 'react-icons/fa';
import {
  updateGlCodeDefaultPrice,
  addGlCodeAssignment,
  updateGlCodeAssignment,
  deleteGlCodeAssignment,
} from '@/redux/slices/payrollSlice';

export const GLCodeItem = ({ glCodeId, glCode, glCodeName, category, defaultUnitPrice, items = [] }) => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.payroll);

  const [editingDefault, setEditingDefault] = useState(false);
  const [defaultVal, setDefaultVal] = useState(defaultUnitPrice ?? '');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAssignment, setNewAssignment] = useState('');
  const [newUnitPrice, setNewUnitPrice] = useState('');
  const [editingItemId, setEditingItemId] = useState(null);
  const [editAssignment, setEditAssignment] = useState('');
  const [editUnitPrice, setEditUnitPrice] = useState('');
  const [showAssignments, setShowAssignments] = useState(items.length > 0);

  const assignmentCount = items.length;
  const categoryTone = {
    Asset: 'bg-blue-50 text-blue-700 border-blue-200',
    Liability: 'bg-amber-50 text-amber-700 border-amber-200',
    Expense: 'bg-rose-50 text-rose-700 border-rose-200',
    Revenue: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  };

  const handleSaveDefault = () => {
    const val = parseFloat(defaultVal);
    if (isNaN(val)) return;
    dispatch(updateGlCodeDefaultPrice({ glCodeId, defaultUnitPrice: val }));
    setEditingDefault(false);
  };

  const handleAddAssignment = () => {
    const trimmed = newAssignment.trim();
    const price = parseFloat(newUnitPrice);
    if (!trimmed || isNaN(price)) return;
    dispatch(addGlCodeAssignment({ glCodeId, assignment: trimmed, unitPrice: price }));
    setNewAssignment('');
    setNewUnitPrice('');
    setShowAddForm(false);
    setShowAssignments(true);
  };

  const startEditItem = (item) => {
    setEditingItemId(item.assignmentId);
    setEditAssignment(item.assignment);
    setEditUnitPrice(item.unitPrice ?? '');
  };

  const handleSaveItem = (item) => {
    const price = parseFloat(editUnitPrice);
    if (!editAssignment.trim() || isNaN(price)) return;
    dispatch(updateGlCodeAssignment({
      glCodeId,
      assignmentId: item.assignmentId,
      assignment: editAssignment.trim(),
      unitPrice: price,
    }));
    setEditingItemId(null);
  };

  const handleDeleteItem = (item) => {
    dispatch(deleteGlCodeAssignment({ glCodeId, assignmentId: item.assignmentId }));
  };

  return (
    <div className="mb-4 rounded-2xl border border-[#E7EAF3] bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
        <div className="min-w-0 flex-1 rounded-xl border border-[#E9EDF5] bg-[#F8FAFC] p-4">
          <div className="mb-3 flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8A94A6]">
                GL Code
              </div>
              <div className="mt-1 flex flex-wrap items-center gap-3">
                <span className="text-2xl font-bold text-[#141516]">{glCode}</span>
                <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${categoryTone[category] || 'bg-slate-50 text-slate-700 border-slate-200'}`}>
                  {category || 'Uncategorized'}
                </span>
              </div>
              <div className="mt-1 text-sm font-medium text-[#475569]">
                {glCodeName || 'No GL code name'}
              </div>
            </div>

            <div className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#8A94A6] shadow-sm">
              {assignmentCount} assignment{assignmentCount === 1 ? '' : 's'}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8A94A6]">
              Default Unit Price
            </span>
            {editingDefault ? (
              <>
                <input
                  type="number"
                  className="w-28 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-red-500"
                  value={defaultVal}
                  onChange={(e) => setDefaultVal(e.target.value)}
                />
                <button onClick={handleSaveDefault} className="text-green-600 hover:text-green-800">
                  <FaCheck size={12} />
                </button>
                <button
                  onClick={() => { setEditingDefault(false); setDefaultVal(defaultUnitPrice ?? ''); }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FaTimes size={12} />
                </button>
              </>
            ) : (
              <>
                <span className="rounded-lg bg-white px-3 py-2 text-sm font-semibold text-[#141516] shadow-sm">
                  {defaultUnitPrice != null ? `$${defaultUnitPrice}` : '-'}
                </span>
                <button onClick={() => setEditingDefault(true)} className="text-gray-400 hover:text-gray-600">
                  <FaPencilAlt size={11} />
                </button>
              </>
            )}
          </div>
        </div>

        <div className="hidden pt-6 text-[#9AA4B2] lg:block">
          <FaAngleDoubleRight size={18} />
        </div>

        <div className="min-w-0 flex-1 rounded-xl border border-[#E9EDF5] bg-[#FCFCFD] p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8A94A6]">
                Assign To
              </div>
              <div className="mt-1 text-lg font-semibold text-[#141516]">
                {glCodeName || 'No default assignment'}
              </div>
              <div className="mt-1 text-sm text-[#64748B]">
                {assignmentCount > 0 ? `${assignmentCount} linked assignment${assignmentCount === 1 ? '' : 's'}` : 'No linked assignments yet'}
              </div>
            </div>

            <div className="flex items-center gap-3">
              {assignmentCount > 0 && (
                <button
                  onClick={() => setShowAssignments((prev) => !prev)}
                  className="text-xs font-semibold uppercase tracking-[0.14em] text-[#64748B] hover:text-[#141516]"
                >
                  {showAssignments ? 'Hide' : 'Show'} assignments
                </button>
              )}
              {!showAddForm && (
                <button
                  onClick={() => setShowAddForm(true)}
                  className="inline-flex items-center gap-2 rounded-lg border border-[#F2C7CB] px-3 py-2 text-sm font-semibold text-[#C01824] hover:bg-[#FFF6F7]"
                >
                  <FaPlus size={10} /> Add Assignment
                </button>
              )}
            </div>
          </div>

          {showAddForm && (
            <div className="mt-4 flex flex-col gap-2 rounded-xl border border-dashed border-[#F2C7CB] bg-[#FFF8F8] p-3 md:flex-row md:items-center">
              <input
                className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-red-500"
                placeholder="Assignment name"
                value={newAssignment}
                onChange={(e) => setNewAssignment(e.target.value)}
              />
              <input
                type="number"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-red-500 md:w-32"
                placeholder="Unit $"
                value={newUnitPrice}
                onChange={(e) => setNewUnitPrice(e.target.value)}
              />
              <button onClick={handleAddAssignment} disabled={loading.addAssignment} className="text-green-600 hover:text-green-800">
                <FaCheck size={12} />
              </button>
              <button
                onClick={() => { setShowAddForm(false); setNewAssignment(''); setNewUnitPrice(''); }}
                className="text-gray-400 hover:text-gray-600"
              >
                <FaTimes size={12} />
              </button>
            </div>
          )}

          {showAssignments && items.length > 0 && (
            <div className="mt-4 space-y-2">
              {items.map((item) => (
                <div key={item.assignmentId} className="flex flex-col gap-2 rounded-xl border border-[#EEF2F7] bg-white px-3 py-3 md:flex-row md:items-center">
                  {editingItemId === item.assignmentId ? (
                    <>
                      <input
                        className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-red-500"
                        value={editAssignment}
                        onChange={(e) => setEditAssignment(e.target.value)}
                      />
                      <input
                        type="number"
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-red-500 md:w-28"
                        value={editUnitPrice}
                        onChange={(e) => setEditUnitPrice(e.target.value)}
                        placeholder="$"
                      />
                      <button onClick={() => handleSaveItem(item)} disabled={loading.updateAssignment} className="text-green-600 hover:text-green-800">
                        <FaCheck size={12} />
                      </button>
                      <button onClick={() => setEditingItemId(null)} className="text-gray-400 hover:text-gray-600">
                        <FaTimes size={12} />
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-[#141516]">{item.assignment}</div>
                        <div className="text-xs text-[#8A94A6]">Assignment</div>
                      </div>
                      <div className="min-w-[96px] text-sm font-semibold text-[#475569]">
                        {item.unitPrice != null ? `$${item.unitPrice}` : '-'}
                      </div>
                      <button onClick={() => startEditItem(item)} className="text-gray-400 hover:text-gray-600">
                        <FaPencilAlt size={11} />
                      </button>
                      <button onClick={() => handleDeleteItem(item)} disabled={loading.deleteAssignment} className="text-red-400 hover:text-red-600">
                        <FaTrash size={11} />
                      </button>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
