import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { formatDistanceToNow, parseISO } from 'date-fns'
import { checkMark } from '@/assets'
import VendorDashboardHeader from '@/components/VendorDashboardHeader'
import MainLayout from '@/layouts/SchoolLayout'
import {
    Button,
    Chip,
    CircularProgress,
    Collapse,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography,
} from '@mui/material'
import { Toaster, toast } from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'
import {
    fetchMyNotifications,
    fetchUnreadCount,
    fetchSentNotifications,
    fetchRecipients,
    markAllNotificationsRead,
    markNotificationRead,
    sendNotification,
} from '@/redux/slices/notificationsSlice'
import { fetchTerminals } from '@/redux/slices/busesSlice'
import { fetchSchoolManagementSummary } from '@/redux/slices/schoolSlice'
import { parseAppDate } from '@/utils/dateTime'

const NOTIFICATION_TYPE_COLORS = {
    alert: { bg: "#FEE2E2", text: "#DC2626" },
    warning: { bg: "#FEF3C7", text: "#D97706" },
    info: { bg: "#FDE8EA", text: "#C01824" },
    update: { bg: "#D1FAE5", text: "#059669" },
    default: { bg: "#F3F4F6", text: "#6B7280" },
}

const AUDIENCE_LABELS = {
    general: "Everyone",
    parent: "Parents",
    driver: "Drivers",
    vendor: "Vendors",
    institute: "Institutes",
    admin: "Admins",
}

const AUDIENCE_HELPERS = {
    general: "Broadcast to everyone in your current notification scope.",
    parent: "Send to all parents or target one specific parent.",
    driver: "Send to all drivers or target one specific driver.",
    vendor: "Send to all vendors or target one specific vendor.",
    institute: "Send to all institutes or target one institute user.",
    admin: "Send to all admins.",
}

