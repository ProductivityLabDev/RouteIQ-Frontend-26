import { useState, useRef, useEffect } from 'react';
import { IoRadioButtonOffOutline, IoRadioButtonOnOutline } from 'react-icons/io5';

// Define your hierarchical data structure
const roleData = {
    main: [
        'Terminal manager',
        'Dispatch',
        'Driver',
        'Bus Monitor'
    ],
    admin: {
        corporate: [
            'Accounting',
            'Safety',
            'Fleet management',
            'IT',
            'Contract',
            'Other',
            'Regional manager'
        ],
        terminal: [
            'Accounting',
            'Payroll',
            'Contract',
            'Helper',
            'Other'
        ]
    },
    additional: [
        'Mechanic',
        'Other'
    ]
};

function EmployeeDropdown() {
    const [isOpen, setIsOpen] = useState(false);
    const [selected, setSelected] = useState('Fleet management');
    const dropdownRef = useRef(null);

    // Function to close EmployeeDropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [dropdownRef]);

    const toggleDropdown = () => setIsOpen(!isOpen);

    const handleSelect = (role, section = null, subsection = null) => {
        let displayRole = role;

        // For duplicate role names like "Accounting" in different sections
        if (section === 'admin') {
            if (subsection === 'corporate') {
                displayRole = `${role} (Corporate)`;
            } else if (subsection === 'terminal') {
                displayRole = `${role} (Terminal)`;
            }
        }

        setSelected(displayRole);
        setIsOpen(false);
    };

    return (
        <div className="mb-4 relative" ref={dropdownRef}>
            <label className="block text-xs text-gray-700 mb-1">Select</label>
            <button
                type="button"
                onClick={toggleDropdown}
                className="flex items-center justify-between w-full px-4 py-2 bg-white border border-gray-300 rounded shadow-sm"
            >
                <span className="text-gray-500">{selected || 'Select a role'}</span>
                <svg
                    className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                >
                    <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                    />
                </svg>
            </button>

            {isOpen && (
                <div className="absolute z-10 w-full mt-1 bg-[#F9FBFF] border border-gray-300 rounded shadow-lg max-h-96 overflow-y-auto">
                    <div className="p-3 space-y-3">
                        {/* Main options */}
                        {roleData.main.map(role => (
                            <label key={role} className="flex items-center space-x-2 cursor-pointer">
                                {selected === role ? (
                                    <IoRadioButtonOnOutline className="w-5 h-5 text-blue-600" />
                                ) : (
                                    <IoRadioButtonOffOutline className="w-5 h-5 text-gray-400" />
                                )}
                                <span className="text-gray-800 text-base">{role}</span>
                                <input
                                    type="radio"
                                    name="role"
                                    value={role}
                                    checked={selected === role}
                                    onChange={() => handleSelect(role)}
                                    className="hidden"
                                />
                            </label>
                        ))}

                        {/* Admin section */}
                        <div className="pt-1">
                            <div className="text-gray-800 text-base font-medium mb-1">Admin</div>
                            <div className="border-t border-gray-300 mb-2"></div>

                            {/* Corporate subsection */}
                            <div className="ml-4 mb-3">
                                <div className="text-gray-800 text-base mb-1">Corporate</div>
                                <div className="border-t border-gray-200 mb-2"></div>

                                <div className="grid grid-cols-3 gap-2">
                                    {roleData.admin.corporate.slice(0, 3).map(role => (
                                        <label key={`corp-${role}`} className="flex items-center space-x-2 cursor-pointer">
                                            {selected === `${role} (Corporate)` || (role === 'Fleet management' && selected === 'Fleet management') ? (
                                                <IoRadioButtonOnOutline className={`w-5 h-5 ${role === 'Fleet management' ? 'text-red-500' : 'text-blue-600'}`} />
                                            ) : (
                                                <IoRadioButtonOffOutline className="w-5 h-5 text-gray-400" />
                                            )}
                                            <span className="text-gray-800">{role}</span>
                                            <input
                                                type="radio"
                                                name="role"
                                                value={role}
                                                checked={selected === `${role} (Corporate)` || (role === 'Fleet management' && selected === 'Fleet management')}
                                                onChange={() => handleSelect(role, 'admin', 'corporate')}
                                                className="hidden"
                                            />
                                        </label>
                                    ))}
                                </div>

                                <div className="grid grid-cols-4 gap-2 mt-2">
                                    {roleData.admin.corporate.slice(3).map(role => (
                                        <label key={`corp-${role}`} className="flex items-center space-x-2 cursor-pointer">
                                            {selected === `${role} (Corporate)` ? (
                                                <IoRadioButtonOnOutline className="w-5 h-5 text-blue-600" />
                                            ) : (
                                                <IoRadioButtonOffOutline className="w-5 h-5 text-gray-400" />
                                            )}
                                            <span className="text-gray-800">{role}</span>
                                            <input
                                                type="radio"
                                                name="role"
                                                value={role}
                                                checked={selected === `${role} (Corporate)`}
                                                onChange={() => handleSelect(role, 'admin', 'corporate')}
                                                className="hidden"
                                            />
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Terminal subsection */}
                            <div className="ml-4 mb-3">
                                <div className="text-gray-800 text-base mb-1">Terminal</div>
                                <div className="border-t border-gray-200 mb-2"></div>

                                <div className="grid grid-cols-4 gap-2 mb-2">
                                    {roleData.admin.terminal.slice(0, 4).map(role => (
                                        <label key={`term-${role}`} className="flex items-center space-x-2 cursor-pointer">
                                            {selected === `${role} (Terminal)` ? (
                                                <IoRadioButtonOnOutline className="w-5 h-5 text-blue-600" />
                                            ) : (
                                                <IoRadioButtonOffOutline className="w-5 h-5 text-gray-400" />
                                            )}
                                            <span className="text-gray-800">{role}</span>
                                            <input
                                                type="radio"
                                                name="role"
                                                value={role}
                                                checked={selected === `${role} (Terminal)`}
                                                onChange={() => handleSelect(role, 'admin', 'terminal')}
                                                className="hidden"
                                            />
                                        </label>
                                    ))}
                                </div>

                                {roleData.admin.terminal.slice(4).map(role => (
                                    <label key={`term-${role}`} className="flex items-center space-x-2 cursor-pointer">
                                        {selected === `${role} (Terminal)` ? (
                                            <IoRadioButtonOnOutline className="w-5 h-5 text-blue-600" />
                                        ) : (
                                            <IoRadioButtonOffOutline className="w-5 h-5 text-gray-400" />
                                        )}
                                        <span className="text-gray-800">{role}</span>
                                        <input
                                            type="radio"
                                            name="role"
                                            value={role}
                                            checked={selected === `${role} (Terminal)`}
                                            onChange={() => handleSelect(role, 'admin', 'terminal')}
                                            className="hidden"
                                        />
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Additional options */}
                        {roleData.additional.map(role => (
                            <label key={role} className="flex items-center space-x-2 cursor-pointer">
                                {selected === role ? (
                                    <IoRadioButtonOnOutline className="w-5 h-5 text-blue-600" />
                                ) : (
                                    <IoRadioButtonOffOutline className="w-5 h-5 text-gray-400" />
                                )}
                                <span className="text-gray-800 text-base">{role}</span>
                                <input
                                    type="radio"
                                    name="role"
                                    value={role}
                                    checked={selected === role}
                                    onChange={() => handleSelect(role)}
                                    className="hidden"
                                />
                            </label>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default EmployeeDropdown;