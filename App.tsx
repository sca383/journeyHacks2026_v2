
import React, { useState } from 'react';
import { AppView, UserProfile } from './types';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './views/Dashboard';
import ProfessionalsView from './views/ProfessionalsView';
import PrescriptionsView from './views/PrescriptionsView';
import SettingsView from './views/SettingsView';
import Chatbot from './components/Chatbot';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Global user profile state
  const [profile, setProfile] = useState<UserProfile>({
    name: 'John Smith',
    email: 'john.smith@example.com',
    phone: '+1 (555) 123-4567',
    address: '123 Silver Lane, Maplewood, NJ 07040',
    imageUrl: 'https://picsum.photos/seed/user/100',
    membershipStatus: 'Premium Member'
  });

  const renderView = () => {
    switch (currentView) {
      case AppView.DASHBOARD:
        return <Dashboard />;
      case AppView.PROFESSIONALS:
        return <ProfessionalsView />;
      case AppView.SETTINGS:
        return (
          <SettingsView 
            userProfile={profile} 
            onProfileUpdate={(updated) => setProfile({ ...profile, ...updated })} 
          />
        );
      case AppView.PRESCRIPTIONS:
        return <PrescriptionsView />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar 
        currentView={currentView} 
        onViewChange={setCurrentView} 
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        userProfile={profile}
      />
      
      <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? 'md:ml-72' : 'ml-0'}`}>
        <Header 
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
          currentView={currentView}
          userName={profile.name}
        />
        
        <main className="flex-1 overflow-y-auto">
          {renderView()}
        </main>
      </div>

      <Chatbot />
    </div>
  );
};

export default App;
