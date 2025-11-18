import React, { useState } from 'react'
import MainLayout from '@/layouts/SchoolLayout'
import { Button, ButtonGroup, Input, Popover, PopoverContent, PopoverHandler } from '@material-tailwind/react';
import UserCard from '@/components/UserCard';
import CreateAccessCard from '@/components/CreateAccessCard';
import DeleteUserModal from '@/components/DeleteAccessUser';
import axios from 'axios';
import { BASE_URL, getAxiosConfig } from '@/configs/api';

const AccessManagement = () => {
    const [createAccess, setCreateAccess] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);
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

    const handleRefreshUsers = () => {
        setRefreshTrigger(prev => prev + 1);
    };

    const handleCloseCreateAccess = () => {
        setCreateAccess(false);
        setEditUser(null); // Clear edit user when closing
    };

    // DELETE API - Called when user clicks "Yes, Delete" in modal
    const deleteUser = async () => {
        if (!selectedUserId) {
            console.error("❌ No user ID selected for deletion");
            alert("Error: No user selected for deletion");
            setIsDeleteModalOpen(false);
            return;
        }

        setIsDeleting(true);

        try {
            const deleteUrl = `${BASE_URL}/vendor/users/${selectedUserId}/soft-delete`;
            console.log("🗑️ Attempting to delete user with ID:", selectedUserId);
            console.log("📡 DELETE URL:", deleteUrl);
            console.log("🔑 Using token:", localStorage.getItem("token") ? "Token present" : "No token");

            const response = await axios.delete(
                deleteUrl,
                getAxiosConfig()
            );

            console.log("✅ User deleted successfully!");
            console.log("📦 Response data:", response.data);
            alert("User deleted successfully!");

            setIsDeleteModalOpen(false);
            setSelectedUserId(null);
            setRefreshTrigger(prev => prev + 1);

        } catch (err) {
            console.error("❌ Delete failed!");
            console.error("URL attempted:", `${BASE_URL}/vendor/users/${selectedUserId}/soft-delete`);
            console.error("Error details:", {
                status: err.response?.status,
                statusText: err.response?.statusText,
                data: err.response?.data,
                message: err.message,
                config: {
                    url: err.config?.url,
                    method: err.config?.method,
                    headers: err.config?.headers
                }
            });

            const errorMessage = err.response?.data?.message
                || err.response?.data?.error
                || err.message
                || "Failed to delete user. Please check the console for details.";

            alert(`Error: ${errorMessage}\n\nStatus: ${err.response?.status || 'N/A'}\n\nURL: ${BASE_URL}/vendor/users/${selectedUserId}/soft-delete\n\nPlease check the browser console for more details.`);
        } finally {
            setIsDeleting(false);
        }
    };
    return (
        <MainLayout>
            <section className='w-full h-full'>
                {createAccess ? (
                    <CreateAccessCard 
                        setCreateAccess={handleCloseCreateAccess} 
                        refreshUsers={handleRefreshUsers}
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
                        if (!isDeleting) {
                            setIsDeleteModalOpen(false);
                            setSelectedUserId(null);
                        }
                    }}
                    onDelete={deleteUser}
                    isDeleting={isDeleting}
                />
            </section>
        </MainLayout>
    )
}

export default AccessManagement