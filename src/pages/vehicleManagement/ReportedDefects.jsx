import React, { useEffect, useMemo, useState } from 'react'
import VendorDashboardHeader from '@/components/VendorDashboardHeader';
import { Typography } from '@material-tailwind/react';
import ButtonComponent from '@/components/buttons/CustomButton';
import { Spinner } from '@material-tailwind/react';
import { apiClient } from '@/configs';
import { chatService } from '@/services/chatService';
import { toast } from 'react-hot-toast';

const pickFirst = (...values) => values.find((value) => value !== undefined && value !== null);

const normalizeDefect = (defect) => ({
    defectId: pickFirst(defect?.defectId, defect?.DefectId, defect?.id, defect?.Id),
    description: pickFirst(defect?.description, defect?.Description, defect?.defectDescription, defect?.DefectDescription, ''),
    defectType: pickFirst(defect?.defectType, defect?.DefectType, defect?.type, defect?.Type, 'General'),
    severity: pickFirst(defect?.severity, defect?.Severity, 'Unknown'),
    status: pickFirst(defect?.status, defect?.Status, 'Open'),
    reporterName: pickFirst(defect?.reporterName, defect?.ReporterName, defect?.reportedBy, defect?.ReportedBy, 'N/A'),
});

const normalizeMessages = (messages = []) =>
    messages.map((message, index) => ({
        id: pickFirst(message?.id, message?.Id, index),
        sender: pickFirst(
            message?.sender?.name,
            message?.senderName,
            message?.SenderName,
            message?.senderType,
            message?.SenderType,
            'User'
        ),
        text: pickFirst(message?.content, message?.message, message?.Message, ''),
    }));

