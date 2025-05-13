import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FileText, Users, Settings, FileUp, BarChart4, Package } from 'lucide-react';

interface SidebarProps {
  closeSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ closeSidebar }) => {
  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Invoices', href: '/invoices', icon: FileText },
    { name: 'Vendors', href: '/vendors', icon: Users },
    { name: 'Products', href: '/products', icon: Package },
    { name: 'Reports', href: '/reports', icon: BarChart4 },
    { name: 'Upload', href: '/upload', icon: FileUp },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto">
      <div className="flex items-center flex-shrink-0 px-4">
        <div className="flex items-center">
          <div className="bg-amber-500 p-2 rounded">
            <FileText className="h-8 w-8 text-white" />
          </div>
          <h1 className="ml-3 text-xl font-bold text-white">ProcurePal</h1>
        </div>
      </div>
      <div className="mt-5 flex-1 flex flex-col">
        <nav className="flex-1 px-2 space-y-1">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                `${
                  isActive
                    ? 'bg-blue-800 text-white'
                    : 'text-blue-100 hover:bg-blue-800'
                } group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors duration-150`
              }
              onClick={closeSidebar}
            >
              <item.icon className="mr-3 h-5 w-5 text-blue-200" aria-hidden="true" />
              {item.name}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;