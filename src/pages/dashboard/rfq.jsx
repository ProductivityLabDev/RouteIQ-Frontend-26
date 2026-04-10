import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Dialog, Card, Typography } from '@material-tailwind/react';
import { fetchRFQs, updateRFQStatus } from '@/redux/slices/rfqSlice';
import { closeicon } from '@/assets';

const STATUS_TABS = ['All', 'Pending', 'Accepted', 'Rejected'];

const statusStyle = {
  Pending:  'bg-[#FFF3CD] text-[#856404]',
  Accepted: 'bg-[#CCFAEB] text-[#0BA071]',
  Rejected: 'bg-[#F6DCDE] text-[#C01824]',
};

function ApproveModal({ open, onClose, onConfirm, updating }) {
  const [form, setForm] = useState({ quotedAmount: '', vehicleId: '', driverId: '' });

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm({
      status: 'Accepted',
      quotedAmount: Number(form.quotedAmount),
      vehicleId: Number(form.vehicleId),
      driverId: Number(form.driverId),
    });
  };

  return (
    <Dialog className="px-7 py-6 rounded-[4px]" open={open} handler={onClose}>
      <Card color="transparent" shadow={false}>
        <div className="flex justify-between items-center mb-5">
          <Typography className="text-[24px] text-[#202224] font-bold">Approve RFQ</Typography>
          <Button className="p-1" variant="text" onClick={onClose}>
            <img src={closeicon} className="w-[17px] h-[17px]" alt="" />
          </Button>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <Typography variant="paragraph" className="mb-1 text-[#2C2F32] text-[14px] font-bold">
              Quoted Amount
            </Typography>
            <input
              type="number"
              name="quotedAmount"
              value={form.quotedAmount}
              onChange={onChange}
              placeholder="e.g. 800"
              required
              className="w-full outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-3 bg-[#F5F6FA]"
            />
          </div>
          <div>
            <Typography variant="paragraph" className="mb-1 text-[#2C2F32] text-[14px] font-bold">
              Vehicle ID
            </Typography>
            <input
              type="number"
              name="vehicleId"
              value={form.vehicleId}
              onChange={onChange}
              placeholder="e.g. 100"
              required
              className="w-full outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-3 bg-[#F5F6FA]"
            />
          </div>
          <div>
            <Typography variant="paragraph" className="mb-1 text-[#2C2F32] text-[14px] font-bold">
              Driver ID
            </Typography>
            <input
              type="number"
              name="driverId"
              value={form.driverId}
              onChange={onChange}
              placeholder="e.g. 51"
              required
              className="w-full outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-3 bg-[#F5F6FA]"
            />
          </div>
          <div className="flex justify-end space-x-4 mt-2">
            <Button
              onClick={onClose}
              className="px-10 py-2.5 border-2 border-[#C01824] text-[#C01824] capitalize rounded-[6px]"
              variant="outlined"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={updating}
              className="px-10 py-2.5 bg-[#28A745] capitalize rounded-[6px]"
              variant="filled"
            >
              {updating ? 'Approving...' : 'Confirm Approve'}
            </Button>
          </div>
        </form>
      </Card>
    </Dialog>
  );
}

export function RFQ() {
  const dispatch = useDispatch();
  const { rfqs, loading, updating, error } = useSelector((s) => s.rfq);
  const [activeTab, setActiveTab] = useState('All');
  const [approveTarget, setApproveTarget] = useState(null);

  useEffect(() => {
    dispatch(fetchRFQs());
  }, [dispatch]);

  const filteredRFQs = activeTab === 'All' ? rfqs : rfqs.filter((r) => r.status === activeTab);

  const handleApprove = (rfq) => setApproveTarget(rfq);

  const handleApproveConfirm = (payload) => {
    dispatch(updateRFQStatus({ id: approveTarget.id, payload }))
      .unwrap()
      .then(() => setApproveTarget(null))
      .catch(() => {});
  };

  const handleReject = (rfq) => {
    dispatch(updateRFQStatus({ id: rfq.id, payload: { status: 'Rejected' } }));
  };

  return (
    <section className="mt-7">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-[24px] md:text-[28px] font-bold text-[#202224]">RFQ Approvals</h1>
        <Button
          className="bg-[#C01824] capitalize text-sm"
          variant="filled"
          onClick={() => dispatch(fetchRFQs())}
        >
          Refresh
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 mb-5">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
              activeTab === tab
                ? 'bg-[#C01824] text-white border-[#C01824]'
                : 'bg-white text-[#565656] border-[#D5D5D5] hover:border-[#C01824]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-center text-gray-500 py-10">Loading RFQs...</p>
      ) : error ? (
        <p className="text-center text-red-500 py-10">{error}</p>
      ) : filteredRFQs.length === 0 ? (
        <p className="text-center text-gray-400 py-10">No RFQs found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredRFQs.map((rfq) => (
            <div key={rfq.id} className="bg-white rounded-lg border border-gray-200 shadow-sm p-5">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="text-[13px] text-gray-400">RFQ #{rfq.id}</p>
                  <p className="font-semibold text-[16px] text-[#202224]">{rfq.tripName ?? rfq.title ?? `Trip ${rfq.tripId ?? ''}`}</p>
                </div>
                <span className={`text-[11px] font-medium px-2.5 py-1 rounded-full ${statusStyle[rfq.status] ?? 'bg-gray-100 text-gray-600'}`}>
                  {rfq.status ?? 'Unknown'}
                </span>
              </div>

              <div className="space-y-1 text-sm text-gray-600 mb-4">
                {rfq.schoolName && <p><span className="font-medium text-gray-800">School:</span> {rfq.schoolName}</p>}
                {rfq.routeName && <p><span className="font-medium text-gray-800">Route:</span> {rfq.routeName}</p>}
                {rfq.quotedAmount != null && (
                  <p><span className="font-medium text-gray-800">Quoted Amount:</span> ${rfq.quotedAmount}</p>
                )}
                {rfq.vehicleId && <p><span className="font-medium text-gray-800">Vehicle ID:</span> {rfq.vehicleId}</p>}
                {rfq.driverId && <p><span className="font-medium text-gray-800">Driver ID:</span> {rfq.driverId}</p>}
                {rfq.createdAt && (
                  <p><span className="font-medium text-gray-800">Created:</span> {new Date(rfq.createdAt).toLocaleDateString()}</p>
                )}
              </div>

              {rfq.status === 'Pending' && (
                <div className="flex space-x-2">
                  <Button
                    className="flex-1 bg-[#28A745] capitalize text-[12px] py-2"
                    variant="filled"
                    size="sm"
                    disabled={updating}
                    onClick={() => handleApprove(rfq)}
                  >
                    Approve
                  </Button>
                  <Button
                    className="flex-1 bg-[#C01824] capitalize text-[12px] py-2"
                    variant="filled"
                    size="sm"
                    disabled={updating}
                    onClick={() => handleReject(rfq)}
                  >
                    Reject
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <ApproveModal
        open={!!approveTarget}
        onClose={() => setApproveTarget(null)}
        onConfirm={handleApproveConfirm}
        updating={updating}
      />
    </section>
  );
}

export default RFQ;
