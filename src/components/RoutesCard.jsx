import React, { useState } from 'react'
import { columnIcon, routeTableIcon, vendorMap } from '@/assets'
import RoutesTable from './routes/RoutesTable'

const RoutesCard = () => {
    const [isRouteTable, setIsRouteTable] = useState(false)
    return (
        <div className="bg-white rounded-lg shadow-md p-4 w-[48%] h-[100%]">
            {/* ----------- Header of Card ----------------- */}
            <div className="flex justify-between items-center pb-2">
                <h2 className="text-[29px] font-bold text-black">Routes</h2>
                <button className="focus:outline-none border border-[#DADADA] w-[28px] h-[28px] flex items-center justify-center bg-[#F5F5F5]" style={{ borderRadius: "8px" }}>
                    {
                        isRouteTable ? <div className="w-[20px] h-[20px]" onClick={() => setIsRouteTable(!isRouteTable)}>
                            <img src={routeTableIcon} />
                        </div> : <div className="w-[20px] h-[20px]" onClick={() => setIsRouteTable(!isRouteTable)}>
                            <img src={columnIcon} />
                        </div>
                    }
                </button>
            </div>
            {isRouteTable ? (
                <RoutesTable />
            ) : (
                <img src={vendorMap} style={{ width: "100%" }} />
            )}

        </div>
    )
}

export default RoutesCard
