import React, { useEffect, useMemo, useState } from 'react';
import { darksearchicon } from '@/assets';
import MainLayout from '@/layouts/SchoolLayout';
import { Button, Tabs, TabsBody } from '@material-tailwind/react';
import { IoMdThumbsDown, IoMdThumbsUp } from "react-icons/io";
import { VendorFeedbackChatMessage } from '@/components/VendorFeedbackMessage';
import vendorFeedbackService from '@/services/vendorFeedbackService';
import { toast } from 'react-hot-toast';

const TYPE_TABS = [
  { label: "School Feedback", value: "School" },
  { label: "Driver Feedback", value: "Driver" },
  { label: "Parent Feedback", value: "Parent" },
];

const statusColors = {
  Open: 'bg-[#F9E8E9] text-[#C01824]',
  Read: 'bg-[#EEF5FF] text-[#246BFD]',
  Resolved: 'bg-[#EAF9F0] text-[#1F9254]',
};

const ratingColors = {
  Positive: 'bg-[#EAF9F0] text-[#1F9254]',
  Negative: 'bg-[#F9E8E9] text-[#C01824]',
};

const Feedback = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({ total: 0, positive: 0, negative: 0 });
  const [feedbackList, setFeedbackList] = useState([]);
  const [selectedFeedbackId, setSelectedFeedbackId] = useState(null);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [loadingList, setLoadingList] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const activeType = TYPE_TABS[activeTab]?.value;

  const loadStats = async () => {
    try {
      const response = await vendorFeedbackService.getStats();
      setStats(response.data);
    } catch (error) {
      toast.error('Failed to load feedback stats');
    }
  };

  const loadFeedbackList = async () => {
    try {
      setLoadingList(true);
      const response = await vendorFeedbackService.getFeedbackList({
        type: activeType,
        search: searchTerm.trim(),
        limit: 20,
        offset: 0,
      });
      const items = response.data || [];
      setFeedbackList(items);
      setSelectedFeedbackId((prev) => {
        if (prev && items.some((item) => item.FeedbackId === prev)) return prev;
        return items[0]?.FeedbackId ?? null;
      });
    } catch (error) {
      toast.error('Failed to load feedback list');
    } finally {
      setLoadingList(false);
    }
  };

  const loadFeedbackDetail = async (feedbackId) => {
    if (!feedbackId) {
      setSelectedFeedback(null);
      return;
    }

    try {
      setLoadingDetail(true);
      const response = await vendorFeedbackService.getFeedbackDetail(feedbackId);
      setSelectedFeedback(response.data);
    } catch (error) {
      toast.error('Failed to load feedback detail');
      setSelectedFeedback(null);
    } finally {
      setLoadingDetail(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  useEffect(() => {
    loadFeedbackList();
  }, [activeType, searchTerm]);

  useEffect(() => {
    loadFeedbackDetail(selectedFeedbackId);
  }, [selectedFeedbackId]);

  const selectedFeedbackListItem = useMemo(
    () => feedbackList.find((item) => item.FeedbackId === selectedFeedbackId) || null,
    [feedbackList, selectedFeedbackId]
  );

  const detailData = selectedFeedback || selectedFeedbackListItem;

  const handleStatusUpdate = async (status) => {
    if (!selectedFeedbackId) return;

    try {
      setUpdatingStatus(true);
      await vendorFeedbackService.updateFeedbackStatus(selectedFeedbackId, status);
      toast.success('Status updated');
      setSelectedFeedback((prev) => (prev ? { ...prev, Status: status } : prev));
      setFeedbackList((prev) =>
        prev.map((item) => (item.FeedbackId === selectedFeedbackId ? { ...item, Status: status } : item))
      );
      loadStats();
    } catch (error) {
      toast.error('Failed to update status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const detailTimestamp = detailData?.CreatedAt
    ? new Date(detailData.CreatedAt).toLocaleString()
    : '--';

  const openCount = useMemo(
    () => feedbackList.filter((item) => item.Status === 'Open').length,
    [feedbackList]
  );

  const resolvedCount = useMemo(
    () => feedbackList.filter((item) => item.Status === 'Resolved').length,
    [feedbackList]
  );

  return (
    <MainLayout>
      <section className='w-full min-h-screen'>
        <h1 className="text-[24px] md:text-[32px] font-semibold leading-[1.3] my-6">Feedback</h1>

        <div className='grid grid-cols-1 xl:grid-cols-[240px_360px_minmax(0,1fr)] gap-5 w-full h-[calc(100vh-150px)]'>
          <div className='bg-white rounded-2xl border shadow-sm p-4 xl:h-full mb-4 xl:mb-0'>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#9A6B3A] mb-3">Feedback Type</p>
            <div className='space-y-2'>
            {TYPE_TABS.map((tab, index) => (
              <Button
                key={tab.value}
                className={`w-full text-left font-semibold text-sm md:text-[15px] capitalize px-4 py-3 shadow-none rounded-xl transition-all ${
                  activeTab === index
                    ? 'bg-[#F9E8E9] text-[#C01824] border border-[#F2C9CD]'
                    : 'bg-[#FAFAFA] text-[#202224] hover:bg-[#202224] hover:text-white'
                }`}
                onClick={() => setActiveTab(index)}
              >
                {tab.label}
              </Button>
            ))}
            </div>
          </div>

          <div className='bg-white rounded-2xl border shadow-sm xl:h-full mb-4 xl:mb-0 overflow-hidden flex flex-col'>
            <div className="p-4 border-b border-[#E9E9E9] space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#9A6B3A]">Inbox Summary</p>
                  <h2 className="text-[20px] font-semibold text-[#202224] mt-1">{TYPE_TABS[activeTab]?.label}</h2>
                </div>
                <div className="text-[13px] text-[#6B7280]">Total {stats.total}</div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-xl border border-[#F2E3D1] bg-[#FFF9F2] px-3 py-2">
                  <p className="text-[11px] uppercase tracking-wide text-[#9A6B3A]">Open</p>
                  <p className="text-[18px] font-semibold text-[#202224]">{openCount}</p>
                </div>
                <div className="rounded-xl border border-[#DDEEE4] bg-[#F5FCF7] px-3 py-2">
                  <p className="text-[11px] uppercase tracking-wide text-[#5B8A69]">Resolved</p>
                  <p className="text-[18px] font-semibold text-[#202224]">{resolvedCount}</p>
                </div>
              </div>

              <div className="flex justify-between items-center text-[14px] font-medium">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1 text-[#1F9254]"><IoMdThumbsUp size={18} /> <span>{stats.positive}</span></div>
                  <div className="flex items-center gap-1 text-[#C01824]"><IoMdThumbsDown size={18} /> <span>{stats.negative}</span></div>
                </div>
              </div>
            </div>

            <Tabs value={activeTab}>
              <div className="flex items-center px-4 py-3 border-b border-[#F1F1F1]">
                <div className="relative flex-1">
                  <img src={darksearchicon} alt="Search" className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 opacity-70" />
                <input
                    className="w-full pl-10 pr-3 py-2.5 bg-[#FAFAFA] outline-none placeholder-[#6B7280] border border-[#E5E7EB] rounded-xl text-sm"
                  type="search"
                    placeholder="Search feedback"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                </div>
              </div>

              <TabsBody className='overflow-y-auto max-h-[500px] xl:max-h-full px-2 py-2 flex-1'>
                {loadingList ? (
                  <div className="px-3 py-8 text-sm text-gray-500">Loading feedback...</div>
                ) : feedbackList.length === 0 ? (
                  <div className="px-3 py-8 text-sm text-gray-500">No feedback found.</div>
                ) : (
                  feedbackList.map((item) => (
                    <Button
                      key={item.FeedbackId}
                      variant='text'
                      className={`flex items-center gap-3 py-3 px-3 w-full text-left transition-all rounded-2xl mb-2 border ${
                        selectedFeedbackId === item.FeedbackId
                          ? 'bg-[#F9E8E9] border-[#F2C9CD]'
                          : 'bg-white border-transparent hover:bg-[#FAFAFA] hover:border-[#EFEFEF]'
                      }`}
                      onClick={() => setSelectedFeedbackId(item.FeedbackId)}
                    >
                      <div className="rounded-full h-[42px] w-[42px] bg-[#F3F4F6] flex items-center justify-center font-bold text-[#6B7280]">
                        {(item.senderName || '?').charAt(0).toUpperCase()}
                      </div>
                      <div className='flex-1 text-sm overflow-hidden'>
                        <div className='flex justify-between gap-2'>
                          <span className="font-bold text-[14px] truncate">{item.senderName || '--'}</span>
                          <span className="text-[#627D98] text-xs whitespace-nowrap">
                            {item.CreatedAt ? new Date(item.CreatedAt).toLocaleDateString() : '--'}
                          </span>
                        </div>
                        <div className='flex justify-between items-center gap-2 mt-1'>
                          <p className="text-[#334E68] text-[11px] truncate pr-2">
                            {item.Subject || item.messagePreview || '--'}
                          </p>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full whitespace-nowrap ${statusColors[item.Status] || 'bg-gray-100 text-gray-600'}`}>
                            {item.Status || 'Open'}
                          </span>
                        </div>
                      </div>
                    </Button>
                  ))
                )}
              </TabsBody>
            </Tabs>
          </div>

          <div className='bg-white w-full rounded-2xl border shadow-sm flex flex-col xl:h-full overflow-hidden'>
            <div className="flex-1 p-4 flex flex-col overflow-hidden">
              {!selectedFeedbackId ? (
                <div className="flex-1 flex items-center justify-center text-gray-500">
                  Select a feedback to view details.
                </div>
              ) : loadingDetail ? (
                <div className="flex-1 flex items-center justify-center text-gray-500">
                  Loading feedback detail...
                </div>
              ) : detailData ? (
                <>
                  <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_260px] gap-4 flex-1 min-h-0">
                    <div id="messages" className="flex flex-col min-h-0">
                      <div className="border border-[#E5E7EB] rounded-2xl p-5 bg-white">
                        <div className="flex flex-wrap items-start gap-3 justify-between">
                          <div>
                            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#9A6B3A]">Feedback Detail</p>
                            <h2 className="text-[28px] font-semibold text-[#202224] mt-1">{detailData.Subject || '--'}</h2>
                            <p className="text-sm text-[#6B7280] mt-1">
                            {detailData.senderName || '--'} | {detailData.senderType || activeType}
                            </p>
                          </div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className={`text-xs px-3 py-1 rounded-full ${statusColors[detailData.Status] || 'bg-gray-100 text-gray-600'}`}>
                              {detailData.Status || 'Open'}
                            </span>
                            <span className={`text-xs px-3 py-1 rounded-full ${ratingColors[detailData.Rating] || 'bg-[#F5F5F5] text-[#202224]'}`}>
                              {detailData.Rating || '--'}
                            </span>
                            <span className="text-xs px-3 py-1 rounded-full bg-[#F5F5F5] text-[#202224]">
                              {detailData.FeedbackType || '--'}
                            </span>
                          </div>
                        </div>
                        <p className="text-xs text-[#6B7280] mt-3">{detailTimestamp}</p>
                      </div>

                      <div className="mt-4 flex-1 min-h-0 overflow-y-auto rounded-2xl border border-[#F1F1F1] bg-[#FCFCFC] p-4">
                        <VendorFeedbackChatMessage
                          isOwnMessage={false}
                          message={detailData.Message || detailData.messagePreview || '--'}
                          avatarUrl=""
                          timestamp={detailTimestamp}
                          venderfeedbackData=""
                        />
                      </div>
                    </div>

                    <div className="rounded-2xl border border-[#EAEAEA] bg-[#FFFDF9] p-4 flex flex-col justify-between">
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#9A6B3A]">Actions</p>
                        <p className="text-sm text-[#6B7280] mt-2">Update review status and keep the feedback queue organized.</p>
                      </div>

                      <div className="space-y-2 mt-5">
                        {['Open', 'Read', 'Resolved'].map((status) => (
                          <Button
                            key={status}
                            size="sm"
                            className={`w-full shadow-none rounded-xl ${detailData.Status === status ? 'bg-[#C01824]' : 'bg-[#202224]'}`}
                            onClick={() => handleStatusUpdate(status)}
                            disabled={updatingStatus}
                          >
                            Mark as {status}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-gray-500">
                  Feedback detail not found.
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Feedback;
