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

  return (
    <MainLayout>
      <section className='w-full min-h-screen'>
        <h1 className="text-[24px] md:text-[32px] font-semibold leading-[1.3] my-6">Feedback</h1>

        <div className='flex flex-col xl:flex-row xl:space-x-5 w-full h-[calc(100vh-150px)]'>
          <div className='bg-white w-full xl:max-w-[200px] rounded-xl space-y-1 border shadow-sm p-4 xl:h-full mb-4 xl:mb-0'>
            {TYPE_TABS.map((tab, index) => (
              <Button
                key={tab.value}
                className={`w-full text-left font-semibold text-sm md:text-[16px] capitalize pl-4 shadow-none rounded-[4px] transition-all ${
                  activeTab === index ? 'bg-[#F9E8E9] text-[#C01824]' : 'bg-transparent text-black hover:bg-[#C01824] hover:text-white'
                }`}
                onClick={() => setActiveTab(index)}
              >
                {tab.label}
              </Button>
            ))}
          </div>

          <div className='bg-white w-full xl:max-w-[320px] rounded-xl border shadow-sm xl:h-full mb-4 xl:mb-0 overflow-hidden'>
            <div className="p-4 border-b border-[#D2D2D2]">
              <div className="flex justify-between items-center text-[14px] font-medium">
                <div>Total Feedback: <span className="font-normal">{stats.total}</span></div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1 text-[#6F6F6F]"><IoMdThumbsUp size={20} /> <span>{stats.positive}</span></div>
                  <div className="flex items-center gap-1 text-[#6F6F6F]"><IoMdThumbsDown size={20} /> <span>{stats.negative}</span></div>
                </div>
              </div>
            </div>

            <Tabs value={activeTab}>
              <div className="flex items-center px-4 py-2">
                <input
                  className="flex-grow p-2 bg-white outline-none placeholder-[#000] border border-gray-300 rounded"
                  type="search"
                  placeholder="Search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <img src={darksearchicon} alt="Search" className="ml-2 h-4 w-4" />
              </div>

              <TabsBody className='overflow-y-auto max-h-[500px] xl:max-h-full px-2'>
                {loadingList ? (
                  <div className="px-3 py-8 text-sm text-gray-500">Loading feedback...</div>
                ) : feedbackList.length === 0 ? (
                  <div className="px-3 py-8 text-sm text-gray-500">No feedback found.</div>
                ) : (
                  feedbackList.map((item) => (
                    <Button
                      key={item.FeedbackId}
                      variant='text'
                      className={`flex items-center gap-3 py-3 w-full text-left hover:bg-[#F9E8E9] transition-all rounded-none ${
                        selectedFeedbackId === item.FeedbackId ? 'bg-[#F9E8E9]' : ''
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
                        <div className='flex justify-between items-center gap-2'>
                          <p className="text-[#334E68] text-[10px] truncate pr-2">
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

          <div className='bg-white w-full rounded-xl border shadow-sm flex flex-col xl:h-full'>
            <div className="flex-1 p-4 flex flex-col justify-between overflow-hidden">
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
                  <div id="messages" className="flex-1 overflow-y-auto space-y-4">
                    <div className="border border-[#E5E7EB] rounded-xl p-4">
                      <div className="flex flex-wrap items-center gap-2 justify-between">
                        <div>
                          <h2 className="text-xl font-semibold text-[#202224]">{detailData.Subject || '--'}</h2>
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
                      <p className="text-xs text-[#6B7280] mt-2">{detailTimestamp}</p>
                    </div>

                    <VendorFeedbackChatMessage
                      isOwnMessage={false}
                      message={detailData.Message || detailData.messagePreview || '--'}
                      avatarUrl=""
                      timestamp={detailTimestamp}
                      venderfeedbackData=""
                    />
                  </div>

                  <div className="border-t pt-4 mt-4">
                    <div className="flex flex-wrap items-center gap-2">
                      {['Open', 'Read', 'Resolved'].map((status) => (
                        <Button
                          key={status}
                          size="sm"
                          className={`${detailData.Status === status ? 'bg-[#C01824]' : 'bg-[#202224]'} text-white shadow-none`}
                          onClick={() => handleStatusUpdate(status)}
                          disabled={updatingStatus}
                        >
                          {status}
                        </Button>
                      ))}
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
