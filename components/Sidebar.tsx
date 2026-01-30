
import React, { useState } from 'react';

interface SidebarProps {
  currentView: string;
  switchView: (view: string) => void;
  isOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, switchView, isOpen }) => {
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

  const toggleSubmenu = (id: string) => {
    setOpenSubmenu(openSubmenu === id ? null : id);
  };

  const NavItem = ({ view, icon, label }: { view: string, icon: string, label: string }) => (
    <button
      onClick={() => switchView(view)}
      className={`w-full flex items-center p-3 rounded-lg transition-all group ${currentView === view ? 'active-nav' : 'text-gray-700 hover:bg-brand-50 hover:text-brand-600'}`}
    >
      <div className="w-8 flex justify-center flex-shrink-0">
        <i className={`${icon} text-lg ${currentView === view ? 'text-brand-600' : 'group-hover:text-brand-500'}`}></i>
      </div>
      <span className="ml-3 font-medium">{label}</span>
    </button>
  );

  return (
    <aside className={`fixed lg:static inset-y-0 left-0 w-72 bg-white shadow-xl transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 z-30 flex flex-col h-full border-r border-gray-200`}>
      <div className="p-6 border-b border-gray-100 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="flex justify-center items-center mb-2">
            <i className="fa-solid fa-bolt text-4xl text-brand-500"></i>
          </div>
          <h1 className="text-xl font-bold text-gray-800 tracking-tight">Assignment</h1>
          <h2 className="text-xs font-semibold text-gray-500 tracking-wide uppercase mt-0.5">Interruption Team</h2>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        <NavItem view="dashboard_analytics" icon="fa-solid fa-chart-pie" label="Main Dashboard" />
        <NavItem view="calendar" icon="fa-regular fa-calendar-days" label="ปฏิทินงาน (Calendar)" />
        <NavItem view="plan_interruption" icon="fa-solid fa-clipboard-list" label="Interruption Plan" />

        {/* Project Plan Group */}
        <div className="space-y-1 pt-1">
          <button 
            onClick={() => toggleSubmenu('project')}
            className="w-full flex items-center justify-between p-3 rounded-lg text-gray-700 hover:bg-brand-50 hover:text-brand-600 group"
          >
            <div className="flex items-center">
              <div className="w-8 flex justify-center flex-shrink-0"><i className="fa-solid fa-file-contract text-lg group-hover:text-brand-500"></i></div>
              <span className="ml-3 font-medium">Project Plan</span>
            </div>
            <i className={`fa-solid fa-chevron-down text-xs transition-transform duration-300 text-gray-400 ${openSubmenu === 'project' ? 'rotate-180' : ''}`}></i>
          </button>
          <div className={`submenu pl-4 space-y-1 overflow-hidden transition-all duration-300 ${openSubmenu === 'project' ? 'max-h-40 opacity-100 py-1' : 'max-h-0 opacity-0'}`}>
            <button onClick={() => switchView('summary_plan')} className={`w-full text-left p-2 rounded-md text-sm pl-12 border-l-2 ${currentView === 'summary_plan' ? 'text-brand-600 border-brand-500 bg-brand-50 font-bold' : 'text-gray-600 hover:text-brand-600 border-transparent'}`}>
              <i className="fa-solid fa-list mr-2 text-xs"></i>Job List
            </button>
            <button onClick={() => switchView('summary_dashboard')} className={`w-full text-left p-2 rounded-md text-sm pl-12 border-l-2 ${currentView === 'summary_dashboard' ? 'text-brand-600 border-brand-500 bg-brand-50 font-bold' : 'text-gray-600 hover:text-brand-600 border-transparent'}`}>
              <i className="fa-solid fa-chart-simple mr-2 text-xs"></i>Analytics
            </button>
          </div>
        </div>

        <NavItem view="team" icon="fa-solid fa-users" label="Interruption Team" />

        {/* Subcontractor Group */}
        <div className="space-y-1 pt-1">
          <button 
            onClick={() => toggleSubmenu('sub')}
            className="w-full flex items-center justify-between p-3 rounded-lg text-gray-700 hover:bg-brand-50 hover:text-brand-600 group"
          >
            <div className="flex items-center">
              <div className="w-8 flex justify-center flex-shrink-0"><i className="fa-solid fa-helmet-safety text-lg group-hover:text-brand-500"></i></div>
              <span className="ml-3 font-medium">Subcontractor</span>
            </div>
            <i className={`fa-solid fa-chevron-down text-xs transition-transform duration-300 text-gray-400 ${openSubmenu === 'sub' ? 'rotate-180' : ''}`}></i>
          </button>
          <div className={`submenu pl-4 space-y-1 overflow-hidden transition-all duration-300 ${openSubmenu === 'sub' ? 'max-h-80 opacity-100 py-1' : 'max-h-0 opacity-0'}`}>
            <button onClick={() => switchView('sub_dashboard')} className={`w-full text-left p-2 rounded-md text-sm pl-12 border-l-2 ${currentView === 'sub_dashboard' ? 'text-brand-600 border-brand-500 bg-brand-50 font-bold' : 'text-gray-600 hover:text-brand-600 border-transparent'}`}>
              <i className="fa-solid fa-chart-line mr-2 text-xs"></i>Dashboard & Cost
            </button>
            {['sub_preventive', 'sub_reroute', 'sub_reconfigure'].map(v => (
              <button 
                key={v}
                onClick={() => switchView(v)} 
                className={`w-full text-left p-2 rounded-md text-sm pl-12 border-l-2 ${currentView === v ? 'text-brand-600 border-brand-500 bg-brand-50 font-bold' : 'text-gray-600 hover:text-brand-600 border-transparent'}`}
              >
                {v === 'sub_preventive' ? 'Preventive' : v === 'sub_reroute' ? 'Reroute' : 'Reconfigure'}
              </button>
            ))}
          </div>
        </div>

        <NavItem view="link_support" icon="fa-solid fa-link" label="Link Support" />
        <NavItem view="setting" icon="fa-solid fa-gear" label="Setting" />
      </nav>

      <div className="p-4 border-t border-gray-100 text-[10px] text-gray-400 text-center bg-gray-50">
        <p>© 2026 Assignment Interruption</p>
        <p className="mt-0.5">Version 2.5.0</p>
      </div>
    </aside>
  );
};

export default Sidebar;
