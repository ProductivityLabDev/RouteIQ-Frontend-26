import React from 'react'

const RequestModal = ({ closeModal }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white w-full max-w-5xl p-6 rounded-md shadow-lg relative">
                <button
                    onClick={closeModal}
                    className="absolute top-4 right-4 text-gray-700 text-2xl font-bold"
                >
                    ✕
                </button>

                <h2 className="text-2xl font-bold mb-6">Time-Off Request</h2>

                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr>
                                <th className="border border-gray-200 bg-gray-100 py-3 px-3 text-left">Date</th>
                                <th className="border border-gray-200 bg-gray-100 py-3 px-3 text-left">Punch In</th>
                                <th className="border border-gray-200 bg-gray-100 py-3 px-3 text-left">Punched Out</th>
                                <th className="border border-gray-200 bg-gray-100 py-3 px-3 text-left">Work Hours</th>
                                <th className="border border-gray-200 bg-gray-100 py-3 px-3 text-left">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="border border-gray-200 py-3 px-3">6/19/14</td>
                                <td className="border border-gray-200 py-3 px-3">01:11</td>
                                <td className="border border-gray-200 py-3 px-3">00:36</td>
                                <td className="border border-gray-200 py-3 px-3">15h 40m</td>
                                <td className="border border-gray-200 py-3 px-3">
                                    <div className="flex gap-2">
                                        <button className="bg-green-500 text-white px-3 py-1 rounded text-sm">Approve</button>
                                        <button className="bg-red-600 text-white px-3 py-1 rounded text-sm">Reject</button>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td className="border border-gray-200 py-3 px-3">10/28/12</td>
                                <td className="border border-gray-200 py-3 px-3">08:00</td>
                                <td className="border border-gray-200 py-3 px-3">12:34</td>
                                <td className="border border-gray-200 py-3 px-3">11h 45m</td>
                                <td className="border border-gray-200 py-3 px-3">
                                    <div className="flex gap-2">
                                        <button className="bg-green-500 text-white px-3 py-1 rounded text-sm">Approve</button>
                                        <button className="bg-red-600 text-white px-3 py-1 rounded text-sm">Reject</button>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td className="border border-gray-200 py-3 px-3">2/11/12</td>
                                <td className="border border-gray-200 py-3 px-3">02:45</td>
                                <td className="border border-gray-200 py-3 px-3">05:12</td>
                                <td className="border border-gray-200 py-3 px-3">10h 25m</td>
                                <td className="border border-gray-200 py-3 px-3">
                                    <div className="flex gap-2">
                                        <button className="bg-green-500 text-white px-3 py-1 rounded text-sm">Approve</button>
                                        <button className="bg-red-600 text-white px-3 py-1 rounded text-sm">Reject</button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Attendance Request */}
                <h2 className="text-2xl font-bold my-6">Approval History</h2>

                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr>
                                <th className="border border-gray-200 bg-gray-100 py-3 px-3 text-left">Date</th>
                                <th className="border border-gray-200 bg-gray-100 py-3 px-3 text-left">Punch In</th>
                                <th className="border border-gray-200 bg-gray-100 py-3 px-3 text-left">Punched Out</th>
                                <th className="border border-gray-200 bg-gray-100 py-3 px-3 text-left">Work Hours</th>
                                <th className="border border-gray-200 bg-gray-100 py-3 px-3 text-left">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="border border-gray-200 py-3 px-3">6/19/14</td>
                                <td className="border border-gray-200 py-3 px-3">01:11</td>
                                <td className="border border-gray-200 py-3 px-3">00:36</td>
                                <td className="border border-gray-200 py-3 px-3">15h 40m</td>
                                <td className="border border-gray-200 py-3 px-3">
                                    <div className="flex gap-2">
                                        <button className="bg-green-500 text-white px-3 py-1 rounded text-sm">Approve</button>
                                        <button className="bg-red-600 text-white px-3 py-1 rounded text-sm">Reject</button>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td className="border border-gray-200 py-3 px-3">10/28/12</td>
                                <td className="border border-gray-200 py-3 px-3">08:00</td>
                                <td className="border border-gray-200 py-3 px-3">12:34</td>
                                <td className="border border-gray-200 py-3 px-3">11h 45m</td>
                                <td className="border border-gray-200 py-3 px-3">
                                    <div className="flex gap-2">
                                        <button className="bg-green-500 text-white px-3 py-1 rounded text-sm">Approve</button>
                                        <button className="bg-red-600 text-white px-3 py-1 rounded text-sm">Reject</button>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td className="border border-gray-200 py-3 px-3">2/11/12</td>
                                <td className="border border-gray-200 py-3 px-3">02:45</td>
                                <td className="border border-gray-200 py-3 px-3">05:12</td>
                                <td className="border border-gray-200 py-3 px-3">10h 25m</td>
                                <td className="border border-gray-200 py-3 px-3">
                                    <div className="flex gap-2">
                                        <button className="bg-green-500 text-white px-3 py-1 rounded text-sm">Approve</button>
                                        <button className="bg-red-600 text-white px-3 py-1 rounded text-sm">Reject</button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default RequestModal