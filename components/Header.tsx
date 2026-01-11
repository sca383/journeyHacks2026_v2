
import React, { useState, useRef, useEffect } from 'react';
import { AppView, Notification } from '../types';

interface HeaderProps {
  onToggleSidebar: () => void;
  currentView: AppView;
  userName: string;
}

const Header: React.FC<HeaderProps> = ({ onToggleSidebar, currentView, userName }) => {
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'Medication Reminder',
      message: 'It is time for your Vitamins & Blood Pressure meds.',
      time: 'Just now',
      type: 'reminder',
      isRead: false
    },
    {
      id: '2',
      title: 'Booking Confirmed',
      message: 'Your visit with Dr. Sarah Wilson is set for 4:00 PM.',
      time: '2 hours ago',
      type: 'update',
      isRead: false
    },
    {
      id: '3',
      title: 'Health Alert',
      message: 'High pollen count in your area today. Stay indoors if possible.',
      time: 'Yesterday',
      type: 'alert',
      isRead: true
    }
  ]);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const unreadCount = notifications.filter(n => !n.isRead).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const clearAll = () => {
    setNotifications([]);
    setIsNotifOpen(false);
  };

  const getViewTitle = () => {
    switch (currentView) {
      case AppView.DASHBOARD: return `Welcome back, ${userName.split(' ')[0]}`;
      case AppView.PROFESSIONALS: return 'Find Healthcare Experts';
      case AppView.PRESCRIPTIONS: return 'My Prescriptions';
      case AppView.SETTINGS: return 'Account Settings';
      default: return 'SilverCare';
    }
  };

  const getNotifIcon = (type: Notification['type']) => {
    switch (type) {
      case 'reminder': return '💊';
      case 'alert': return '⚠️';
      case 'update': return '📅';
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button 
          onClick={onToggleSidebar}
          className="p-2 hover:bg-slate-100 rounded-lg md:hidden"
          aria-label="Toggle Menu"
        >
          <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>
        <h2 className="text-xl md:text-2xl font-bold text-slate-800">{getViewTitle()}</h2>
      </div>

      <div className="flex items-center gap-3 relative" ref={dropdownRef}>
        <button 
          onClick={() => setIsNotifOpen(!isNotifOpen)}
          className={`p-2.5 rounded-full transition-all relative ${isNotifOpen ? 'bg-blue-50 text-blue-600' : 'hover:bg-slate-100 text-slate-600'}`}
          aria-label="View Notifications"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          {unreadCount > 0 && (
            <span className="absolute top-2 right-2 w-5 h-5 bg-red-500 text-white text-[10px] font-black rounded-full border-2 border-white flex items-center justify-center animate-bounce">
              {unreadCount}
            </span>
          )}
        </button>

        {/* Notifications Dropdown */}
        {isNotifOpen && (
          <div className="absolute top-full right-0 mt-2 w-[320px] md:w-[400px] bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="p-5 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                Notifications 
                {unreadCount > 0 && <span className="bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full text-xs">{unreadCount} new</span>}
              </h3>
              {notifications.length > 0 && (
                <button 
                  onClick={clearAll}
                  className="text-xs font-bold text-slate-400 hover:text-red-500 transition-colors"
                >
                  Clear All
                </button>
              )}
            </div>

            <div className="max-h-[450px] overflow-y-auto">
              {notifications.length > 0 ? (
                notifications.map((notif) => (
                  <div 
                    key={notif.id}
                    onClick={() => markAsRead(notif.id)}
                    className={`p-5 flex gap-4 hover:bg-slate-50 transition-colors cursor-pointer border-b border-slate-50 last:border-0 relative ${!notif.isRead ? 'bg-blue-50/30' : ''}`}
                  >
                    {!notif.isRead && (
                      <div className="absolute left-1.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                    )}
                    <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center text-2xl shrink-0">
                      {getNotifIcon(notif.type)}
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex justify-between items-start">
                        <p className={`font-bold leading-tight ${notif.isRead ? 'text-slate-700' : 'text-slate-900'}`}>
                          {notif.title}
                        </p>
                        <span className="text-[10px] font-bold text-slate-400 uppercase">{notif.time}</span>
                      </div>
                      <p className={`text-sm leading-relaxed ${notif.isRead ? 'text-slate-500' : 'text-slate-600'}`}>
                        {notif.message}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-12 text-center space-y-4">
                  <div className="text-5xl opacity-20">📭</div>
                  <p className="text-slate-400 font-medium text-lg">All caught up!</p>
                  <p className="text-slate-300 text-sm">New alerts will appear here.</p>
                </div>
              )}
            </div>

            {notifications.length > 0 && (
              <div className="p-4 bg-slate-50 border-t border-slate-100">
                <button 
                  onClick={() => setIsNotifOpen(false)}
                  className="w-full py-3 bg-white text-slate-600 font-bold rounded-xl border border-slate-200 hover:bg-slate-100 transition-all text-sm"
                >
                  Close Panel
                </button>
              </div>
            )}
          </div>
        )}
        
        <a 
          href="tel:911"
          className="flex items-center justify-center bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl font-bold transition-all shadow-lg shadow-red-100 active:scale-95 min-w-[80px]"
          aria-label="Call Emergency Services 911"
        >
          <span className="hidden sm:inline">Emergency Help</span>
          <span className="sm:hidden font-black">911</span>
        </a>
      </div>
    </header>
  );
};

export default Header;
