
import React, { useState, useRef } from 'react';
import { Prescription } from '../types';
import { parsePrescriptionImage } from '../services/geminiService';

const PrescriptionsView: React.FC = () => {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([
    {
      id: 'p1',
      name: 'Lisinopril',
      dosage: '10mg',
      frequency: 'Once daily',
      lastTaken: 'Today, 08:00 AM',
      reminderTime: '08:00',
      doctorName: 'Dr. Sarah Wilson',
      source: 'professional',
      dateAdded: '2023-10-15',
      instructions: 'Take in the morning with food.'
    },
    {
      id: 'p2',
      name: 'Metformin',
      dosage: '500mg',
      frequency: 'Twice daily',
      lastTaken: 'Yesterday, 07:00 PM',
      reminderTime: '07:00',
      doctorName: 'Dr. Rajesh Kumar',
      source: 'professional',
      dateAdded: '2023-10-10',
      instructions: 'Take with meals.'
    }
  ]);

  const [isScanning, setIsScanning] = useState(false);
  const [isAddingManual, setIsAddingManual] = useState(false);
  const [scanStatus, setScanStatus] = useState<'idle' | 'capturing' | 'analyzing' | 'success' | 'error'>('idle');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [manualForm, setManualForm] = useState({
    name: '',
    dosage: '',
    frequency: 'Once daily',
    reminderTime: '08:00',
    instructions: ''
  });

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const startCamera = async () => {
    setIsScanning(true);
    setScanStatus('capturing');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setScanStatus('error');
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
    setIsScanning(false);
    setScanStatus('idle');
  };

  const capturePhoto = async () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      const dataUrl = canvas.toDataURL('image/jpeg');
      setCapturedImage(dataUrl);
      setScanStatus('analyzing');
      stopCamera();
      setIsScanning(true);

      try {
        const result = await parsePrescriptionImage(dataUrl);
        const newPrescription: Prescription = {
          id: Math.random().toString(36).substr(2, 9),
          name: result.name || 'Unknown Medication',
          dosage: result.dosage || 'Not specified',
          frequency: result.frequency || 'Not specified',
          reminderTime: result.reminderTime || '09:00',
          lastTaken: 'Never',
          source: 'scanned',
          dateAdded: new Date().toISOString().split('T')[0],
          instructions: result.instructions || ''
        };
        setPrescriptions(prev => [newPrescription, ...prev]);
        setScanStatus('success');
        setTimeout(() => {
          setIsScanning(false);
          setScanStatus('idle');
          setCapturedImage(null);
        }, 2000);
      } catch (err) {
        setScanStatus('error');
      }
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualForm.name || !manualForm.dosage) return;

    const newPrescription: Prescription = {
      id: Math.random().toString(36).substr(2, 9),
      name: manualForm.name,
      dosage: manualForm.dosage,
      frequency: manualForm.frequency,
      reminderTime: manualForm.reminderTime,
      lastTaken: 'Never',
      source: 'scanned', // Treat manual entry similarly for filtering
      dateAdded: new Date().toISOString().split('T')[0],
      instructions: manualForm.instructions
    };

    setPrescriptions(prev => [newPrescription, ...prev]);
    setIsAddingManual(false);
    setManualForm({
      name: '',
      dosage: '',
      frequency: 'Once daily',
      reminderTime: '08:00',
      instructions: ''
    });
  };

  const handleLogTaken = (id: string) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const dateStr = "Today"; // Simplified for elder readability
    const fullStr = `${dateStr}, ${timeStr}`;

    setPrescriptions(prev => prev.map(p => 
      p.id === id ? { ...p, lastTaken: fullStr } : p
    ));
  };

  const deletePrescription = (id: string) => {
    setPrescriptions(prev => prev.filter(p => p.id !== id));
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">My Prescriptions</h2>
          <p className="text-slate-500 mt-1">Manage your medications and scan new prescriptions easily.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                const reader = new FileReader();
                reader.onloadend = async () => {
                  const base64 = reader.result as string;
                  setCapturedImage(base64);
                  setIsScanning(true);
                  setScanStatus('analyzing');
                  try {
                    const result = await parsePrescriptionImage(base64);
                    const newPrescription: Prescription = {
                      id: Math.random().toString(36).substr(2, 9),
                      name: result.name || 'Unknown Medication',
                      dosage: result.dosage || 'Not specified',
                      frequency: result.frequency || 'Not specified',
                      reminderTime: result.reminderTime || '09:00',
                      lastTaken: 'Never',
                      source: 'scanned',
                      dateAdded: new Date().toISOString().split('T')[0],
                      instructions: result.instructions || ''
                    };
                    setPrescriptions(prev => [newPrescription, ...prev]);
                    setScanStatus('success');
                    setTimeout(() => {
                      setIsScanning(false);
                      setScanStatus('idle');
                      setCapturedImage(null);
                    }, 2000);
                  } catch (err) {
                    setScanStatus('error');
                  }
                };
                reader.readAsDataURL(file);
              }
            }} 
            accept="image/*" 
            className="hidden" 
          />
          <button 
            onClick={() => setIsAddingManual(true)}
            className="px-6 py-4 bg-slate-50 text-slate-700 font-bold rounded-2xl hover:bg-slate-100 transition-all border border-slate-200 flex items-center gap-2"
          >
            <span className="font-mono text-blue-600 font-bold">[+]</span> Add Manually
          </button>
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="px-6 py-4 bg-slate-100 text-slate-700 font-bold rounded-2xl hover:bg-slate-200 transition-all flex items-center gap-2"
          >
            <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            Upload Photo
          </button>
          <button 
            onClick={startCamera}
            className="px-8 py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 flex items-center gap-2 active:scale-95"
          >
            <svg className="w-5 h-5 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Scan Prescription
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {prescriptions.length > 0 ? prescriptions.map(p => (
          <div key={p.id} className="bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col">
            <div className="p-6 space-y-4 flex-1">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-2xl">
                    💊
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-800">{p.name}</h3>
                    <p className="text-blue-600 font-bold text-sm">{p.dosage}</p>
                  </div>
                </div>
                <button 
                  onClick={() => deletePrescription(p.id)}
                  className="text-slate-300 hover:text-red-500 transition-colors p-1"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 py-4 border-y border-slate-50">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Frequency</p>
                  <p className="text-slate-700 font-semibold">{p.frequency}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Reminder</p>
                  <p className="text-slate-700 font-semibold">{p.reminderTime}</p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Last Taken</p>
                <p className="text-sm font-bold text-emerald-600">{p.lastTaken}</p>
              </div>

              <div className="space-y-2">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Instructions</p>
                <p className="text-sm text-slate-600 line-clamp-2">{p.instructions || 'No specific instructions.'}</p>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${p.source === 'professional' ? 'bg-indigo-500' : 'bg-emerald-500'}`}></span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">
                    {p.source === 'professional' ? `From ${p.doctorName}` : 'Self-Added'}
                  </span>
                </div>
                <span className="text-xs font-bold text-slate-500">{p.dateAdded}</span>
              </div>
            </div>
            <button 
              onClick={() => handleLogTaken(p.id)}
              className="w-full py-5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-black transition-all border-t border-blue-100 uppercase tracking-widest text-sm"
            >
              Log as Taken
            </button>
          </div>
        )) : (
          <div className="col-span-full py-20 text-center bg-white rounded-[40px] border-2 border-dashed border-slate-200">
            <p className="text-6xl mb-6 font-mono font-bold text-slate-300">(H)</p>
            <h3 className="text-2xl font-bold text-slate-800">Your medicine cabinet is empty</h3>
            <p className="text-slate-500 mt-2 max-w-sm mx-auto text-lg">Scan your physical prescription bottle or add a medication manually.</p>
          </div>
        )}
      </div>

      {/* Manual Entry Modal */}
      {isAddingManual && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-[40px] w-full max-w-lg overflow-hidden shadow-2xl relative animate-in zoom-in-95">
            <div className="p-8 space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold text-slate-800">Add Medication</h3>
                <button onClick={() => setIsAddingManual(false)} className="text-slate-400 hover:text-slate-600">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>

              <form onSubmit={handleManualSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-sm font-bold text-slate-700 ml-1">Medication Name</label>
                  <input 
                    required
                    type="text" 
                    value={manualForm.name}
                    onChange={e => setManualForm({...manualForm, name: e.target.value})}
                    placeholder="e.g. Aspirin"
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 outline-none text-lg"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-bold text-slate-700 ml-1">Dosage</label>
                  <input 
                    required
                    type="text" 
                    value={manualForm.dosage}
                    onChange={e => setManualForm({...manualForm, dosage: e.target.value})}
                    placeholder="e.g. 50mg"
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 outline-none text-lg"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-sm font-bold text-slate-700 ml-1">Frequency</label>
                    <select 
                      value={manualForm.frequency}
                      onChange={e => setManualForm({...manualForm, frequency: e.target.value})}
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 outline-none text-lg appearance-none"
                    >
                      <option>Once daily</option>
                      <option>Twice daily</option>
                      <option>Three times daily</option>
                      <option>As needed</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-bold text-slate-700 ml-1">Reminder Time</label>
                    <input 
                      type="time" 
                      value={manualForm.reminderTime}
                      onChange={e => setManualForm({...manualForm, reminderTime: e.target.value})}
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 outline-none text-lg"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-bold text-slate-700 ml-1">Special Instructions</label>
                  <textarea 
                    rows={2}
                    value={manualForm.instructions}
                    onChange={e => setManualForm({...manualForm, instructions: e.target.value})}
                    placeholder="e.g. Take with food"
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 outline-none text-lg resize-none"
                  />
                </div>
                <button 
                  type="submit"
                  className="w-full bg-blue-600 text-white font-bold py-5 rounded-2xl text-xl shadow-lg hover:bg-blue-700 transition-all active:scale-[0.98] mt-4"
                >
                  Save Medication
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Scanning Modal */}
      {isScanning && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[40px] w-full max-w-2xl overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-300">
            <button 
              onClick={() => { stopCamera(); setIsScanning(false); setScanStatus('idle'); }} 
              className="absolute top-8 right-8 z-10 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full transition-all"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="p-10 space-y-8">
              <div className="text-center">
                <h3 className="text-3xl font-black text-slate-800">
                  {scanStatus === 'capturing' && 'Scan Prescription'}
                  {scanStatus === 'analyzing' && 'Analyzing Medication...'}
                  {scanStatus === 'success' && 'Prescription Added!'}
                  {scanStatus === 'error' && 'Something went wrong'}
                </h3>
                <p className="text-slate-500 mt-2 text-lg">
                  {scanStatus === 'capturing' && 'Position the label within the frame.'}
                  {scanStatus === 'analyzing' && 'SilverCare AI is reading the label.'}
                  {scanStatus === 'success' && 'The medication details have been saved.'}
                  {scanStatus === 'error' && 'Could not read label. Please try again with better lighting.'}
                </p>
              </div>

              <div className="aspect-video bg-slate-900 rounded-3xl overflow-hidden relative shadow-inner">
                {scanStatus === 'capturing' && (
                  <>
                    <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                    <div className="absolute inset-0 border-[40px] border-black/40 pointer-events-none flex items-center justify-center">
                      <div className="w-full h-48 border-2 border-blue-500 border-dashed rounded-xl flex items-center justify-center">
                        <div className="w-full h-1 bg-blue-500/50 animate-[scan_2s_infinite]"></div>
                      </div>
                    </div>
                  </>
                )}
                {(scanStatus === 'analyzing' || scanStatus === 'success' || scanStatus === 'error') && capturedImage && (
                  <img src={capturedImage} alt="Captured" className="w-full h-full object-cover" />
                )}
                {scanStatus === 'analyzing' && (
                  <div className="absolute inset-0 bg-blue-600/20 backdrop-blur-[2px] flex items-center justify-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-white font-bold text-xl">SilverCare AI is thinking...</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-center">
                {scanStatus === 'capturing' && (
                  <button 
                    onClick={capturePhoto}
                    className="w-24 h-24 bg-white border-8 border-blue-600 rounded-full flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition-all"
                  >
                    <div className="w-12 h-12 bg-blue-600 rounded-full"></div>
                  </button>
                )}
                {scanStatus === 'error' && (
                  <button 
                    onClick={() => { setScanStatus('idle'); startCamera(); }}
                    className="px-10 py-4 bg-red-600 text-white font-bold rounded-2xl hover:bg-red-700 transition-all"
                  >
                    Try Again
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      <canvas ref={canvasRef} className="hidden" />
      
      <style>{`
        @keyframes scan {
          0% { transform: translateY(-100px); }
          50% { transform: translateY(100px); }
          100% { transform: translateY(-100px); }
        }
      `}</style>
    </div>
  );
};

export default PrescriptionsView;
