export interface Department {
  id: string;
  name: string;
  iconName: string; // Used to map to Lucide icons dynamically
  shortDescription: string;
  fullDescription: string;
  services: string[];
  conditionsTreated: string[];
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  departmentId: string;
  image: string;
  rating: number;
  reviewsCount: number;
  education: string;
  experienceYears: number;
  languages: string[];
  bio: string;
  availability: string[]; // e.g., ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
  timeSlots: string[]; // e.g., ["09:00 AM", "10:00 AM", ...]
  gender: 'Male' | 'Female';
}

export interface Booking {
  id: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  patientAge: string;
  patientGender: string;
  departmentId: string;
  departmentName: string;
  doctorId: string;
  doctorName: string;
  date: string; // YYYY-MM-DD
  timeSlot: string;
  reason: string;
  insuranceProvider?: string;
  status: 'Confirmed' | 'Cancelled';
  createdAt: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  rating: number;
  date: string;
}

export interface HospitalStat {
  id: string;
  label: string;
  value: string;
  iconName: string;
}
