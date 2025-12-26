import React, { useState } from 'react'
import MainLayout from '@/layouts/SchoolLayout'
import { Button } from '@material-tailwind/react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { deleteUser } from '@/redux/slices/usersSlice';
import UserCard from '@/components/UserCard';
import CreateAccessCard from '@/components/CreateAccessCard';
import DeleteUserModal from '@/components/DeleteAccessUser';
import { Toaster, toast } from 'react-hot-toast';

/**
 * @type {import('./AccessManagement').default}
 */
const AccessManagement = () => {
    const dispatch = useAppDispatch();
    const { deleting } = useAppSelector((state) => state.users);
console.log("Google Maps API Key:", import.meta.env.VITE_GOOGLE_MAPS_API_KEY);

    const [createAccess, setCreateAccess] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [editUser, setEditUser] = useState(null); // User data for editing

    const handleOpenDeleteModal = (userId) => {
        console.log("🗑️ Opening delete modal for user ID:", userId);
        setSelectedUserId(userId);
        setIsDeleteModalOpen(true);
    };

    const handleEditUser = (user) => {
        console.log("✏️ Opening edit form for user:", user);
        setEditUser(user);
        setCreateAccess(true);
    };


    const handleCloseCreateAccess = () => {
        setCreateAccess(false);
        setEditUser(null); // Clear edit user when closing
    };

    // DELETE API - Called when user clicks "Yes, Delete" in modal
    const handleDeleteUser = async () => {
        if (!selectedUserId) {
            console.error("❌ No user ID selected for deletion");
            toast.error("No user selected for deletion")
            setIsDeleteModalOpen(false);
            return;
        }

        try {
            console.log("🗑️ [Redux] Attempting to delete user with ID:", selectedUserId);

            const result = await dispatch(deleteUser(selectedUserId));

            if (deleteUser.fulfilled.match(result)) {
                toast.success("User deleted successfully!");
                // Close modal after a short delay to allow toast to show
                setTimeout(() => {
                    setIsDeleteModalOpen(false);
                    setSelectedUserId(null);
                }, 300);
                setRefreshTrigger(prev => prev + 1);
            } else {
                const errorMessage = result.payload || "Failed to delete user";
                toast.error(`Error: ${errorMessage}`);
            }
        } catch (err) {
            console.error("❌ [Redux] Delete error:", err);
            toast.error(err.message || "Failed to delete user")
        }
    };
    return (
        <>
            <Toaster position="top-right" reverseOrder={false} toastOptions={{
                style: {
                    fontSize: "18px",
                    padding: "16px 22px",
                    minHeight: "60px",
                    borderRadius: "40px",
                },
            }} />
            <MainLayout>
                <section className='w-full h-full'>
                    {createAccess ? (
                        <CreateAccessCard
                            setCreateAccess={handleCloseCreateAccess}
                            editUser={editUser}
                        />
                    ) : (
                        <>
                            <div className='w-full'>
                                <div className="flex justify-between items-center my-3 pb-2">
                                    <h2 className="text-[22px] ml-2 lg:text-[26px] xl:text-[29px] font-bold text-black">
                                        Access Management
                                    </h2>
                                    <Button
                                        className="bg-[#C01824] md:!px-10 !py-3 capitalize text-sm md:text-[16px] font-normal flex items-center"
                                        variant="filled"
                                        size="lg"
                                        onClick={() => setCreateAccess(true)}
                                    >
                                        Create Access
                                    </Button>
                                </div>
                            </div >
                            <div className="py-8 px-4 flex flex-col" style={{ height: 'calc(100vh - 180px)' }}>
                                <div className="w-full mx-auto flex-1 overflow-hidden">
                                    <div
                                        className="h-full overflow-y-auto pr-2 custom-scrollbar"
                                        style={{
                                            maxHeight: '100%',
                                            scrollbarWidth: 'thin',
                                            scrollbarColor: '#C01824 #f1f1f1'
                                        }}
                                    >
                                        <style>
                                            {`
                                            .custom-scrollbar::-webkit-scrollbar {
                                                width: 8px;
                                            }
                                            .custom-scrollbar::-webkit-scrollbar-track {
                                                background: #f1f1f1;
                                                border-radius: 10px;
                                            }
                                            .custom-scrollbar::-webkit-scrollbar-thumb {
                                                background: #C01824;
                                                border-radius: 10px;
                                            }
                                            .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                                                background: #A01520;
                                            }
                                        `}
                                        </style>
                                        <UserCard
                                            handleOpenDeleteModal={handleOpenDeleteModal}
                                            handleEditUser={handleEditUser}
                                            refreshTrigger={refreshTrigger}
                                        />
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                    <DeleteUserModal
                        isOpen={isDeleteModalOpen}
                        onClose={() => {
                            if (!deleting) {
                                setIsDeleteModalOpen(false);
                                setSelectedUserId(null);
                            }
                        }}
                        onDelete={handleDeleteUser}
                        isDeleting={deleting}
                    />
                </section>
            </MainLayout>
        </>
    )
}

export default AccessManagement