import colors from '@/utlis/Colors';
import EmployeeHeaderNav from './EmployeeHeaderNav';
import EmployeeSidebar from './EmployeeSidebar';

const DashboardLayout = ({ children }) => {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 h-full flex-shrink-0 border-r border-gray-200 bg-white">
        <EmployeeSidebar />
      </aside>

      {/* Main content */}
      <div className="flex flex-col flex-1 min-h-0">
        {/* Header */}
        <header className="flex-shrink-0">
          <EmployeeHeaderNav />
        </header>

        {/* Main area */}
        <main
          className="flex-1 min-h-0 overflow-y-auto p-6"
          style={{ backgroundColor: colors?.peachColor || '#f4f1e8' }}
        >
          <div className="max-w-screen-2xl mx-auto">
            {children}
          </div>
        </main>

      </div>
    </div>
  );
};

export default DashboardLayout;
