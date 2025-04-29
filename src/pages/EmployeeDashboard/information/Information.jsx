import React, { useState } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import BankAccountForm from '@/components/BankAccountForm'
import UpdateBankAccountForm from '@/components/UpdateBankAccountForm'
import { Button, Typography } from '@material-tailwind/react'

const Information = () => {
    const [isEditForm, setIsEditForm] = useState(false);
    const openModal = () => setIsEditForm(true);
    const closeModal = () => setIsEditForm(false);
    return (
        <DashboardLayout>
            <div className='w-[100%] flex flex-row justify-between items-center mb-5'>
                <Typography className="text-[23px] md:text-[32px] font-[700] text-[#000] mt-5 ps-2" sx={{ fontSize: { xs: '23px', md: '38px' }, fontWeight: 800 }}>{isEditForm ? "Update" : "Information"}</Typography>
                {!isEditForm &&
                    <Button onClick={openModal} className="mt-8 px-8 py-2.5 bg-[#C01824] text-[14px] capitalize rounded-[6px]" variant='filled' size='lg'>
                        Update
                    </Button>
                }
            </div>
            {isEditForm ? <UpdateBankAccountForm closeModal={closeModal} /> :
                <BankAccountForm />
            }
        </DashboardLayout>
    )
}

export default Information