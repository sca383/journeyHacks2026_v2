
import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types';

type SettingsTab = 'profile' | 'plan' | 'appointments';

interface Appointment {
  id: string;
  doctor: string;
  specialty: string;
  date: string;
  time: string;
  type: 'In-person' | 'Virtual';
}

interface SettingsViewProps {
  userProfile: UserProfile;
  onProfileUpdate: (updated: Partial<UserProfile>) => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({ userProfile, onProfileUpdate }) => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const [isSaved, setIsSaved] = useState(false);
  const [activeModal, setActiveModal] = useState<'billing' | 'benefits' | 'reschedule' | 'cancelPlan' | 'cancelBooking' | null>(null);
  
  // Local state for the form
  const [formData, setFormData] = useState({
    name: userProfile.name,
    email: userProfile.email,
    phone: userProfile.phone,
    address: userProfile.address
  });

  // Appointment states
  const [appointments, setAppointments] = useState<Appointment[]>([
    { id: '1', doctor: 'Dr. Sarah Wilson', specialty: 'Geriatric Specialist', date: 'Oct 24, 2023', time: '04:00 PM', type: 'Virtual' },
    { id: '2', doctor: 'Dr. Maria Garcia', specialty: 'Physiotherapist', date: 'Nov 02, 2023', time: '10:00 AM', type: 'In-person' }
  ]);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  useEffect(() => {
    setFormData({
      name: userProfile.name,
      email: userProfile.email,
      phone: userProfile.phone,
      address: userProfile.address
    });
  }, [userProfile]);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onProfileUpdate(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const openCancelModal = (app: Appointment) => {
    setSelectedAppointment(app);
    setActiveModal('cancelBooking');
  };

  const confirmCancelBooking = () => {
    if (selectedAppointment) {
      setAppointments(appointments.filter(app => app.id !== selectedAppointment.id));
      setActiveModal(null);
      setSelectedAppointment(null);
    }
  };

  const handleReschedule = (newTime: string) => {
    if (selectedAppointment) {
      setAppointments(prev => prev.map(app => 
        app.id === selectedAppointment.id ? { ...app, time: newTime, date: 'Oct 30, 2023' } : app
      ));
      setActiveModal(null);
      setSelectedAppointment(null);
    }
  };

  const handleConfirmCancelMembership = () => {
    onProfileUpdate({ membershipStatus: 'Free Member' });
    setActiveModal(null);
  };

  const tabs = [
    { id: 'profile', label: 'My Profile', icon: '👤' },
    { id: 'plan', label: 'SilverCare Plan', icon: '🛡️' },
    { id: 'appointments', label: 'My Bookings', icon: '📅' }
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Tabs */}
      <div className="flex bg-white p-2 rounded-2xl border border-slate-200 shadow-sm">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as SettingsTab)}
            className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-xl font-bold transition-all ${
              activeTab === tab.id 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' 
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <span className="text-xl">{tab.icon}</span>
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Profile Content */}
      {activeTab === 'profile' && (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden animate-in slide-in-from-bottom-4">
          <div className="p-8 border-b border-slate-50 flex items-center gap-6">
            <div className="relative">
              <img src={userProfile.imageUrl} className="w-24 h-24 rounded-full border-4 border-white shadow-md object-cover" alt="Profile" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-800">Personal Details</h3>
              <p className="text-slate-500 text-lg">Update your information for health records.</p>
            </div>
          </div>
          
          <form onSubmit={handleSaveProfile} className="p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-lg font-bold text-slate-700 ml-1">Full Name</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 outline-none text-lg transition-all" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-lg font-bold text-slate-700 ml-1">Phone Number</label>
                <input 
                  type="tel" 
                  value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 outline-none text-lg transition-all" 
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-lg font-bold text-slate-700 ml-1">Email Address</label>
                <input 
                  type="email" 
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 outline-none text-lg transition-all" 
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-lg font-bold text-slate-700 ml-1">Home Address</label>
                <textarea 
                  rows={2}
                  value={formData.address}
                  onChange={e => setFormData({...formData, address: e.target.value})}
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 outline-none text-lg transition-all"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-4 pt-4">
              <button 
                type="submit"
                className="bg-blue-600 text-white font-bold px-10 py-4 rounded-2xl text-xl shadow-lg hover:bg-blue-700 transition-all active:scale-95"
              >
                Save Changes
              </button>
              {isSaved && (
                <span className="text-green-600 font-bold flex items-center gap-2 animate-in fade-in slide-in-from-left-2">
                  <span className="text-2xl">✓</span> Profile updated!
                </span>
              )}
            </div>
          </form>
        </div>
      )}

      {/* Plan Content */}
      {activeTab === 'plan' && (
        <div className="space-y-6 animate-in slide-in-from-bottom-4">
          <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-3xl p-10 text-white shadow-2xl relative overflow-hidden">
            <div className="relative z-10 space-y-6">
              <div className="inline-block bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-sm font-bold tracking-widest uppercase">
                {userProfile.membershipStatus === 'Premium Member' ? 'Premium Active' : 'Free Tier'}
              </div>
              <h3 className="text-4xl font-black">{userProfile.membershipStatus}</h3>
              <p className="text-blue-100 text-xl max-w-lg">
                {userProfile.membershipStatus === 'Premium Member' 
                  ? 'Enjoy full 24/7 access to our medical staff and AI assistant.'
                  : 'Upgrade to Premium for 24/7 medical access and more.'}
              </p>
              <div className="flex gap-4 pt-4">
                <button 
                  onClick={() => setActiveModal('billing')}
                  className="bg-white text-blue-700 font-bold px-8 py-3.5 rounded-xl hover:bg-blue-50 transition-all active:scale-95"
                >
                  Manage Billing
                </button>
                <button 
                  onClick={() => setActiveModal('benefits')}
                  className="bg-white/10 backdrop-blur-md text-white font-bold px-8 py-3.5 rounded-xl hover:bg-white/20 transition-all active:scale-95"
                >
                  View Benefits
                </button>
              </div>
            </div>
          </div>

          {userProfile.membershipStatus === 'Premium Member' && (
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between">
              <div>
                <h4 className="text-xl font-bold text-slate-800 mb-2">Next Billing Date</h4>
                <p className="text-3xl font-bold text-blue-600">November 15, 2023</p>
                <p className="text-slate-500 mt-2">Annual Membership ($240/year)</p>
              </div>
              <button 
                onClick={() => setActiveModal('cancelPlan')}
                className="text-red-500 font-bold hover:underline mt-6 text-left active:scale-95 transition-transform"
              >
                Cancel Membership
              </button>
            </div>
          )}
        </div>
      )}

      {/* Appointments Content */}
      {activeTab === 'appointments' && (
        <div className="space-y-6 animate-in slide-in-from-bottom-4">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-bold text-slate-800">Scheduled Visits</h3>
          </div>
          
          <div className="space-y-4">
            {appointments.length > 0 ? appointments.map(app => (
              <div key={app.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-md flex flex-col md:flex-row md:items-center gap-6 hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center text-3xl shrink-0">
                  {app.type === 'Virtual' ? '💻' : '🏥'}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-xl font-bold text-slate-800">{app.doctor}</h4>
                    <span className="bg-slate-100 text-slate-500 text-xs px-2 py-0.5 rounded-full font-bold uppercase">{app.type}</span>
                  </div>
                  <p className="text-blue-600 font-bold text-sm mb-2">{app.specialty}</p>
                  <div className="flex flex-wrap gap-x-6 gap-y-2 text-slate-500">
                    <span className="flex items-center gap-2 font-medium">📅 {app.date}</span>
                    <span className="flex items-center gap-2 font-medium">⏰ {app.time}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => { setSelectedAppointment(app); setActiveModal('reschedule'); }}
                    className="flex-1 md:flex-none px-6 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-all active:scale-95"
                  >
                    Reschedule
                  </button>
                  <button 
                    onClick={() => openCancelModal(app)}
                    className="flex-1 md:flex-none px-6 py-3 bg-red-50 text-red-600 font-bold rounded-xl hover:bg-red-100 transition-all active:scale-95"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )) : (
              <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
                <p className="text-slate-400 text-xl font-bold">No upcoming appointments found.</p>
                <p className="text-slate-400 mt-2">Book a specialist to see it here.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modals */}
      {activeModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-[40px] w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <h4 className="text-2xl font-bold text-slate-800">
                  {activeModal === 'billing' && 'Billing Portal'}
                  {activeModal === 'benefits' && 'Your Benefits'}
                  {activeModal === 'reschedule' && 'Reschedule Visit'}
                  {activeModal === 'cancelPlan' && 'Cancel Membership?'}
                  {activeModal === 'cancelBooking' && 'Cancel Appointment?'}
                </h4>
                <button onClick={() => setActiveModal(null)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>

              {activeModal === 'billing' && (
                <div className="space-y-6">
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                    <p className="text-slate-500 font-bold text-sm uppercase mb-3">Saved Payment Method</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-8 bg-blue-600 rounded flex items-center justify-center text-white text-[10px] font-bold">VISA</div>
                        <span className="font-bold text-slate-700">•••• 4242</span>
                      </div>
                      <button className="text-blue-600 font-bold hover:underline">Edit</button>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <p className="text-slate-500 font-bold text-sm uppercase">Recent History</p>
                    <div className="flex justify-between items-center py-2 border-b border-slate-50">
                      <span className="text-slate-700 font-medium">Oct 15, 2023 - Annual Renewal</span>
                      <span className="font-bold text-slate-800">$240.00</span>
                    </div>
                  </div>
                </div>
              )}

              {activeModal === 'benefits' && (
                <div className="space-y-4">
                  {[
                    { label: 'AI Health Chat', desc: 'Unlimited medical advice from SilverCare AI', icon: '🤖' },
                    { label: 'Priority Booking', desc: 'Jump to the front of the line for specialists', icon: '⚡' },
                    { label: 'Direct Nurse Line', desc: 'Call a registered nurse 24/7 for urgent help', icon: '📞' },
                    { label: 'Family Sharing', desc: 'Add up to 2 family members to your plan', icon: '👨‍👩‍👧' }
                  ].map(b => (
                    <div key={b.label} className="flex items-start gap-4 p-4 hover:bg-slate-50 rounded-2xl transition-colors">
                      <span className="text-3xl">{b.icon}</span>
                      <div>
                        <p className="font-bold text-slate-800">{b.label}</p>
                        <p className="text-slate-500">{b.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeModal === 'reschedule' && (
                <div className="space-y-6">
                  <p className="text-slate-600 text-lg">Select a new time slot for your appointment with <strong>{selectedAppointment?.doctor}</strong>.</p>
                  <div className="grid grid-cols-2 gap-4">
                    {['08:30 AM', '10:00 AM', '01:30 PM', '03:00 PM'].map(time => (
                      <button 
                        key={time}
                        onClick={() => handleReschedule(time)}
                        className="py-5 border-2 border-slate-100 hover:border-blue-600 hover:bg-blue-50 rounded-2xl font-bold text-slate-700 transition-all text-lg"
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {activeModal === 'cancelPlan' && (
                <div className="space-y-8 text-center">
                  <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-4xl mx-auto">⚠️</div>
                  <div className="space-y-2">
                    <p className="text-xl font-bold text-slate-800">Are you sure you want to leave?</p>
                    <p className="text-slate-500 px-4">You will lose 24/7 access to specialists and your priority booking status.</p>
                  </div>
                  <div className="flex flex-col gap-3">
                    <button 
                      onClick={handleConfirmCancelMembership}
                      className="w-full bg-red-600 text-white font-bold py-4 rounded-2xl text-lg hover:bg-red-700 transition-all"
                    >
                      Yes, Cancel Membership
                    </button>
                    <button 
                      onClick={() => setActiveModal(null)}
                      className="w-full bg-slate-100 text-slate-600 font-bold py-4 rounded-2xl text-lg hover:bg-slate-200 transition-all"
                    >
                      Wait, Keep Premium
                    </button>
                  </div>
                </div>
              )}

              {activeModal === 'cancelBooking' && (
                <div className="space-y-8 text-center">
                  <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-4xl mx-auto">📅</div>
                  <div className="space-y-2">
                    <p className="text-xl font-bold text-slate-800">Cancel Appointment?</p>
                    <p className="text-slate-500 px-4">You are cancelling your visit with <strong>{selectedAppointment?.doctor}</strong> on {selectedAppointment?.date}.</p>
                  </div>
                  <div className="flex flex-col gap-3">
                    <button 
                      onClick={confirmCancelBooking}
                      className="w-full bg-red-600 text-white font-bold py-4 rounded-2xl text-lg hover:bg-red-700 transition-all"
                    >
                      Confirm Cancellation
                    </button>
                    <button 
                      onClick={() => setActiveModal(null)}
                      className="w-full bg-slate-100 text-slate-600 font-bold py-4 rounded-2xl text-lg hover:bg-slate-200 transition-all"
                    >
                      No, Keep Appointment
                    </button>
                  </div>
                </div>
              )}
            </div>
            {activeModal !== 'cancelPlan' && activeModal !== 'cancelBooking' && (
              <div className="p-8 bg-slate-50 flex justify-end">
                <button 
                  onClick={() => setActiveModal(null)}
                  className="bg-slate-800 text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-900 transition-all active:scale-95"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsView;
