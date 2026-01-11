
import React from 'react';
import { AppView, UserProfile } from '../types';

interface SidebarProps {
  currentView: AppView;
  onViewChange: (view: AppView) => void;
  isOpen: boolean;
  onToggle: () => void;
  userProfile: UserProfile;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange, isOpen, onToggle, userProfile }) => {
  const menuItems = [
    { 
      id: AppView.DASHBOARD, 
      label: 'Home', 
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    },
    { 
      id: AppView.PROFESSIONALS, 
      label: 'Find a Professional', 
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      )
    },
    { 
      id: AppView.PRESCRIPTIONS, 
      label: 'My Prescriptions', 
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      )
    },
    { 
      id: AppView.SETTINGS, 
      label: 'Settings', 
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    },
  ];

  const LOGO_SRC = "https://raw.githubusercontent.com/ai-code-images/logos/main/silvercare_heart.png";

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onToggle}
        />
      )}

      <aside className={`fixed top-0 left-0 h-full bg-white border-r border-slate-200 z-50 transition-transform duration-300 w-72 ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 flex flex-col`}>
        <div className="p-6 flex-1">
          {/* Logo Section */}
          <button 
            onClick={() => {
              onViewChange(AppView.DASHBOARD);
              if (window.innerWidth < 768 && isOpen) onToggle();
            }}
            className="flex items-center gap-4 mb-12 group hover:opacity-80 transition-all text-left w-full px-2"
            aria-label="Go to Home"
          >
            <div className="w-12 h-12 flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
              <img 
                src={LOGO_SRC} 
                alt="SilverCare Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">SilverCare</h1>
          </button>

          {/* Navigation */}
          <nav className="space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onViewChange(item.id);
                  if (window.innerWidth < 768) onToggle();
                }}
                className={`w-full flex items-center gap-4 px-2 py-3.5 rounded-xl transition-all ${
                  currentView === item.id 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div className={`w-12 flex items-center justify-center flex-shrink-0 ${currentView === item.id ? 'text-blue-600' : 'text-slate-400'}`}>
                  {item.icon}
                </div>
                <span className="text-base font-bold whitespace-nowrap">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* User Profile Section - Clickable */}
        <div className="p-6 border-t border-slate-100">
          <button 
            onClick={() => {
              onViewChange(AppView.SETTINGS);
              if (window.innerWidth < 768 && isOpen) onToggle();
            }}
            className={`w-full flex items-center gap-4 px-2 py-3 rounded-2xl transition-all hover:bg-slate-100 group text-left ${currentView === AppView.SETTINGS ? 'bg-blue-50' : 'bg-slate-50'}`}
          >
            <div className="w-12 flex-shrink-0 flex items-center justify-center">
              <img 
                src={userProfile.imageUrl} 
                className="w-11 h-11 rounded-full border-2 border-white shadow-sm object-cover group-hover:scale-105 transition-transform" 
                alt={userProfile.name} 
              />
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-black text-slate-800 whitespace-nowrap">{userProfile.name}</p>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">{userProfile.membershipStatus}</p>
            </div>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