const ReportedDefects = ({ vehicle, onBack, handleSeeMoreInfoClick, handleScheduleRepair }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [chatInput, setChatInput] = useState("");
    const [defectsLoading, setDefectsLoading] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);
    const [chatLoading, setChatLoading] = useState(false);
    const [vehicleInfo, setVehicleInfo] = useState(null);
    const [defects, setDefects] = useState([]);
    const [chatMessages, setChatMessages] = useState([]);
    const [conversationId, setConversationId] = useState(null);

    const vehicleId = pickFirst(
        vehicle?.vehicleId,
        vehicle?.VehicleId,
        vehicle?.BusId,
        vehicle?.busId,
        vehicle?.id,
        vehicle?.Id,
        vehicle?.ID
    );

    const activeVehicle = vehicleInfo || vehicle || {};
    const primaryDefect = defects[0] || null;

    const defectList = useMemo(
        () => defects.map((defect) => defect.description || defect.defectType || 'Unnamed defect'),
        [defects]
    );

    const fetchVehicleDefects = async () => {
        if (!vehicleId) return;

        setDefectsLoading(true);
        try {
            const response = await apiClient.get(`/vendor/vehicles/${vehicleId}/defects`);
            const payload = response.data?.data || response.data || {};
            const nextVehicleInfo = payload?.vehicle || payload?.vehicleInfo || payload;
            const rawDefects = Array.isArray(payload?.defects)
                ? payload.defects
                : Array.isArray(payload?.data)
                    ? payload.data
                    : [];

            setVehicleInfo(nextVehicleInfo);
            setDefects(rawDefects.map(normalizeDefect));
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Failed to load vehicle defects');
            setDefects([]);
        } finally {
            setDefectsLoading(false);
        }
    };

    useEffect(() => {
        fetchVehicleDefects();
    }, [vehicleId]);

    const openConversation = async () => {
        if (!vehicleId) return null;

        try {
            const response = await apiClient.post(`/vendor/vehicles/${vehicleId}/chat`);
            const data = response.data?.data || response.data || {};
            const nextConversationId = pickFirst(data?.conversationId, data?.ConversationId, data?.id, data?.Id);
            setConversationId(nextConversationId || null);
            return nextConversationId || null;
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Failed to open chat');
            return null;
        }
    };

    const loadMessages = async (targetConversationId) => {
        if (!targetConversationId) return;

        setChatLoading(true);
        try {
            const response = await chatService.getMessages(targetConversationId, { limit: 100 });
            setChatMessages(normalizeMessages(response.data || []));
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Failed to load chat messages');
            setChatMessages([]);
        } finally {
            setChatLoading(false);
        }
    };

    const handleKeepRunning = async () => {
        if (!primaryDefect?.defectId) {
            toast.error('No defect selected');
            return;
        }

        setActionLoading(true);
        try {
            await apiClient.patch(`/vendor/vehicles/defects/${primaryDefect.defectId}/keep-running`);
            toast.success('Defect marked as Keep Running');
            await fetchVehicleDefects();
            setIsOpen(true);
            const nextConversationId = await openConversation();
            if (nextConversationId) {
                await loadMessages(nextConversationId);
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Failed to update defect status');
        } finally {
            setActionLoading(false);
        }
    };

    const handleNotifyDriver = async () => {
        if (!primaryDefect?.defectId) {
            toast.error('No defect selected');
            return;
        }

        setActionLoading(true);
        try {
            await apiClient.post(`/vendor/vehicles/defects/${primaryDefect.defectId}/notify-driver`);
            toast.success('Driver notified successfully');
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Failed to notify driver');
        } finally {
            setActionLoading(false);
        }
    };

    const handleOpenCommunicationHub = async () => {
        setIsOpen(true);
        const nextConversationId = conversationId || await openConversation();
        if (nextConversationId) {
            await loadMessages(nextConversationId);
        }
    };

    const handleSend = async () => {
        if (!chatInput.trim()) return;

        let nextConversationId = conversationId;
        if (!nextConversationId) {
            nextConversationId = await openConversation();
        }

        if (!nextConversationId) return;

        setActionLoading(true);
        try {
            await chatService.sendMessage({
                conversationId: nextConversationId,
                content: chatInput.trim(),
            });
            setChatInput("");
            await loadMessages(nextConversationId);
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Failed to send message');
        } finally {
            setActionLoading(false);
        }
    };

    if (!vehicle) {
        return (
            <section className='w-full h-full'>
                <div className='bg-white w-full rounded-[4px] border shadow-sm h-full'>
                    <VendorDashboardHeader title='Reported Defects' icon={true} TextClassName='md:text-[22px]' className='ms-12' handleNavigate={onBack} />
                    <div className='flex items-center justify-center h-[50vh]'>
                        <Typography className="text-center font-bold text-[16px] text-gray-500">
                            No vehicle data available. Please go back and select a vehicle.
                        </Typography>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className='w-full h-full'>
            <div className='bg-white w-full rounded-[4px] border shadow-sm h-full'>
                <VendorDashboardHeader title='Reported Defects' icon={true} TextClassName='md:text-[22px]' className='ms-12' handleNavigate={onBack} />
                <div className='flex flex-row w-[97%] justify-between h-[33vh] m-5 border-b-2 border-[#d3d3d3]'>
                    <div className='flex flex-row w-[60%] gap-[59px]'>
                        <img 
                            src={activeVehicle?.vehiclImg || activeVehicle?.VehicleImage || '/src/assets/vechicelSvg.svg'} 
                            alt={activeVehicle?.VehicleName || activeVehicle?.vehicleName || "vehicle"} 
                            className="w-48 h-32 object-cover rounded"
                        />
                        <div className='flex flex-col h-full w-[65%] gap-[13px]'>
                            <Typography className="mb-2 text-start font-extrabold text-[19px] text-black">
                                {activeVehicle?.VehicleName || activeVehicle?.vehicleName || "N/A"}
                            </Typography>
                            <div className='flex flex-row gap-[85px]'>
                                <Typography className="mb-2 text-center font-bold text-[16px] text-black">
                                    Bus type
                                </Typography>
                                <Typography className="mb-2 text-center font-bold text-[16px] text-black">
                                    {activeVehicle?.BusType || activeVehicle?.busType || "School Bus"}
                                </Typography>
                            </div>
                            <div className='flex flex-row gap-[50px]'>
                                <Typography className="mb-2 text-center font-bold text-[16px] text-black">
                                    Vehicle Make
                                </Typography>
                                <Typography className="mb-2 text-center font-bold text-[16px] text-black">
                                    {activeVehicle?.VehicleMake || activeVehicle?.vehicleMake || "N/A"}
                                </Typography>
                            </div>
                            <div className='flex flex-row gap-[45px]'>
                                <Typography className="mb-2 text-center font-bold text-[16px] text-black">
                                    Number Plate
                                </Typography>
                                <Typography className="mb-2 text-center font-bold text-[16px] text-black">
                                    {activeVehicle?.NumberPlate || activeVehicle?.numberPlate || activeVehicle?.LicensePlate || "N/A"}
                                </Typography>
                            </div>
                            <div className='flex flex-row gap-[45px]'>
                                <Typography className="mb-2 text-center font-bold text-[16px] text-black">
                                    Terminal
                                </Typography>
                                <Typography className="mb-2 text-center font-bold text-[16px] text-black">
                                    {activeVehicle?.AssignedTerminal || activeVehicle?.assignedTerminal || activeVehicle?.TerminalName || "N/A"}
                                </Typography>
                            </div>
                            <ButtonComponent sx={{ width: '145px', height: '42px', fontSize: '13px' }} label='See more Info' Icon={false} onClick={() => handleSeeMoreInfoClick(activeVehicle)} />
                        </div>
                    </div>
                </div>

                <div className='flex flex-col h-[34vh] w-[75%] gap-[16px] px-12'>
                    <Typography className="mb-2 text-start font-extrabold text-[19px] text-black">
                        Reported Defect
                    </Typography>

                    {defectsLoading ? (
                        <div className="flex items-center gap-3 py-6">
                            <Spinner className="h-6 w-6 text-[#C01824]" />
                            <span className="text-sm text-gray-500">Loading reported defects...</span>
                        </div>
                    ) : primaryDefect ? (
                        <>
                            <div className='flex flex-row gap-5'>
                                <Typography className="mb-2 text-center font-bold text-[16px] text-black">
                                    Defect Type:
                                </Typography>
                                <Typography className="mb-2 text-center font-bold text-[16px] text-black">
                                    {primaryDefect.defectType}
                                </Typography>
                            </div>
                            <div className='flex flex-row gap-5'>
                                <Typography className="mb-2 text-center font-bold text-[16px] text-black">
                                    Defect Description:
                                </Typography>
                                <Typography className="mb-2 text-center font-bold text-[16px] text-black">
                                    {primaryDefect.description || "N/A"}
                                </Typography>
                            </div>
                            <div className='flex flex-row gap-5'>
                                <Typography className="mb-2 text-center font-bold text-[16px] text-black">
                                    Severity:
                                </Typography>
                                <Typography className="mb-2 text-center font-bold text-[16px] text-black">
                                    {primaryDefect.severity}
                                </Typography>
                            </div>
                            <div className='flex flex-row gap-5'>
                                <Typography className="mb-2 text-center font-bold text-[16px] text-black">
                                    Status:
                                </Typography>
                                <Typography className="mb-2 text-center font-bold text-[16px] text-black">
                                    {primaryDefect.status}
                                </Typography>
                            </div>
                            <div className='flex flex-row gap-5'>
                                <Typography className="mb-2 text-center font-bold text-[16px] text-black">
                                    Reported by:
                                </Typography>
                                <Typography className="mb-2 text-center font-bold text-[16px] text-black">
                                    {primaryDefect.reporterName}
                                </Typography>
                            </div>
                        </>
                    ) : (
                        <Typography className="text-sm text-gray-500">
                            No defects found for this vehicle.
                        </Typography>
                    )}

                    <div className='flex flex-row gap-3'>
                        <ButtonComponent sx={{ width: '175px', height: '42px', fontSize: '13px' }} label='Schedule Repair' Icon={false} onClick={handleScheduleRepair} />

                        <ButtonComponent
                            sx={{
                                width: '175px',
                                height: '42px',
                                fontSize: '13px',
                                backgroundColor: '#28A745',
                                "&:hover": { backgroundColor: '#28A745' },
                                opacity: actionLoading ? 0.7 : 1,
                            }}
                            label={actionLoading ? 'Please wait...' : 'Keep Running'}
                            Icon={false}
                            onClick={handleKeepRunning}
                        />

                        <ButtonComponent
                            sx={{
                                width: '195px',
                                height: '42px',
                                fontSize: '13px',
                                backgroundColor: '#2563EB',
                                "&:hover": { backgroundColor: '#2563EB' },
                            }}
                            label='Open Communication'
                            Icon={false}
                            onClick={handleOpenCommunicationHub}
                        />
                    </div>
                </div>
            </div>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="relative w-full max-w-3xl rounded-xl bg-white p-6 shadow-lg">
                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute right-3 top-3 text-gray-500 hover:text-gray-800"
                        >
                            x
                        </button>

                        <h2 className="mb-4 text-xl font-bold">Communication Hub</h2>

                        <div className="mb-4">
                            <button
                                onClick={handleNotifyDriver}
                                disabled={actionLoading || !primaryDefect?.defectId}
                                className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
                            >
                                {actionLoading ? 'Please wait...' : 'Notify Driver'}
                            </button>
                        </div>

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div>
                                <h3 className="mb-2 font-semibold">Reported Defects</h3>
                                <ul className="rounded-lg bg-gray-100 p-3 text-gray-700 space-y-1">
                                    {defectList.length > 0 ? (
                                        defectList.map((defect, idx) => (
                                            <li key={idx} className="list-disc list-inside">{defect}</li>
                                        ))
                                    ) : (
                                        <li className="list-none text-sm text-gray-500">No reported defects.</li>
                                    )}
                                </ul>
                            </div>

                            <div>
                                <h3 className="mb-2 font-semibold">Chat (Driver)</h3>
                                <div className="mb-3 h-48 overflow-y-auto rounded-lg border bg-gray-50 p-3">
                                    {chatLoading ? (
                                        <div className="flex h-full items-center justify-center">
                                            <Spinner className="h-6 w-6 text-[#C01824]" />
                                        </div>
                                    ) : chatMessages.length > 0 ? (
                                        chatMessages.map((msg) => (
                                            <p key={msg.id} className="mb-1">
                                                <span className="font-bold">{msg.sender}:</span> {msg.text}
                                            </p>
                                        ))
                                    ) : (
                                        <p className="text-sm text-gray-500">No chat messages yet.</p>
                                    )}
                                </div>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="Type message..."
                                        value={chatInput}
                                        onChange={(e) => setChatInput(e.target.value)}
                                        className="flex-1 rounded-lg border p-2"
                                    />
                                    <button
                                        onClick={handleSend}
                                        disabled={actionLoading || !chatInput.trim()}
                                        className="rounded-lg bg-green-600 px-4 text-white hover:bg-green-700 disabled:opacity-50"
                                    >
                                        Send
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </section>
    )
}

export default ReportedDefects;