const Notification = () => {
    const dispatch = useDispatch()
    const items = useSelector((state) => state.notifications?.items || [])
    const sentItems = useSelector((state) => state.notifications?.sentItems || [])
    const unreadCount = useSelector((state) => state.notifications?.unreadCount || 0)
    const loadingList = useSelector((state) => state.notifications?.loading?.list)
    const loadingMarkAll = useSelector((state) => state.notifications?.loading?.markAll)
    const loadingSent = useSelector((state) => state.notifications?.loading?.sent)
    const loadingSend = useSelector((state) => state.notifications?.loading?.send)
    const error = useSelector((state) => state.notifications?.error)
    const loggedInUser = useSelector((state) => state.user?.user)

    const terminals = useSelector((state) => state.buses?.terminals || [])
    const institutes = useSelector((state) => state.schools?.schoolManagementSummary || [])
    const recipients = useSelector((state) => state.notifications?.recipients || [])
    const loadingRecipients = useSelector((state) => state.notifications?.loading?.recipients)

    const [activeTab, setActiveTab] = useState("inbox") // inbox | sent
    const [expandedId, setExpandedId] = useState(null)
    const [sendOpen, setSendOpen] = useState(false)
    const [showAdvanced, setShowAdvanced] = useState(false)
    const [form, setForm] = useState({
        title: "",
        message: "",
        audience: "driver",
        userId: "",
        terminalId: "",
        instituteId: "",
        relatedEntityType: "",
        relatedEntityId: "",
    })

    const formatDate = useCallback((dateStr) => {
        if (!dateStr) return ""
        try {
            const date =
                parseAppDate(dateStr) ||
                (typeof dateStr === "string" ? parseISO(dateStr) : new Date(dateStr))
            return formatDistanceToNow(date, { addSuffix: true })
        } catch {
            return String(dateStr)
        }
    }, [])

    const canSend = useMemo(() => {
        const role = String(loggedInUser?.role || "").toLowerCase()
        return ["vendor", "school", "admin", "institute"].some((r) => role.includes(r))
    }, [loggedInUser?.role])

    useEffect(() => {
        dispatch(fetchMyNotifications({ limit: 50, offset: 0 }))
        dispatch(fetchUnreadCount())
    }, [dispatch])

    useEffect(() => {
        if (activeTab !== "sent") return
        dispatch(fetchSentNotifications({ limit: 50, offset: 0 }))
    }, [activeTab, dispatch])

    const handleMarkAllRead = async () => {
        await dispatch(markAllNotificationsRead())
        dispatch(fetchUnreadCount())
    }

    const handleItemClick = async (n) => {
        const id = n?.NotificationId ?? n?.id
        if (!id) return

        // toggle expand
        setExpandedId((prev) => (prev === id ? null : id))

        // mark as read if unread (inbox only)
        if (activeTab === "inbox") {
            const isRead = n?.IsRead === 1 || n?.IsRead === true
            if (!isRead) {
                const res = await dispatch(markNotificationRead(id))
                if (res?.meta?.requestStatus === "rejected") {
                    toast.error(res?.payload || "Failed to mark as read")
                    // API failed — re-fetch to get accurate state
                    dispatch(fetchMyNotifications({ limit: 50, offset: 0 }))
                }
                dispatch(fetchUnreadCount())
            }
        }
    }

    const handleOpenSend = () => {
        const defaultAudience = "driver"
        setForm({
            title: "",
            message: "",
            audience: defaultAudience,
            userId: "",
            terminalId: "",
            instituteId: "",
            relatedEntityType: "",
            relatedEntityId: "",
        })
        setShowAdvanced(false)
        setSendOpen(true)
        if (!terminals.length) {
            dispatch(fetchTerminals())
        }
        if (!institutes.length) {
            dispatch(fetchSchoolManagementSummary())
        }
        dispatch(fetchRecipients(defaultAudience))
    }
    const handleCloseSend = () => {
        setSendOpen(false)
        setShowAdvanced(false)
    }

    const updateForm = (key, value) => setForm((prev) => ({ ...prev, [key]: value }))

    const normalizeOptionalNumber = (val) => {
        if (val === null || val === undefined) return undefined
        const s = String(val).trim()
        if (!s) return undefined
        const n = Number(s)
        return Number.isFinite(n) ? n : undefined
    }

    const handleSend = async () => {
        const title = String(form.title || "").trim()
        const message = String(form.message || "").trim()
        const audience = String(form.audience || "").trim()
        if (!title || !message || !audience) return

        const payload = {
            title,
            message,
            audience,
            userId: normalizeOptionalNumber(form.userId),
            terminalId: normalizeOptionalNumber(form.terminalId),
            instituteId: normalizeOptionalNumber(form.instituteId),
            relatedEntityType: String(form.relatedEntityType || "").trim() || undefined,
            relatedEntityId: normalizeOptionalNumber(form.relatedEntityId),
        }

        const res = await dispatch(sendNotification(payload))
        if (res?.meta?.requestStatus === "fulfilled") {
            toast.success("Notification sent successfully")
            setSendOpen(false)
            setShowAdvanced(false)
            setForm({
                title: "",
                message: "",
                audience: "driver",
                userId: "",
                terminalId: "",
                instituteId: "",
                relatedEntityType: "",
                relatedEntityId: "",
            })
            // refresh views
            dispatch(fetchSentNotifications({ limit: 50, offset: 0 }))
            dispatch(fetchMyNotifications({ limit: 50, offset: 0 }))
            dispatch(fetchUnreadCount())
        } else {
            toast.error(res?.payload || "Failed to send notification")
        }
    }

    const activeList = activeTab === "sent" ? sentItems : items
    const activeLoading = activeTab === "sent" ? loadingSent : loadingList
    const emptyText = activeTab === "sent" ? "No sent notifications yet" : "No new notifications yet for you"
    const selectedAudienceLabel = AUDIENCE_LABELS[form.audience] || form.audience
    const canTargetSingleUser = ["driver", "parent", "vendor", "institute"].includes(form.audience)
    const selectedRecipientName = recipients.find((recipient) => String(recipient.id) === String(form.userId))?.name || ""
    const pillButtonSx = {
        borderRadius: "999px",
        boxShadow: "none",
        borderColor: "#C01824",
        color: "#C01824",
        "&:hover": {
            borderColor: "#A5121E",
            backgroundColor: "#FDE8EA",
        },
    }
    const activePillButtonSx = {
        borderRadius: "999px",
        boxShadow: "none",
        backgroundColor: "#C01824",
        color: "#FFFFFF",
        "&:hover": {
            backgroundColor: "#A5121E",
        },
    }

    return (
        <MainLayout>
            <section className='w-full h-full'>
                <div className="rounded-2xl border border-[#E8E2D6] bg-white px-4 py-4 shadow-sm">
                    <div className="flex items-start justify-between flex-wrap gap-4">
                        <div className="min-w-0">
                            <VendorDashboardHeader title='Notifications' />
                            <Typography className="mt-1 text-[13px] font-medium text-[#7A7A7A]">
                                Review inbox updates, inspect sent notifications, and compose audience-based announcements.
                            </Typography>
                        </div>
                    <div className="flex items-center gap-3 pr-2 flex-wrap justify-end">
                        <div className="flex items-center gap-2 rounded-full bg-[#F7F7F7] p-1">
                            <Button
                                variant={activeTab === "inbox" ? "contained" : "outlined"}
                                size="small"
                                onClick={() => setActiveTab("inbox")}
                                sx={{ minWidth: 88, ...(activeTab === "inbox" ? activePillButtonSx : pillButtonSx) }}
                            >
                                Inbox{Number(unreadCount) > 0 ? ` (${Number(unreadCount)})` : ""}
                            </Button>
                            <Button
                                variant={activeTab === "sent" ? "contained" : "outlined"}
                                size="small"
                                onClick={() => setActiveTab("sent")}
                                sx={{ minWidth: 76, ...(activeTab === "sent" ? activePillButtonSx : pillButtonSx) }}
                            >
                                Sent
                            </Button>
                        </div>
                        <Button
                            variant="outlined"
                            size="small"
                            disabled={loadingMarkAll || Number(unreadCount) === 0}
                            onClick={handleMarkAllRead}
                            sx={pillButtonSx}
                        >
                            Mark all as read
                        </Button>
                        {canSend && (
                            <Button variant="contained" size="small" onClick={handleOpenSend} sx={{ ...activePillButtonSx, px: 2 }}>
                                Send Notification
                            </Button>
                        )}
                    </div>
                </div>
                    <div className="mt-4 grid gap-3 md:grid-cols-3">
                        <div className="rounded-2xl border border-[#EFE6DA] bg-[#FCFAF6] px-4 py-3">
                            <Typography className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#9A7B59]">
                                Inbox
                            </Typography>
                            <Typography className="mt-2 text-[26px] font-extrabold text-[#1F1F1F]">
                                {Number(unreadCount)}
                            </Typography>
                            <Typography className="text-[13px] text-[#6B7280]">
                                unread notifications
                            </Typography>
                        </div>
                        <div className="rounded-2xl border border-[#EFE6DA] bg-white px-4 py-3">
                            <Typography className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#9A7B59]">
                                Sent
                            </Typography>
                            <Typography className="mt-2 text-[26px] font-extrabold text-[#1F1F1F]">
                                {sentItems.length}
                            </Typography>
                            <Typography className="text-[13px] text-[#6B7280]">
                                cached sent items loaded
                            </Typography>
                        </div>
                        <div className="rounded-2xl border border-[#EFE6DA] bg-white px-4 py-3">
                            <Typography className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#9A7B59]">
                                Active View
                            </Typography>
                            <Typography className="mt-2 text-[18px] font-extrabold text-[#1F1F1F]">
                                {activeTab === "sent" ? "Sent notifications" : "Inbox stream"}
                            </Typography>
                            <Typography className="text-[13px] text-[#6B7280]">
                                {activeTab === "sent" ? "Review outbound notification history." : "Expand rows to inspect notification details."}
                            </Typography>
                        </div>
                    </div>
                </div>

                {error ? (
                    <div className="px-2 py-3">
                        <Typography fontSize={14} fontWeight={700} className="font-Nunito Sans text-red-600">
                            {String(error)}
                        </Typography>
                    </div>
                ) : null}

                {activeLoading ? (
                    <div className="flex flex-col justify-center items-center h-[50vh] gap-3">
                        <CircularProgress size={36} />
                        <Typography fontSize={14} fontWeight={500} className="font-Nunito Sans text-[#9A9A9A]">
                            Loading notifications...
                        </Typography>
                    </div>
                ) : (activeList || []).length === 0 ? (
                    <div className='flex space-x-0 gap-5 md:space-x-5 justify-end flex-col items-center self-center h-[50vh]'>
                        <img src={checkMark} />
                        <div className='flex justify-end flex-col items-center gap-2 self-center'>
                            <Typography fontSize={30} fontWeight={800} className="font-Nunito Sans text-[#1F1F1F]">
                                All Caught Up
                            </Typography>
                            <Typography fontSize={26} fontWeight={400} className="font-Nunito Sans">
                                {emptyText}
                            </Typography>
                        </div>
                    </div>
                ) : (
                    <div className="px-2 pb-6 pt-4">
                        <div className="bg-white rounded-2xl border border-[#E5E5E5] overflow-hidden shadow-sm">
                            {(activeList || []).map((n) => {
                                const id = n?.NotificationId ?? n?.id
                                const title = n?.Title || n?.title || "Notification"
                                const message = n?.Message || n?.message || ""
                                const createdAt = n?.CreatedAt || n?.createdAt
                                const isRead = n?.IsRead === 1 || n?.IsRead === true
                                const notifType = String(n?.NotificationType || n?.type || "").toLowerCase()
                                const typeColor = NOTIFICATION_TYPE_COLORS[notifType] || NOTIFICATION_TYPE_COLORS.default
                                const audience = n?.audience || n?.Audience || ""
                                const isExpanded = expandedId === id
                                const showUnreadState = activeTab === "inbox" && !isRead
                                return (
                                    <div
                                        key={String(id)}
                                        className={`border-b border-[#F0F0F0] transition-colors ${showUnreadState ? "border-l-[4px] border-l-[#C01824] bg-[#FFF7F8]" : "bg-white"} ${isExpanded ? "bg-[#FCFCFC]" : ""}`}
                                    >
                                        <button
                                            onClick={() => handleItemClick(n)}
                                            className="w-full text-left px-5 py-4 hover:bg-[#FAFAFA] transition-colors"
                                        >
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex flex-col gap-1 flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        {showUnreadState && (
                                                            <span className="inline-flex items-center justify-center w-2 h-2 bg-red-500 rounded-full flex-shrink-0" />
                                                        )}
                                                        <Typography fontSize={15} fontWeight={isRead ? 700 : 800} className="font-Nunito Sans text-[#1F1F1F]">
                                                            {title}
                                                        </Typography>
                                                        {notifType && (
                                                            <Chip
                                                                label={notifType.charAt(0).toUpperCase() + notifType.slice(1)}
                                                                size="small"
                                                                sx={{
                                                                    height: 20,
                                                                    fontSize: 11,
                                                                    fontWeight: 700,
                                                                    backgroundColor: typeColor.bg,
                                                                    color: typeColor.text,
                                                                }}
                                                            />
                                                        )}
                                                        {activeTab === "sent" && audience && (
                                                            <Chip
                                                                label={AUDIENCE_LABELS[audience.toLowerCase()] || audience}
                                                                size="small"
                                                                variant="outlined"
                                                                sx={{
                                                                    height: 20,
                                                                    fontSize: 11,
                                                                    fontWeight: 600,
                                                                    borderColor: "#D1D5DB",
                                                                    color: "#6B7280",
                                                                }}
                                                            />
                                                        )}
                                                    </div>
                                                    {!isExpanded && message ? (
                                                        <Typography fontSize={13} fontWeight={400} className="font-Nunito Sans text-[#565656] line-clamp-1 max-w-[90%]">
                                                            {message}
                                                        </Typography>
                                                    ) : null}
                                                    {createdAt ? (
                                                        <Typography fontSize={12} fontWeight={500} className="font-Nunito Sans text-[#9A9A9A]">
                                                            {formatDate(createdAt)}
                                                        </Typography>
                                                    ) : null}
                                                </div>
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    strokeWidth={2}
                                                    stroke="#9A9A9A"
                                                    className={`w-4 h-4 mt-1 flex-shrink-0 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                                                </svg>
                                            </div>
                                        </button>
                                        <Collapse in={isExpanded}>
                                            <div className="px-5 pb-5 pt-1">
                                                <div className="bg-[#F9FAFB] rounded-xl p-4 border border-[#E5E7EB]">
                                                    {message ? (
                                                        <Typography fontSize={14} fontWeight={400} className="font-Nunito Sans text-[#374151] whitespace-pre-wrap">
                                                            {message}
                                                        </Typography>
                                                    ) : (
                                                        <Typography fontSize={13} fontWeight={400} className="font-Nunito Sans text-[#9A9A9A] italic">
                                                            No additional details
                                                        </Typography>
                                                    )}
                                                    {(n?.RelatedEntityType || n?.relatedEntityType) && (
                                                        <div className="mt-2 flex items-center gap-2">
                                                            <Chip
                                                                label={`${n?.RelatedEntityType || n?.relatedEntityType}${n?.RelatedEntityId || n?.relatedEntityId ? ` #${n.RelatedEntityId || n.relatedEntityId}` : ""}`}
                                                                size="small"
                                                                sx={{ height: 22, fontSize: 11, fontWeight: 600, backgroundColor: "#EEF2FF", color: "#4F46E5" }}
                                                            />
                                                        </div>
                                                    )}
                                                    {createdAt && (
                                                        <Typography fontSize={11} fontWeight={500} className="font-Nunito Sans text-[#9A9A9A] mt-2">
                                                            {new Date(createdAt).toLocaleString()}
                                                        </Typography>
                                                    )}
                                                </div>
                                            </div>
                                        </Collapse>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )}

                <Dialog
                    open={sendOpen}
                    onClose={handleCloseSend}
                    fullWidth
                    maxWidth="sm"
                    PaperProps={{
                        sx: {
                            borderRadius: "20px",
                            overflow: "hidden",
                            boxShadow: "0 24px 80px rgba(15, 23, 42, 0.22)",
                        },
                    }}
                >
                    <DialogTitle sx={{ pb: 1, pt: 3, px: 3 }}>
                        <div>
                            <Typography className="text-[24px] font-extrabold text-[#1F1F1F]">
                                Send Notification
                            </Typography>
                            <Typography className="mt-1 text-[13px] text-[#6B7280]">
                                Compose a broadcast or a targeted notification for a selected audience.
                            </Typography>
                        </div>
                    </DialogTitle>
                    <DialogContent sx={{ overflowX: "hidden", px: 3, pb: 1 }}>
                        <div className="flex flex-col gap-3 pt-2">
                            <div className="rounded-2xl border border-[#E8E2D6] bg-[#FCFAF6] px-4 py-3">
                                <Typography className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#9A7B59]">
                                    Audience Summary
                                </Typography>
                                <Typography className="mt-2 text-[16px] font-extrabold text-[#1F1F1F]">
                                    {selectedAudienceLabel}
                                    {selectedRecipientName ? ` · ${selectedRecipientName}` : ""}
                                </Typography>
                                <Typography className="text-[13px] text-[#6B7280]">
                                    {AUDIENCE_HELPERS[form.audience] || "Choose who should receive this notification."}
                                </Typography>
                            </div>
                            <TextField
                                label="Title"
                                value={form.title}
                                onChange={(e) => updateForm("title", e.target.value)}
                                fullWidth
                                placeholder="e.g. Route delayed by 10 minutes"
                            />
                            <TextField
                                label="Message"
                                value={form.message}
                                onChange={(e) => updateForm("message", e.target.value)}
                                fullWidth
                                multiline
                                minRows={3}
                                placeholder="Write the notification body here..."
                            />
                            <FormControl fullWidth>
                                <InputLabel>Audience</InputLabel>
                                <Select
                                    value={form.audience}
                                    label="Audience"
                                    onChange={(e) => {
                                        const val = e.target.value
                                        updateForm("audience", val)
                                        updateForm("userId", "")
                                        if (["driver", "parent", "vendor", "institute"].includes(val)) {
                                            dispatch(fetchRecipients(val))
                                        } else {
                                            updateForm("userId", "")
                                        }
                                    }}
                                >
                                    <MenuItem value="general">General (Everyone)</MenuItem>
                                    <MenuItem value="parent">Parents</MenuItem>
                                    <MenuItem value="driver">Drivers</MenuItem>
                                    <MenuItem value="vendor">Vendors</MenuItem>
                                    <MenuItem value="institute">Institutes</MenuItem>
                                    <MenuItem value="admin">Admins</MenuItem>
                                </Select>
                            </FormControl>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <FormControl fullWidth disabled={!canTargetSingleUser}>
                                    <InputLabel>User (optional)</InputLabel>
                                    <Select
                                        value={form.userId}
                                        label="User (optional)"
                                        onChange={(e) => updateForm("userId", e.target.value)}
                                    >
                                        <MenuItem value="">
                                            <em>None - broadcast to audience</em>
                                        </MenuItem>
                                        {loadingRecipients ? (
                                            <MenuItem disabled>Loading...</MenuItem>
                                        ) : (
                                            recipients.map((r, idx) => (
                                                <MenuItem key={`recipient-${r.id}-${idx}`} value={r.id}>
                                                    {r.name} ({r.id})
                                                </MenuItem>
                                            ))
                                        )}
                                    </Select>
                                </FormControl>
                                <FormControl fullWidth>
                                    <InputLabel>Terminal (optional)</InputLabel>
                                    <Select
                                        value={form.terminalId}
                                        label="Terminal (optional)"
                                        onChange={(e) => updateForm("terminalId", e.target.value)}
                                    >
                                        <MenuItem value="">
                                            <em>None - all terminals</em>
                                        </MenuItem>
                                        {terminals.map((t) => {
                                            const tid = t?.TerminalId || t?.id
                                            return (
                                                <MenuItem key={tid} value={tid}>
                                                    {t?.TerminalName || t?.name || `Terminal #${tid}`}
                                                </MenuItem>
                                            )
                                        })}
                                    </Select>
                                </FormControl>
                            </div>
                            <Typography className="text-[12px] text-[#6B7280]">
                                Leave `User`, `Terminal`, or `Institute` empty to broadcast within the selected scope.
                            </Typography>
                            <FormControl fullWidth>
                                <InputLabel>Institute (optional)</InputLabel>
                                <Select
                                    value={form.instituteId}
                                    label="Institute (optional)"
                                    onChange={(e) => updateForm("instituteId", e.target.value)}
                                >
                                    <MenuItem value="">
                                        <em>None - all institutes</em>
                                    </MenuItem>
                                    {institutes.map((inst) => {
                                        const iid = inst?.InstituteId || inst?.id
                                        return (
                                            <MenuItem key={iid} value={iid}>
                                                {inst?.InstituteName || inst?.name || `Institute #${iid}`}
                                            </MenuItem>
                                        )
                                    })}
                                </Select>
                            </FormControl>
                            <Button
                                size="small"
                                onClick={() => setShowAdvanced((prev) => !prev)}
                                className="self-start"
                                sx={{ textTransform: "none", px: 0, fontWeight: 700 }}
                            >
                                {showAdvanced ? "Hide advanced options" : "Show advanced options"}
                            </Button>
                            <Collapse in={showAdvanced}>
                                <div className="flex flex-col gap-3">
                                    <TextField
                                        label="Related Entity Type"
                                        value={form.relatedEntityType}
                                        onChange={(e) => updateForm("relatedEntityType", e.target.value)}
                                        fullWidth
                                        placeholder="e.g. route, vehicle, trip"
                                    />
                                    <TextField
                                        label="Related Entity ID"
                                        value={form.relatedEntityId}
                                        onChange={(e) => updateForm("relatedEntityId", e.target.value)}
                                        fullWidth
                                        type="number"
                                    />
                                </div>
                            </Collapse>
                        </div>
                    </DialogContent>
                    <DialogActions sx={{ px: 3, py: 2.5 }}>
                        <Button onClick={handleCloseSend} disabled={loadingSend}>Cancel</Button>
                        <Button
                            variant="contained"
                            onClick={handleSend}
                            sx={activePillButtonSx}
                            disabled={
                                loadingSend ||
                                !String(form.title || "").trim() ||
                                !String(form.message || "").trim() ||
                                !String(form.audience || "").trim()
                            }
                        >
                            {loadingSend ? "Sending..." : "Send"}
                        </Button>
                    </DialogActions>
                </Dialog>
            </section>
            <Toaster position="top-right" reverseOrder={false} toastOptions={{ duration: 3000 }} />
        </MainLayout>
    )
}

export default Notification
