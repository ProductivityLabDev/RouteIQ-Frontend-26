import { useState, useRef, useEffect } from 'react';
import { IoRadioButtonOffOutline, IoRadioButtonOnOutline } from 'react-icons/io5';

const roleData = {
  corporate: [
    'Terminal manager',
    'Dispatch',
    'Driver',
    'Bus Monitor',
    'Accounting',
    'Safety',
    'Fleet management',
    'IT',
    'Contract',
    'Other',
    'Regional manager'
  ],
  terminal: ['Accounting', 'Payroll', 'Contract', 'Helper', 'Mechanic', 'Other'],
  additional: ['Mechanic', 'Other']
};

function EmployeeDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState('Fleet management (Corporate)');
  const dropdownRef = useRef(null);

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
  }, []);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleSelect = (role, category = '') => {
    const displayRole = category ? `${role} (${category})` : role;
    setSelected(displayRole);
    setIsOpen(false);
  };

  const renderRoleGroup = (title, roles, category) => (
    <div>
      <div className="text-gray-800 text-base font-medium mb-1">{title}</div>
      <div className="border-t border-gray-300 mb-2"></div>
      <div className="grid grid-cols-3 gap-2">
        {roles.map(role => {
          const value = `${role} (${category})`;
          return (
            <label key={`${category}-${role}`} className="flex items-center space-x-2 cursor-pointer">
              {selected === value ? (
                <IoRadioButtonOnOutline className="w-5 h-5 text-red-500" />
              ) : (
                <IoRadioButtonOffOutline className="w-5 h-5 text-gray-400" />
              )}
              <span className="text-gray-800">{role}</span>
              <input
                type="radio"
                name="role"
                value={value}
                checked={selected === value}
                onChange={() => handleSelect(role, category)}
                className="hidden"
              />
            </label>
          );
        })}
      </div>
    </div>
  );

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
          <div className="p-3 space-y-4">
            {renderRoleGroup('Corporate', roleData.corporate, 'Corporate')}
            {renderRoleGroup('Terminal', roleData.terminal, 'Terminal')}
            {renderRoleGroup('Additional Roles', roleData.additional, 'Additional')}
          </div>
        </div>
      )}
    </div>
  );
}

export default EmployeeDropdown;
