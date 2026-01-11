
import React, { useState } from 'react';

interface ScheduleItem {
  time: string;
  event: string;
  detail: string;
  status: 'completed' | 'pending' | 'upcoming' | 'planned';
}

const Dashboard: React.FC = () => {
  const [schedule, setSchedule] = useState<ScheduleItem[]>([
    { time: '08:00 AM', event: 'Morning Medication', detail: 'Vitamins & Blood Pressure', status: 'completed' },
    { time: '10:30 AM', event: 'Morning Walk', detail: 'Garden or Neighborhood', status: 'pending' },
    { time: '01:00 PM', event: 'Lunch with Mary', detail: 'Community Center', status: 'pending' },
    { time: '04:00 PM', event: 'Tele-Health Checkup', detail: 'Dr. Sarah Wilson (Virtual)', status: 'upcoming' },
  ]);

  const stats = [
    { label: 'Next Appointment', value: 'Today, 4:00 PM', icon: '📅', color: 'bg-blue-100 text-blue-700' },
    { label: 'Blood Pressure', value: '120/80', icon: '❤️', color: 'bg-red-100 text-red-700' },
    { label: 'Hydration', value: '1.5 / 2.0L', icon: '💧', color: 'bg-cyan-100 text-cyan-700' },
    { label: 'Active Goals', value: `${schedule.filter(s => s.status === 'completed').length} Completed`, icon: '🎯', color: 'bg-green-100 text-green-700' },
  ];

  const healthTips = [
    { title: 'Stay Active', text: 'A short 15-minute walk can improve circulation and mood.', icon: '🚶' },
    { title: 'Hydration Reminder', text: 'Drink a glass of water every 2 hours to stay sharp.', icon: '🥤' },
    { title: 'Mindfulness', text: 'Try deep breathing exercises to reduce stress levels.', icon: '🧘' },
  ];

  const handleToggleStatus = (index: number) => {
    setSchedule(prev => prev.map((item, i) => {
      if (i !== index) return item;
      
      // If completed, move back to planned/pending. If not completed, mark as done.
      const newStatus: ScheduleItem['status'] = item.status === 'completed' ? 'pending' : 'completed';
      return { ...item, status: newStatus };
    }));
  };

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto animate-in fade-in duration-500">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center text-2xl mb-4`}>
              {stat.icon}
            </div>
            <p className="text-slate-500 font-medium mb-1">{stat.label}</p>
            <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Daily Schedule */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-bold text-slate-800">Your Daily Schedule</h3>
            <span className="text-sm text-slate-500 font-medium bg-slate-100 px-3 py-1 rounded-full">
              Click status to change
            </span>
          </div>
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            {schedule.map((item, i) => (
              <div 
                key={i} 
                className={`flex items-center gap-6 p-6 border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-all ${item.status === 'completed' ? 'bg-slate-50/50' : ''}`}
              >
                <div className={`text-slate-400 font-bold w-24 flex-shrink-0 text-sm ${item.status === 'completed' ? 'line-through opacity-50' : ''}`}>
                  {item.time}
                </div>
                <div className="flex-1">
                  <h4 className={`text-lg font-bold text-slate-800 transition-all ${item.status === 'completed' ? 'line-through text-slate-400' : ''}`}>
                    {item.event}
                  </h4>
                  <p className={`text-slate-500 transition-all ${item.status === 'completed' ? 'text-slate-300' : ''}`}>
                    {item.detail}
                  </p>
                </div>
                <div>
                  <button
                    onClick={() => handleToggleStatus(i)}
                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-all transform active:scale-95 shadow-sm flex items-center gap-2 ${
                      item.status === 'completed' 
                        ? 'bg-green-100 text-green-700 hover:bg-green-200 border border-green-200' 
                        : item.status === 'upcoming' 
                        ? 'bg-blue-100 text-blue-700 hover:bg-blue-200 border border-blue-200' 
                        : 'bg-slate-100 text-slate-500 hover:bg-slate-200 border border-slate-200'
                    }`}
                    aria-label={`Change status for ${item.event}`}
                  >
                    {item.status === 'completed' && <span>✓</span>}
                    {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Health Tips & News */}
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-slate-800">Health Tips</h3>
          <div className="space-y-4">
            {healthTips.map((tip, i) => (
              <div key={i} className="bg-gradient-to-br from-blue-500 to-indigo-600 p-6 rounded-2xl text-white shadow-lg transform hover:-translate-y-1 transition-transform">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">{tip.icon}</span>
                  <h4 className="text-lg font-bold">{tip.title}</h4>
                </div>
                <p className="text-blue-50 text-base">{tip.text}</p>
              </div>
            ))}
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm border-t-4 border-t-blue-500">
            <h4 className="text-lg font-bold text-slate-800 mb-4">SilverCare Community</h4>
            <p className="text-slate-600 mb-4">Join over 5,000 members for our global weekly yoga session this Sunday!</p>
            <button className="w-full bg-slate-800 text-white font-bold py-4 rounded-xl hover:bg-slate-900 transition-all active:scale-[0.98] shadow-lg shadow-slate-200">
              Join Event
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
