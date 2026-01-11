
import React, { useState } from 'react';
import { Professional } from '../types';

const ProfessionalsView: React.FC = () => {
  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProfessional, setSelectedProfessional] = useState<Professional | null>(null);
  const [isBooking, setIsBooking] = useState(false);
  const [bookingStep, setBookingStep] = useState<'selection' | 'success'>('selection');
  const [selectedTime, setSelectedTime] = useState<string>('');

  const professionals: Professional[] = [
    {
      id: '1',
      name: 'Dr. Sarah Wilson',
      specialty: 'Geriatric Specialist',
      rating: 4.9,
      experience: '15 years',
      location: 'London, UK (Global Remote)',
      imageUrl: 'https://picsum.photos/seed/doc1/400',
      available: true,
      languages: ['English', 'French'],
      description: 'Expert in managing chronic conditions and age-related health issues.',
      email: 's.wilson@silvercare.com',
      phone: '+44 20 7123 4567',
      about: 'Dr. Sarah Wilson is a board-certified Geriatric Specialist with over 15 years of experience in managing complex medical needs for older adults. She specializes in cognitive health, mobility issues, and preventive care for seniors.'
    },
    {
      id: '2',
      name: 'Dr. Rajesh Kumar',
      specialty: 'Cardiologist',
      rating: 4.8,
      experience: '20 years',
      location: 'Mumbai, India (Global Remote)',
      imageUrl: 'https://picsum.photos/seed/doc2/400',
      available: false,
      languages: ['English', 'Hindi'],
      description: 'Senior cardiologist specializing in heart health and cholesterol management.',
      email: 'r.kumar@silvercare.com',
      phone: '+91 22 9876 5432',
      about: 'Dr. Kumar has spent two decades researching and treating cardiac conditions in the elderly. He is known for his patient-first approach and clear explanations of complex heart health issues.'
    },
    {
      id: '3',
      name: 'Dr. Maria Garcia',
      specialty: 'Physiotherapist',
      rating: 4.9,
      experience: '12 years',
      location: 'Madrid, Spain (Global Remote)',
      imageUrl: 'https://picsum.photos/seed/doc3/400',
      available: true,
      languages: ['Spanish', 'English'],
      description: 'Dedicated to helping seniors maintain mobility and strength through gentle exercise.',
      email: 'm.garcia@silvercare.com',
      phone: '+34 91 123 45 67',
      about: 'Specializing in geriatric rehabilitation, Dr. Garcia helps patients recover from surgeries and manage arthritis through tailored physical therapy programs.'
    },
    {
      id: '4',
      name: 'Nurse Emily Chen',
      specialty: 'Home Care Nurse',
      rating: 4.7,
      experience: '8 years',
      location: 'Toronto, Canada',
      imageUrl: 'https://picsum.photos/seed/doc4/400',
      available: true,
      languages: ['English', 'Mandarin'],
      description: 'Specialist in medication management and daily care for elderly patients.',
      email: 'e.chen@silvercare.com',
      phone: '+1 416 555 0199',
      about: 'Nurse Emily provides compassionate home-based care and assists with daily health monitoring, medication schedules, and post-hospitalization recovery.'
    }
  ];

  const categories = ['All', 'Geriatric', 'Cardiology', 'Physical Therapy', 'Nursing'];

  const filteredDocs = professionals.filter(p => {
    const matchesCategory = filter === 'All' || p.specialty.toLowerCase().includes(filter.toLowerCase().split(' ')[0]);
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleBookVisit = (doc?: Professional) => {
    if (doc) setSelectedProfessional(doc);
    setIsBooking(true);
    setBookingStep('selection');
    setSelectedTime('');
  };

  const confirmBooking = (time: string) => {
    setSelectedTime(time);
    setBookingStep('success');
  };

  // Profile Detail View
  if (selectedProfessional && !isBooking) {
    return (
      <div className="p-6 max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
        <button 
          onClick={() => setSelectedProfessional(null)}
          className="flex items-center gap-2 text-blue-600 font-bold text-lg hover:bg-blue-50 px-4 py-2 rounded-xl transition-colors"
        >
          ← Back to all experts
        </button>

        <div className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/3 h-80 md:h-auto">
              <img 
                src={selectedProfessional.imageUrl} 
                alt={selectedProfessional.name} 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="md:w-2/3 p-8 md:p-12 space-y-6 flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-2">{selectedProfessional.name}</h2>
                  <p className="text-xl text-blue-600 font-semibold">{selectedProfessional.specialty}</p>
                </div>
                <div className="flex items-center gap-2 bg-yellow-50 px-4 py-2 rounded-2xl border border-yellow-100">
                  <svg className="w-5 h-5 text-yellow-500 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="text-xl font-bold text-slate-800">{selectedProfessional.rating}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <p className="text-slate-500 text-sm font-medium uppercase tracking-wider">Experience</p>
                  <p className="text-lg font-bold text-slate-800">{selectedProfessional.experience}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <p className="text-slate-500 text-sm font-medium uppercase tracking-wider">Location</p>
                  <p className="text-lg font-bold text-slate-800">{selectedProfessional.location.split('(')[0]}</p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-slate-800 border-l-4 border-blue-600 pl-4">About the Expert</h3>
                <p className="text-lg text-slate-600 leading-relaxed">
                  {selectedProfessional.about}
                </p>
              </div>

              <div className="space-y-4 pt-4">
                <h3 className="text-2xl font-bold text-slate-800">Contact Methods</h3>
                <div className="flex flex-wrap gap-4">
                  <a href={`tel:${selectedProfessional.phone}`} className="flex items-center gap-3 bg-slate-100 hover:bg-slate-200 px-6 py-4 rounded-2xl transition-all font-bold text-slate-700 active:scale-95 border border-slate-200">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    Call Now
                  </a>
                  <a href={`mailto:${selectedProfessional.email}`} className="flex items-center gap-3 bg-slate-100 hover:bg-slate-200 px-6 py-4 rounded-2xl transition-all font-bold text-slate-700 active:scale-95 border border-slate-200">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Send Email
                  </a>
                </div>
              </div>

              <div className="pt-8 border-t border-slate-100">
                <button 
                  onClick={() => handleBookVisit()}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-5 rounded-2xl text-xl shadow-lg shadow-blue-100 transition-all active:scale-[0.98]"
                  disabled={!selectedProfessional.available}
                >
                  {selectedProfessional.available ? 'Book a Consultation' : 'Fully Booked'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Booking Modal
  const BookingModal = () => (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-md p-8 relative animate-in zoom-in-95 duration-200">
        <button onClick={() => { setIsBooking(false); setSelectedProfessional(null); }} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        {bookingStep === 'selection' ? (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-slate-800">Book with {selectedProfessional?.name}</h3>
              <p className="text-slate-500">Choose a convenient time for your consultation.</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {['09:00 AM', '11:30 AM', '02:00 PM', '04:30 PM'].map(time => (
                <button 
                  key={time} 
                  onClick={() => confirmBooking(time)}
                  className="py-4 border-2 border-slate-100 hover:border-blue-500 hover:bg-blue-50 rounded-2xl font-bold text-slate-700 transition-all"
                >
                  {time}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center space-y-4 py-6">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center font-mono font-bold text-3xl mx-auto mb-4">
              [V]
            </div>
            <h3 className="text-2xl font-bold text-slate-800">Booking Confirmed!</h3>
            <p className="text-slate-600">Your appointment with {selectedProfessional?.name} at {selectedTime} is confirmed. A link has been sent to your email.</p>
            <button 
              onClick={() => { setIsBooking(false); setSelectedProfessional(null); }}
              className="w-full bg-slate-800 text-white font-bold py-4 rounded-2xl mt-4 shadow-lg active:scale-95"
            >
              Back to Experts
            </button>
          </div>
        )}
      </div>
    </div>
  );

  // Main List View
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h2 className="text-4xl font-bold text-slate-800">Healthcare Experts</h2>
            <p className="text-slate-600 text-lg mt-1">Connecting you with the world's best geriatric care professionals.</p>
          </div>
          
          <div className="w-full md:w-96 relative">
            <input 
              type="text" 
              placeholder="Search by name or specialty..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-6 py-4 bg-white border border-slate-200 rounded-2xl shadow-sm focus:ring-4 focus:ring-blue-100 outline-none text-lg pl-14"
            />
            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-xl font-mono text-slate-400 font-bold">(o)</span>
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            )}
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-6 py-3 rounded-xl text-sm font-bold transition-all ${
                filter === cat ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filteredDocs.length > 0 ? filteredDocs.map(doc => (
          <div 
            key={doc.id} 
            className="bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all overflow-hidden group flex flex-col"
          >
            <div 
              className="h-64 overflow-hidden relative cursor-pointer"
              onClick={() => setSelectedProfessional(doc)}
            >
              <img src={doc.imageUrl} alt={doc.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-xl font-bold text-slate-800 text-sm flex items-center gap-1 shadow-sm">
                <svg className="w-4 h-4 text-yellow-500 fill-current" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                {doc.rating}
              </div>
              {!doc.available && (
                <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] flex items-center justify-center">
                  <span className="bg-white/90 px-4 py-2 rounded-lg font-bold text-slate-800">Fully Booked</span>
                </div>
              )}
            </div>
            <div className="p-6 space-y-4 flex-1 flex flex-col">
              <div className="cursor-pointer" onClick={() => setSelectedProfessional(doc)}>
                <p className="text-blue-600 font-bold text-xs uppercase tracking-widest mb-1">{doc.specialty}</p>
                <h4 className="text-xl font-bold text-slate-800 leading-tight group-hover:text-blue-600 transition-colors">{doc.name}</h4>
                <p className="text-slate-500 text-sm line-clamp-2 mt-2">{doc.description}</p>
              </div>
              
              <div className="pt-2 flex items-center justify-between border-t border-slate-50 mt-auto">
                <span className="text-slate-400 text-xs font-bold uppercase tracking-tighter">{doc.experience} Exp.</span>
                <button 
                  onClick={() => setSelectedProfessional(doc)}
                  className="text-blue-600 font-bold text-sm hover:underline"
                >
                  View Profile
                </button>
              </div>

              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleBookVisit(doc);
                }}
                disabled={!doc.available}
                className={`w-full py-4 rounded-xl font-black text-sm uppercase tracking-widest transition-all shadow-sm active:scale-[0.98] ${
                  doc.available 
                  ? 'bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white' 
                  : 'bg-slate-50 text-slate-400 cursor-not-allowed'
                }`}
              >
                {doc.available ? 'Book Now' : 'Fully Booked'}
              </button>
            </div>
          </div>
        )) : (
          <div className="col-span-full py-32 text-center bg-white rounded-[40px] border-2 border-dashed border-slate-200">
            <p className="text-6xl mb-6 font-mono font-bold text-slate-300">(o_o)</p>
            <h3 className="text-2xl font-bold text-slate-800">No experts found</h3>
            <p className="text-slate-500 mt-2 text-lg">Try adjusting your search or category filters.</p>
            <button 
              onClick={() => { setSearchTerm(''); setFilter('All'); }}
              className="mt-6 text-blue-600 font-bold hover:underline"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>

      {isBooking && <BookingModal />}
    </div>
  );
};

export default ProfessionalsView;
