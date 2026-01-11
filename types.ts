
export enum AppView {
  DASHBOARD = 'dashboard',
  PROFESSIONALS = 'professionals',
  PRESCRIPTIONS = 'prescriptions',
  SETTINGS = 'settings'
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  address: string;
  imageUrl: string;
  membershipStatus: string;
}

export interface Professional {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  experience: string;
  location: string;
  imageUrl: string;
  available: boolean;
  languages: string[];
  description: string;
  email: string;
  phone: string;
  about: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface Prescription {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  lastTaken: string;
  reminderTime: string;
  doctorName?: string;
  instructions?: string;
  source: 'scanned' | 'professional';
  dateAdded: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'reminder' | 'alert' | 'update';
  isRead: boolean;
}
