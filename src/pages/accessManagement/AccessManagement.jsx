import React, { useState } from 'react'
import MainLayout from '@/layouts/SchoolLayout'
import { Button, ButtonGroup, Input, Popover, PopoverContent, PopoverHandler } from '@material-tailwind/react';
import { accessUsersData } from '@/data/dummyData';
import UserCard from '@/components/UserCard';
import CreateAccessCard from '@/components/CreateAccessCard';
import DeleteUserModal from '@/components/DeleteAccessUser';


const AccessManagement = () => {
    const [createAccess, setCreateAccess] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const handleDelete = () => {
        setIsDeleteModalOpen(false);
    };
    const handleOpenDeleteModal = () => {
        setIsDeleteModalOpen(true);
    }
    return (
        <MainLayout>
            <section className='w-full h-full'>
                {createAccess ? (
                    <CreateAccessCard setCreateAccess={setCreateAccess} />
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
                        <div className="py-8 px-4">
                            <div className="w-full mx-auto">
                                {accessUsersData.map((u, idx) => (
                                    <UserCard key={idx} username={u.username} password={u.password} handleOpenDeleteModal={handleOpenDeleteModal} />
                                ))}
                            </div>
                        </div>
                    </>
                )}
                <DeleteUserModal
                    isOpen={isDeleteModalOpen}
                    onClose={() => setIsDeleteModalOpen(false)}
                    onDelete={handleDelete}
                />
            </section>
        </MainLayout>
    )
}

export default AccessManagement