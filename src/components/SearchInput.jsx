import React from 'react';

const SearchInput = () => {
    return (
        <div className='w-[28%]'>
            <div className="relative">
                <div className="bg-white rounded-md flex items-center shadow-sm px-3 py-2">
                    <div className="text-black mr-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                    </div>
                    <input
                        type="text"
                        placeholder="Search.."
                        className="w-full bg-transparent border-none outline-none text-gray-700 placeholder-gray-400"
                    />
                </div>
            </div>
        </div>
    );
};

export default SearchInput;