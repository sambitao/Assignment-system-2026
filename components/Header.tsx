
import React, { useState } from 'react';
import { MENU_CONFIGS } from '../constants';
import { User } from 'firebase/auth';

interface HeaderProps {
  toggleSidebar: () => void;
  online: boolean;
  currentView: string;
  user?: User | null;
  onLogout?: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar, online, currentView, user, onLogout }) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const getTitle = () => {
    if (currentView === 'dashboard_analytics') return 'Dashboard Analytics';
    if (currentView === 'summary_dashboard') return 'Project Plan Analytics';
    if (currentView === 'sub_dashboard') return 'Subcontractor Analytics';
    if (currentView === 'calendar') return 'ปฏิทินงาน (Calendar)';
    if (currentView === 'setting') return 'ตั้งค่าระบบ (Settings)';
    if (currentView === 'link_support') return 'Link Support Center';
    return MENU_CONFIGS[currentView]?.title || 'Assignment System';
  };

  return (
    <header className="bg-white shadow-sm h-16 flex-none flex items-center justify-between px-4 lg:px-8 z-10 border-b border-gray-200 sticky top-0">
      <div className="flex items-center">
        <button 
          onClick={toggleSidebar}
          className="lg:hidden text-gray-500 hover:text-brand-600 mr-4 focus:outline-none"
        >
          <i className="fa-solid fa-bars text-2xl"></i>
        </button>
        <h2 className="text-xl font-bold text-gray-800">
          <span className="text-brand-500 mr-2">|</span>{getTitle()}
        </h2>
      </div>
      
      <div className="flex items-center space-x-6">
        <div className="hidden md:flex flex-col items-end">
          <div className={`text-xs px-3 py-1.5 rounded-full ${online ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'} flex items-center`}>
            <span className={`w-2 h-2 rounded-full mr-2 ${online ? 'bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.6)]' : 'bg-yellow-400 indicator-pulse'}`}></span>
            <span className="font-medium">{online ? 'Online' : 'Connecting...'}</span>
          </div>
        </div>

        <div className="relative">
          <button 
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center space-x-3 group focus:outline-none"
          >
            <div className="hidden lg:block text-right">
              <p className="text-sm font-bold text-gray-800 line-clamp-1 group-hover:text-brand-600 transition-colors">
                {user?.displayName || 'User'}
              </p>
              <p className="text-[10px] text-gray-400 font-medium tracking-tight">
                {user?.email}
              </p>
            </div>
            <div className="h-10 w-10 relative">
              {user?.photoURL ? (
                <img src={user.photoURL} alt="Avatar" className="rounded-full border-2 border-white shadow-sm group-hover:border-brand-200 transition-all" />
              ) : (
                <div className="h-full w-full bg-gradient-to-br from-brand-100 to-orange-200 rounded-full flex items-center justify-center text-brand-600 shadow-sm border border-white">
                  <i className="fa-regular fa-user"></i>
                </div>
              )}
            </div>
          </button>

          {showProfileMenu && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowProfileMenu(false)}></div>
              <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 z-20 overflow-hidden animate-fadeIn py-2">
                <div className="px-4 py-3 border-b border-gray-50 lg:hidden">
                    <p className="text-sm font-bold text-gray-800 truncate">{user?.displayName}</p>
                    <p className="text-[10px] text-gray-400 truncate">{user?.email}</p>
                </div>
                <button 
                  onClick={() => { setShowProfileMenu(false); onLogout?.(); }}
                  className="w-full flex items-center px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors font-bold"
                >
                  <i className="fa-solid fa-arrow-right-from-bracket mr-3"></i>
                  Sign Out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
