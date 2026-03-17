import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { GLCodeItem } from '@/components/GLCodeItem'
import MainLayout from '@/layouts/SchoolLayout'
import { fetchGlCodes } from '@/redux/slices/payrollSlice'

const GLCodes = () => {
    const dispatch = useDispatch()
    const { glCodes, loading, error } = useSelector((state) => state.payroll)

    useEffect(() => {
        dispatch(fetchGlCodes())
    }, [dispatch])

    return (
        <MainLayout>
            <section className='w-full h-full p-4 md:p-6 lg:p-8 bg-white rounded-[10px]'>
                <div className="max-w-4xl">
                    <div className="flex justify-between mb-6 w-[63%]">
                        <h2 className="text-2xl font-bold">GL Codes</h2>
                        <h2 className="text-2xl font-bold">Assign to</h2>
                    </div>
                    {loading.glCodes && <p className="text-gray-500">Loading...</p>}
                    {error.glCodes && <p className="text-red-500">{error.glCodes}</p>}
                    {glCodes.map((item) => (
                        <GLCodeItem
                            key={item.glCodeId}
                            glCodeId={item.glCodeId}
                            glCode={item.glCode}
                            glCodeName={item.glCodeName}
                            category={item.category}
                            defaultUnitPrice={item.defaultUnitPrice}
                            items={item.items || []}
                        />
                    ))}
                </div>
            </section>
        </MainLayout>
    )
}

export default GLCodes
