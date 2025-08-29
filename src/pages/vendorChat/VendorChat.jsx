import {
    addfileicon,
    BlackPencilEdit,
    callsupporticon,
    darksearchicon,
    sendicon,
} from '@/assets';
import ChatPanel from '@/components/ChatPanel';
import { driversData, parentsData } from '@/data';
import MainLayout from '@/layouts/SchoolLayout';
import { Button, ButtonGroup, Tab, Tabs, TabsBody, TabsHeader } from '@material-tailwind/react';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export function VendorChat() {
    const [selectedBus, setSelectedBus] = useState('A');
    const [activeTab, setActiveTab] = useState('allstudents');
    const [messages, setMessages] = useState([]);
    const [selectedTab, setSelectedTab] = useState('Parent To School');
    const [isOpen, setIsOpen] = useState(false);
    const [nestedOpen, setNestedOpen] = useState(null);
    const [openAccordions, setOpenAccordions] = useState({
        parent: true,
        school: false,
        driver: false,
        terminal: false
    });

    const toggleAccordion = (id) => {
        setOpenAccordions({
            ...openAccordions,
            [id]: !openAccordions[id]
        });
    };

    const tabs = [
        { label: 'Parent', value: 'allstudents' },
        { label: 'School', value: 'drivers' },
    ];
    const Conditiontabs = [
        { label: 'Parent', value: 'allstudents' },
        { label: 'Driver', value: 'drivers' },
    ];
    const Conditiontabs2 = [
        { label: 'School', value: 'allstudents' },
        { label: 'Driver', value: 'drivers' },
    ];
    const currentData = activeTab === 'allstudents' ? parentsData[selectedBus] : driversData[selectedBus];
    const renderTabs = () => {
        if (selectedTab === "Parent To School") {
            return tabs.map(({ label, value }) => (
                <Tab
                    key={value}
                    value={value}
                    onClick={() => setActiveTab(value)}
                    className={activeTab === value ? "font-bold text-[#C01824]" : ""}
                >
                    {label}
                </Tab>
            ));
        } else if (selectedTab === "Parent To Driver") {
            return Conditiontabs.map(({ label, value }) => (
                <Tab
                    key={value}
                    value={value}
                    onClick={() => setActiveTab(value)}
                    className={activeTab === value ? "font-bold text-[#C01824]" : ""}
                >
                    {label}
                </Tab>
            ));
        } else if (selectedTab === "School To Driver") {
            return Conditiontabs2.map(({ label, value }) => (
                <Tab
                    key={value}
                    value={value}
                    onClick={() => setActiveTab(value)}
                    className={activeTab === value ? "font-bold text-[#C01824]" : ""}
                >
                    {label}
                </Tab>
            ));
        } else {
            return null;
        }
    };
    const toggleNested = (title) => {
        setNestedOpen(prev => (prev === title ? null : title));
    };
    console.log('nestedOpen', nestedOpen)
    return (
        <MainLayout>
            <section className='w-full h-full'>
                <div className='my-4 md:my-7 flex flex-col md:flex-row justify-between items-start space-y-4 md:space-y-0'>
                    <h1 className='font-bold text-[24px] md:text-[32px] text-[#202224]'>Chat Monitoring</h1>
                </div>
                
                <div className="w-full space-y-4">
                    <div className="w-full bg-white rounded shadow-sm mb-4">
                        <div className="flex items-center justify-between border border-[#D6D6D6] rounded px-4 py-4 cursor-pointer" onClick={() => toggleAccordion('parent')}>
                            <div className="flex items-center space-x-3">
                                <span className="text-[#202224]">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                    </svg>
                                </span>
                                <h2 className="font-medium text-gray-800">Parent</h2>
                                <button>
                                    <img src={BlackPencilEdit} />
                                </button>
                            </div>
                            <div className="flex items-center">
                                <button className="text-black">
                                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transition-transform duration-200 ${openAccordions.parent ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {openAccordions.parent && (
                            <div className="px-4 py-2 border-t border-gray-100">
                                {/* Nested accordion items within parent */}
                                <div className="space-y-2">
                                    {['School', 'Driver', 'Terminal'].map((title, index) => (
                                        <div key={index} className="bg-white shadow-sm">
                                            <div className="flex items-center justify-between border border-[#D6D6D6] rounded px-4 py-4 cursor-pointer">
                                                <div className="flex items-center space-x-3">
                                                    <span className="text-[#202224]">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                                        </svg>
                                                    </span>
                                                    <h2 className="font-medium text-gray-800">{title}</h2>
                                                    <button onClick={() => toggleNested(title)}>
                                                        <img src={BlackPencilEdit} />
                                                    </button>
                                                </div>
                                                <div className="flex items-center">
                                                    <button className="text-black" onClick={() => toggleNested(title)}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transition-transform duration-200 ${openAccordions.parent ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                            {nestedOpen === title && (
                                                <div className='flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-5 h-[75vh] px-4 pb-4'>
                                                    <ChatPanel nestedOpen={nestedOpen} />
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Standalone accordion items */}
                    {['School', 'Driver', 'Terminal'].map((title, index) => (
                        <div key={index} className="w-full bg-white rounded shadow-sm mb-4">
                            <div className="flex items-center justify-between px-4 py-3 cursor-pointer">
                                <div className="flex items-center space-x-3">
                                    <span className="text-[#202224]">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                        </svg>
                                    </span>
                                    <h2 className="font-medium text-gray-800">{title}</h2>
                                    <button>
                                        <img src={BlackPencilEdit} />
                                    </button>
                                </div>
                                <div className="flex items-center">
                                    <button className="text-black">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </MainLayout >
    );
}
