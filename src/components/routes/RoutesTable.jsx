import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRouteManagementTerminals, fetchInstituteRoutes } from '@/redux/slices/routesSlice';

const RoutesTable = () => {
    const dispatch = useDispatch();
    const { terminalsHierarchy, routesByInstitute, loading } = useSelector((s) => s.routes);

    const [selectedInstitute, setSelectedInstitute] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        dispatch(fetchRouteManagementTerminals());
    }, [dispatch]);

    // Flatten terminal hierarchy -> one row per institute
    const rows = (terminalsHierarchy || []).flatMap((terminal) =>
        (terminal.institutes || []).map((inst) => ({
            terminalName: terminal.terminalName || terminal.terminalCode || '--',
            ...inst,
        }))
    );

    const openModal = (row) => {
        setSelectedInstitute(row);
        dispatch(fetchInstituteRoutes(row.instituteId));
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedInstitute(null);
    };

    const isLoadingTerminals = loading.terminalsHierarchy;
    const routes = selectedInstitute ? (routesByInstitute[selectedInstitute.instituteId] || []) : [];
    const isLoadingRoutes = selectedInstitute
        ? (loading.instituteRoutes[selectedInstitute.instituteId] || false)
        : false;

    return (
        <>
            <div className="border border-[#EEEEEE] rounded mt-4">
                <div className="overflow-x-auto max-h-96 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                    <table className="min-w-full">
                        <thead className="bg-[#EEEEEE] sticky top-0 z-10">
                            <tr>
                                <th className="px-3 py-2 border-b text-left font-bold">Terminal</th>
                                <th className="px-3 py-2 border-b text-left font-bold">School / Institute</th>
                                <th className="px-3 py-2 border-b text-left font-bold">Routes</th>
                                <th className="px-3 py-2 border-b text-left font-bold">Buses</th>
                                <th className="px-3 py-2 border-b text-left font-bold">Students</th>
                                <th className="px-3 py-2 border-b text-left font-bold">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoadingTerminals ? (
                                <tr>
                                    <td colSpan={6} className="px-4 py-6 text-center text-sm text-gray-400">Loading...</td>
                                </tr>
                            ) : rows.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-4 py-6 text-center text-sm text-gray-400">No routes found</td>
                                </tr>
                            ) : (
                                rows.map((row, index) => (
                                    <tr key={`${row.terminalName}-${row.instituteId}`} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                        <td className="px-3 py-2 border-b text-sm">{row.terminalName}</td>
                                        <td className="px-3 py-2 border-b text-sm">{row.instituteName}</td>
                                        <td className="px-3 py-2 border-b text-sm">{row.totalRoutes ?? '--'}</td>
                                        <td className="px-3 py-2 border-b text-sm">{row.totalBuses ?? '--'}</td>
                                        <td className="px-3 py-2 border-b text-sm">{row.totalStudents ?? '--'}</td>
                                        <td className="px-3 py-2 border-b text-sm">
                                            <button
                                                className="text-[#c01824] underline"
                                                onClick={() => openModal(row)}
                                            >
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Routes Detail Modal */}
            {isModalOpen && selectedInstitute && (
                <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white rounded-lg p-6 w-full max-w-4xl shadow-lg overflow-auto max-h-[90vh]">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">
                                {selectedInstitute.instituteName} — Routes
                            </h2>
                            <button onClick={closeModal} className="text-gray-600 text-2xl leading-none">&times;</button>
                        </div>

                        {isLoadingRoutes ? (
                            <p className="text-center text-gray-400 py-6">Loading routes...</p>
                        ) : routes.length === 0 ? (
                            <p className="text-center text-gray-400 py-6">No routes found</p>
                        ) : (
                            <table className="min-w-full border">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="px-4 py-2 border text-left font-bold">Route #</th>
                                        <th className="px-4 py-2 border text-left font-bold">Route Name</th>
                                        <th className="px-4 py-2 border text-left font-bold">Driver</th>
                                        <th className="px-4 py-2 border text-left font-bold">Vehicle</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {routes.map((route, i) => (
                                        <tr key={route.routeId ?? i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                            <td className="px-4 py-2 border">{route.routeNumber || '--'}</td>
                                            <td className="px-4 py-2 border">{route.routeName || '--'}</td>
                                            <td className="px-4 py-2 border">{route.driverName || '--'}</td>
                                            <td className="px-4 py-2 border">{route.vehicleNumberPlate || '--'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}

                        <div className="mt-4 text-right">
                            <button
                                onClick={closeModal}
                                className="bg-[#c01824] text-white px-4 py-2 rounded"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default RoutesTable;
