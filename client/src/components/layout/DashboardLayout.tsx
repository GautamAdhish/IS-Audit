import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const DashboardLayout: React.FC = () => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-100 p-3 md:p-4 gap-3 md:gap-4">
      {/* Mobile overlay */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-10 lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar — floating rail, desktop always visible, mobile as overlay drawer */}
      <div
        className={`
          fixed lg:relative top-3 bottom-3 left-3 md:top-4 md:bottom-4 md:left-4 lg:inset-auto lg:top-auto lg:bottom-auto lg:left-auto
          z-20 transition-transform duration-300
          ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-[120%]'}
          lg:translate-x-0
        `}
      >
        <Sidebar />
      </div>

      {/* Main area */}
      <div className="flex flex-col flex-1 min-w-0 gap-3 md:gap-4">
        <Header onMenuToggle={() => setMobileSidebarOpen((open) => !open)} />
        <main className="flex-1 min-h-0 overflow-y-auto bg-white rounded-3xl shadow-[0_1px_3px_rgba(16,26,46,0.06),0_1px_2px_rgba(16,26,46,0.04)] p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
