import React from 'react'
import { GLCodeItem } from '@/components/GLCodeItem';
import MainLayout from '@/layouts/SchoolLayout'

const GLCodes = () => {
    const glCodeData = [
        { glCode: "GL # 101-00", assignTo: "Fuel" },
        { glCode: "GL # 111-00", assignTo: "Driver Salary" },
        { glCode: "GL # 112-00", assignTo: "School Contract" },
        { glCode: "GL # 113-00", assignTo: "Vehicle license" },
        { glCode: "GL # 221-00", assignTo: "Property taxes" },
        { glCode: "GL # 222-00", assignTo: "Property rent" },
        { glCode: "GL # 224-00", assignTo: "Driver per diems" },
        { glCode: "GL # 313-00", assignTo: "Oil and fluids" },
        { glCode: "GL # 314-00", assignTo: "Insurance Premiums" },
        { glCode: "GL # 152-00", assignTo: "Net Income" },
        { glCode: "GL # 114-00", assignTo: "Total wage/benefits" },
        { glCode: "GL # 114-00", assignTo: "Total wage/benefits" },
    ];
    return (
        <MainLayout>
            <section className='w-full h-full p-4 md:p-6 lg:p-8 bg-white rounded-[10px]'>
                <div className="max-w-4xl">
                    <div className="flex justify-between mb-6 w-[63%]">
                        <h2 className="text-2xl font-bold">GL Codes</h2>
                        <h2 className="text-2xl font-bold">Assign to</h2>
                    </div>
                    {glCodeData.map((item, index) => (
                        <GLCodeItem key={index} glCode={item.glCode} assignTo={item.assignTo} />
                    ))}
                </div>
            </section>
        </MainLayout>
    )
}

export default GLCodes
