import React, { useState, useEffect } from 'react';
import { useFirebase } from './FirebaseContext';
import { db } from '../lib/firebase';
import { collection, getDocs, doc, updateDoc, deleteDoc, setDoc } from 'firebase/firestore';
import { DEPARTMENTS, DOCTORS } from '../data';
import { Booking } from '../types';
import { 
  ShieldAlert, 
  Users, 
  Calendar, 
  Clock, 
  Activity, 
  Trash2, 
  Search, 
  Filter, 
  CheckCircle, 
  XCircle, 
  Plus, 
  Sparkles, 
  User, 
  Briefcase, 
  ChevronRight,
  RefreshCw,
  LogOut,
  UserCheck,
  AlertCircle,
  FileText,
  Lock,
  Mail,
  UserPlus
} from 'lucide-react';

interface AdminPortalProps {
  onRefreshTrigger: number;
  onBookingSuccess: () => void;
}

export default function AdminPortal({ onRefreshTrigger, onBookingSuccess }: AdminPortalProps) {
  const { user, signInWithEmail, signUpWithEmail, logOut } = useFirebase();

  // Authentication states
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);

  // Dashboard states
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Search & Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Confirmed' | 'Cancelled'>('All');
  const [departmentFilter, setDepartmentFilter] = useState<string>('All');

  // New Booking Form states (for Admin Booking Intake)
  const [showAddForm, setShowAddForm] = useState(false);
  const [patientName, setPatientName] = useState('');
  const [patientEmail, setPatientEmail] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [patientAge, setPatientAge] = useState('');
  const [patientGender, setPatientGender] = useState('Male');
  const [selectedDepId, setSelectedDepId] = useState('');
  const [selectedDocId, setSelectedDocId] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [reason, setReason] = useState('');
  const [insuranceProvider, setInsuranceProvider] = useState('None (Private self-pay)');
  const [formLoading, setFormLoading] = useState(false);

  const isAdminAuthenticated = user && user.email === 'wecareteam@gmail.com';

  // Fetch all bookings for Admin
  const fetchAllBookings = async () => {
    if (!isAdminAuthenticated) return;
    setLoading(true);
    setErrorMsg(null);
    try {
      const bookingsRef = collection(db, 'bookings');
      const querySnapshot = await getDocs(bookingsRef);
      const fetchedBookings: Booking[] = [];
      
      querySnapshot.forEach((docSnap) => {
        fetchedBookings.push(docSnap.data() as Booking);
      });

      // Sort by creation date or date descending
      fetchedBookings.sort((a, b) => {
        const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return timeB - timeA;
      });

      setBookings(fetchedBookings);
    } catch (err: any) {
      console.error("Admin fetch error:", err);
      const specificDetails = err.message ? `: ${err.message}` : '';
      setErrorMsg(`Failed to retrieve clinical appointments. Verify Firestore security rules (copy rules from firestore.rules into your Firebase Console)${specificDetails}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdminAuthenticated) {
      fetchAllBookings();
    }
  }, [user, onRefreshTrigger]);

  // Handle Admin Sign In
  const handleAdminSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthLoading(true);

    if (adminEmail !== 'wecareteam@gmail.com') {
      setAuthError('Unauthorized Account: Only WeCare administrators can sign in through this channel.');
      setAuthLoading(false);
      return;
    }

    try {
      await signInWithEmail(adminEmail, adminPassword);
    } catch (err: any) {
      // If it's the valid admin credentials and sign-in failed, try auto-registering the admin account!
      if (adminEmail === 'wecareteam@gmail.com' && adminPassword === '010101') {
        try {
          console.log("Admin account not found or invalid. Attempting auto-registration of admin...");
          await signUpWithEmail('wecareteam@gmail.com', '010101', 'WeCare Administrator');
          // Try to sign in again after auto-registering
          await signInWithEmail('wecareteam@gmail.com', '010101');
          return;
        } catch (signUpErr: any) {
          console.error("Auto-registration failed:", signUpErr);
        }
      }

      console.error("Admin Auth Error:", err);
      let errorText = err.message || 'Authentication failed.';
      if (errorText.includes('auth/invalid-credential')) {
        errorText = 'Invalid admin security credentials. Please double-check your password.';
      }
      setAuthError(errorText);
    } finally {
      setAuthLoading(false);
    }
  };

  // Helper to auto-fill the admin demo credentials for the user
  const handleQuickFill = () => {
    setAdminEmail('wecareteam@gmail.com');
    setAdminPassword('010101');
    setAuthError(null);
  };

  // Cancel Booking
  const handleCancelBooking = async (bookingId: string) => {
    const confirmCancel = window.confirm(`Are you sure you want to cancel appointment ${bookingId}?`);
    if (!confirmCancel) return;

    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      const bookingRef = doc(db, 'bookings', bookingId);
      await updateDoc(bookingRef, { status: 'Cancelled' });
      setSuccessMsg(`Successfully cancelled appointment ${bookingId}`);
      fetchAllBookings();
      onBookingSuccess();
    } catch (err) {
      console.error("Admin cancel error:", err);
      setErrorMsg(`Failed to cancel appointment ${bookingId}.`);
    }
  };

  // Restore Booking
  const handleRestoreBooking = async (bookingId: string) => {
    const confirmRestore = window.confirm(`Restore appointment ${bookingId} to Confirmed status?`);
    if (!confirmRestore) return;

    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      const bookingRef = doc(db, 'bookings', bookingId);
      await updateDoc(bookingRef, { status: 'Confirmed' });
      setSuccessMsg(`Successfully restored appointment ${bookingId}`);
      fetchAllBookings();
      onBookingSuccess();
    } catch (err) {
      console.error("Admin restore error:", err);
      setErrorMsg(`Failed to restore appointment ${bookingId}.`);
    }
  };

  // Delete Booking Completely
  const handleDeleteBooking = async (bookingId: string) => {
    const confirmDelete = window.confirm(`WARNING: Permanently delete appointment record ${bookingId}? This action cannot be undone.`);
    if (!confirmDelete) return;

    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      const bookingRef = doc(db, 'bookings', bookingId);
      await deleteDoc(bookingRef);
      setSuccessMsg(`Successfully purged appointment ${bookingId} from clinical database`);
      fetchAllBookings();
      onBookingSuccess();
    } catch (err) {
      console.error("Admin delete error:", err);
      setErrorMsg(`Failed to delete record ${bookingId}.`);
    }
  };

  // Filter Doctors on Department Selection
  const activeDoctors = DOCTORS.filter(doc => doc.departmentId === selectedDepId);

  // Handle Admin Intake Form Submission
  const handleAdminIntakeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName || !patientEmail || !patientPhone || !patientAge || !selectedDepId || !selectedDocId || !selectedDate || !selectedTimeSlot || !reason) {
      alert("Please fill in all clinical intake requirements.");
      return;
    }

    setFormLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    const bookingId = `WCH-${Math.floor(100000 + Math.random() * 900000)}`;
    const departmentName = DEPARTMENTS.find(d => d.id === selectedDepId)?.name || '';
    const doctorName = DOCTORS.find(doc => doc.id === selectedDocId)?.name || '';

    const newBooking: Booking & { userId: string } = {
      id: bookingId,
      userId: 'ADMIN_INTAKE_PORTAL', // Admin created booking
      patientName,
      patientEmail,
      patientPhone,
      patientAge,
      patientGender,
      departmentId: selectedDepId,
      departmentName,
      doctorId: selectedDocId,
      doctorName,
      date: selectedDate,
      timeSlot: selectedTimeSlot,
      reason,
      status: 'Confirmed',
      createdAt: new Date().toISOString()
    };

    if (insuranceProvider && insuranceProvider !== 'None (Private self-pay)') {
      newBooking.insuranceProvider = insuranceProvider;
    }

    try {
      await setDoc(doc(db, 'bookings', bookingId), newBooking);
      setSuccessMsg(`Intake Registered: Secure appointment ${bookingId} created successfully for ${patientName}!`);
      
      // Reset intake form fields
      setPatientName('');
      setPatientEmail('');
      setPatientPhone('');
      setPatientAge('');
      setPatientGender('Male');
      setSelectedDepId('');
      setSelectedDocId('');
      setSelectedDate('');
      setSelectedTimeSlot('');
      setReason('');
      setInsuranceProvider('None (Private self-pay)');
      setShowAddForm(false);
      
      // Refresh calculations
      fetchAllBookings();
      onBookingSuccess();
    } catch (err) {
      console.error("Admin intake insertion error:", err);
      setErrorMsg("Intake insertion failed. Check Firestore configuration.");
    } finally {
      setFormLoading(false);
    }
  };

  // Get active doctors time slots dynamically
  const selectedDoctorObj = DOCTORS.find(d => d.id === selectedDocId);
  const timeSlots = selectedDoctorObj ? selectedDoctorObj.timeSlots : [
    '09:00 AM', '10:00 AM', '11:00 AM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM'
  ];

  // Process and Filter Bookings for Display
  const filteredBookings = bookings.filter((b) => {
    // 1. Search filter
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = 
      b.patientName.toLowerCase().includes(searchLower) ||
      b.patientEmail.toLowerCase().includes(searchLower) ||
      b.id.toLowerCase().includes(searchLower);

    // 2. Status filter
    const matchesStatus = statusFilter === 'All' || b.status === statusFilter;

    // 3. Department filter
    const matchesDept = departmentFilter === 'All' || b.departmentId === departmentFilter;

    return matchesSearch && matchesStatus && matchesDept;
  });

  // Calculate statistics
  const statsTotal = bookings.length;
  const statsConfirmed = bookings.filter(b => b.status === 'Confirmed').length;
  const statsCancelled = bookings.filter(b => b.status === 'Cancelled').length;
  const statsUniquePatients = new Set(bookings.map(b => b.patientEmail.toLowerCase())).size;

  // Render Denied access if logged in as other patient
  if (user && user.email !== 'wecareteam@gmail.com') {
    return (
      <div className="bg-slate-50 py-20 px-4 min-h-screen flex items-center justify-center">
        <div className="max-w-md w-full bg-white border border-rose-100 rounded-3xl p-8 shadow-xl space-y-6 text-center">
          <div className="inline-flex p-3 bg-rose-50 text-rose-600 rounded-2xl">
            <ShieldAlert className="w-10 h-10 animate-pulse" />
          </div>
          <div className="space-y-2">
            <h2 className="font-display font-extrabold text-2xl text-slate-900">Access Restricted</h2>
            <p className="text-slate-500 text-sm leading-relaxed">
              You are currently authenticated under patient credentials (<span className="font-semibold text-slate-800">{user.email}</span>). 
              The WeCare Administration Panel is strictly reserved for clinical staff.
            </p>
          </div>
          <div className="pt-2">
            <button
              onClick={() => logOut()}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl transition-all text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              Sign Out Patient Account
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Render Administrative Login panel if not authenticated
  if (!user) {
    return (
      <div className="bg-slate-50 py-20 px-4 min-h-[85vh] flex items-center justify-center">
        <div className="max-w-md w-full bg-white border border-slate-100 rounded-3xl p-8 shadow-xl relative overflow-hidden">
          
          {/* Subtle branding glows */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-sky-500/5 rounded-full blur-2xl pointer-events-none"></div>

          <div className="relative space-y-6">
            
            {/* Header branding */}
            <div className="text-center space-y-2">
              <div className="inline-flex p-3 bg-blue-50 text-blue-600 rounded-2xl mb-1 border border-blue-100/50">
                <ShieldAlert className="w-8 h-8" />
              </div>
              <h2 className="font-display font-black text-2xl text-slate-950">WeCare Admin Portal</h2>
              <span className="inline-block px-3 py-1 bg-amber-50 border border-amber-100/50 text-amber-800 rounded-full font-mono text-[10px] font-bold tracking-widest uppercase">
                Staff Credentials Required
              </span>
              <p className="text-slate-500 text-xs sm:text-sm px-2">
                Log in to review general consultations, issue clinical cancellations, and perform administrative booking intakes.
              </p>
            </div>

            {/* Error banner */}
            {authError && (
              <div className="p-4 bg-rose-50 border border-rose-100 text-rose-800 rounded-2xl flex items-start gap-3 text-xs sm:text-sm animate-fadeIn">
                <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <p className="font-bold">Authentication Exception</p>
                  <p className="leading-normal">{authError}</p>
                </div>
              </div>
            )}

            {/* Demo Quick-Fill helper */}
            <div className="p-4 bg-blue-50 border border-blue-150 rounded-2xl text-xs space-y-2.5">
              <div className="flex items-center gap-1.5 font-bold text-blue-900">
                <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Sandbox Administration Access</span>
              </div>
              <p className="text-blue-800 leading-normal">
                To explore the administrative dashboard, click the button below to pre-populate authorized credentials securely.
              </p>
              <button
                type="button"
                onClick={handleQuickFill}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg transition-colors cursor-pointer text-[11px]"
              >
                Auto-fill Admin Credentials
              </button>
            </div>

            {/* Sign in form */}
            <form onSubmit={handleAdminSignIn} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Admin Email Address</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
                    <Mail className="w-4 h-4" />
                  </span>
                  <input
                    type="email"
                    required
                    placeholder="wecareteam@gmail.com"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-11 pr-4 text-sm text-slate-800 focus:outline-hidden focus:border-blue-500 focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Security Password</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
                    <Lock className="w-4 h-4" />
                  </span>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-11 pr-4 text-sm text-slate-800 focus:outline-hidden focus:border-blue-500 focus:bg-white transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={authLoading}
                className="w-full bg-slate-950 hover:bg-slate-900 disabled:bg-slate-400 text-white font-bold py-3.5 rounded-xl transition-all cursor-pointer text-sm shadow-md flex items-center justify-center"
              >
                {authLoading ? (
                  <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  'Authorize & Enter Dashboard'
                )}
              </button>
            </form>

          </div>
        </div>
      </div>
    );
  }

  // Render fully authorized Admin Portal interface
  return (
    <div id="admin-portal-dashboard" className="bg-slate-50 py-12 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Top Header Row */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white border border-slate-100 p-6 rounded-3xl shadow-sm gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[10px] font-mono font-extrabold tracking-widest text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full uppercase">
                Secure Live Dashboard
              </span>
            </div>
            <h1 className="font-display font-black text-2xl sm:text-3xl text-slate-900">Clinic Control Center</h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Logged in as hospital administrator: <span className="font-bold text-blue-600">{user.email}</span>
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm px-4.5 py-2.5 rounded-xl transition-all cursor-pointer shadow-md shadow-blue-500/10"
            >
              {showAddForm ? (
                <>
                  <ChevronRight className="w-4 h-4" />
                  View Appointments
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  Clinical Intake Form
                </>
              )}
            </button>
            <button
              onClick={() => logOut()}
              className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm px-4.5 py-2.5 rounded-xl transition-all cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>

        {/* Global Feedback Notifications */}
        {errorMsg && (
          <div className="p-4 bg-rose-50 border border-rose-100 text-rose-800 rounded-2xl flex items-start gap-3 text-xs sm:text-sm animate-fadeIn">
            <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
            <p className="font-semibold">{errorMsg}</p>
          </div>
        )}
        {successMsg && (
          <div className="p-4 bg-emerald-50 border border-emerald-100 text-emerald-800 rounded-2xl flex items-start gap-3 text-xs sm:text-sm animate-fadeIn">
            <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
            <p className="font-semibold">{successMsg}</p>
          </div>
        )}

        {/* Add Booking intake form container (if shown) */}
        {showAddForm ? (
          <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-md space-y-6 animate-fadeIn">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="font-display font-extrabold text-lg sm:text-xl text-slate-900 flex items-center gap-2.5">
                <UserPlus className="w-5 h-5 text-blue-600" />
                Administrative Patient Intake Form
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Enter medical booking parameters directly on behalf of a consulting patient.
              </p>
            </div>

            <form onSubmit={handleAdminIntakeSubmit} className="space-y-6">
              
              {/* Section: Patient Demographics */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">1. Patient Demographics</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700 uppercase">Patient Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Mary Jane Watson"
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3.5 text-xs text-slate-800 focus:outline-hidden focus:border-blue-500 focus:bg-white transition-all"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700 uppercase">Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. maryjane@example.com"
                      value={patientEmail}
                      onChange={(e) => setPatientEmail(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3.5 text-xs text-slate-800 focus:outline-hidden focus:border-blue-500 focus:bg-white transition-all"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700 uppercase">Contact Telephone</label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. +1 (555) 321-4567"
                      value={patientPhone}
                      onChange={(e) => setPatientPhone(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3.5 text-xs text-slate-800 focus:outline-hidden focus:border-blue-500 focus:bg-white transition-all"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700 uppercase">Patient Age</label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 29"
                      value={patientAge}
                      onChange={(e) => setPatientAge(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3.5 text-xs text-slate-800 focus:outline-hidden focus:border-blue-500 focus:bg-white transition-all"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700 uppercase">Patient Biological Gender</label>
                    <select
                      value={patientGender}
                      onChange={(e) => setPatientGender(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3.5 text-xs text-slate-800 focus:outline-hidden focus:border-blue-500 focus:bg-white transition-all"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                      <option value="Prefer not to say">Prefer not to say</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700 uppercase">Insurance Coverage</label>
                    <select
                      value={insuranceProvider}
                      onChange={(e) => setInsuranceProvider(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3.5 text-xs text-slate-800 focus:outline-hidden focus:border-blue-500 focus:bg-white transition-all"
                    >
                      <option value="None (Private self-pay)">None (Private self-pay)</option>
                      <option value="UnitedHealthcare">UnitedHealthcare</option>
                      <option value="Blue Cross Blue Shield">Blue Cross Blue Shield</option>
                      <option value="Aetna Private Insurance">Aetna Private Insurance</option>
                      <option value="Cigna Health Insurance">Cigna Health Insurance</option>
                      <option value="Humana Care Plan">Humana Care Plan</option>
                    </select>
                  </div>

                </div>
              </div>

              {/* Section: Specialty Allocation */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">2. Specialist & Date Allocation</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700 uppercase">Clinical Specialty Department</label>
                    <select
                      required
                      value={selectedDepId}
                      onChange={(e) => { setSelectedDepId(e.target.value); setSelectedDocId(''); }}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3.5 text-xs text-slate-800 focus:outline-hidden focus:border-blue-500 focus:bg-white transition-all"
                    >
                      <option value="">Select Department...</option>
                      {DEPARTMENTS.map(d => (
                        <option key={d.id} value={d.id}>{d.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700 uppercase">Consulting Specialist</label>
                    <select
                      required
                      disabled={!selectedDepId}
                      value={selectedDocId}
                      onChange={(e) => setSelectedDocId(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 disabled:bg-slate-100 rounded-xl py-2.5 px-3.5 text-xs text-slate-800 focus:outline-hidden focus:border-blue-500 focus:bg-white transition-all"
                    >
                      <option value="">Select Doctor...</option>
                      {activeDoctors.map(doc => (
                        <option key={doc.id} value={doc.id}>{doc.name} - {doc.specialty}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700 uppercase">Date of Consultation</label>
                    <input
                      type="date"
                      required
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3.5 text-xs text-slate-800 focus:outline-hidden focus:border-blue-500 focus:bg-white transition-all"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700 uppercase">Preferred Time Slot</label>
                    <select
                      required
                      disabled={!selectedDocId}
                      value={selectedTimeSlot}
                      onChange={(e) => setSelectedTimeSlot(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 disabled:bg-slate-100 rounded-xl py-2.5 px-3.5 text-xs text-slate-800 focus:outline-hidden focus:border-blue-500 focus:bg-white transition-all"
                    >
                      <option value="">Select Slot...</option>
                      {timeSlots.map((slot) => (
                        <option key={slot} value={slot}>{slot}</option>
                      ))}
                    </select>
                  </div>

                </div>
              </div>

              {/* Section: Symptoms & Diagnostics */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-700 uppercase block">Clinical Diagnostics & Symptoms</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Summarize reasons for consultation, presenting symptoms, and any other notes relevant for clinical reception..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-xs text-slate-800 focus:outline-hidden focus:border-blue-500 focus:bg-white transition-all"
                ></textarea>
              </div>

              {/* Intake controls */}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-5 py-2.5 rounded-xl transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-md cursor-pointer flex items-center gap-2"
                >
                  {formLoading ? (
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      Register Consultation
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>
        ) : null}

        {/* Dashboard Analytics Bar */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="bg-white border border-slate-100 p-5 rounded-3xl shadow-xs space-y-2 flex flex-col justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block">Total Bookings</span>
            <div className="flex items-center justify-between">
              <span className="font-display font-black text-3xl text-slate-900">{statsTotal}</span>
              <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                <Calendar className="w-5 h-5" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-100 p-5 rounded-3xl shadow-xs space-y-2 flex flex-col justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-500 block">Confirmed Visits</span>
            <div className="flex items-center justify-between">
              <span className="font-display font-black text-3xl text-slate-900">{statsConfirmed}</span>
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                <CheckCircle className="w-5 h-5" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-100 p-5 rounded-3xl shadow-xs space-y-2 flex flex-col justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-rose-500 block">Cancelled Slots</span>
            <div className="flex items-center justify-between">
              <span className="font-display font-black text-3xl text-slate-900">{statsCancelled}</span>
              <div className="p-2 bg-rose-50 text-rose-600 rounded-xl">
                <XCircle className="w-5 h-5" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-100 p-5 rounded-3xl shadow-xs space-y-2 flex flex-col justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-500 block">Unique Patients</span>
            <div className="flex items-center justify-between">
              <span className="font-display font-black text-3xl text-slate-900">{statsUniquePatients}</span>
              <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
                <Users className="w-5 h-5" />
              </div>
            </div>
          </div>

        </div>

        {/* Bookings table filter and controller section */}
        <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-xs">
          
          {/* Filtering and search header */}
          <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div>
              <h2 className="font-display font-extrabold text-base text-slate-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-slate-500" />
                Clinical Appointment Records
              </h2>
              <p className="text-xs text-slate-500">
                Found {filteredBookings.length} matching consultation items
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
              
              {/* Search input */}
              <div className="relative flex-grow sm:flex-none">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
                  <Search className="w-3.5 h-3.5" />
                </span>
                <input
                  type="text"
                  placeholder="Search name, email, ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full sm:w-56 bg-white border border-slate-200 rounded-xl py-2 pl-9 pr-3 text-xs text-slate-700 focus:outline-hidden focus:border-blue-500 focus:bg-white transition-all"
                />
              </div>

              {/* Status filter dropdown */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="bg-white border border-slate-200 rounded-xl py-2 px-3 text-xs text-slate-700 focus:outline-hidden"
              >
                <option value="All">All Statuses</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Cancelled">Cancelled</option>
              </select>

              {/* Department filter dropdown */}
              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="bg-white border border-slate-200 rounded-xl py-2 px-3 text-xs text-slate-700 focus:outline-hidden"
              >
                <option value="All">All Specialties</option>
                {DEPARTMENTS.map(d => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>

              {/* Refresh button */}
              <button
                onClick={fetchAllBookings}
                disabled={loading}
                className="p-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
                title="Refresh Records"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>

            </div>
          </div>

          {/* Records Display list */}
          {loading ? (
            <div className="text-center py-20 space-y-3">
              <span className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></span>
              <p className="text-xs text-slate-500 font-semibold">Synchronizing with hospital medical database...</p>
            </div>
          ) : filteredBookings.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">
                    <th className="py-4 px-6">Appointment ID / Created</th>
                    <th className="py-4 px-6">Patient Demographics</th>
                    <th className="py-4 px-6">Assigned Specialist</th>
                    <th className="py-4 px-6">Date & Slot</th>
                    <th className="py-4 px-6">Clinical Indication</th>
                    <th className="py-4 px-6">Status</th>
                    <th className="py-4 px-6 text-right">Administrative Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                  {filteredBookings.map((b) => {
                    const isConfirmed = b.status === 'Confirmed';
                    const createdAtString = b.createdAt ? new Date(b.createdAt).toLocaleDateString() : 'N/A';
                    
                    return (
                      <tr key={b.id} className="hover:bg-slate-50/30 transition-colors">
                        
                        {/* Column 1: ID & Creation */}
                        <td className="py-4 px-6 space-y-1">
                          <span className="font-mono font-bold text-slate-900 block">{b.id}</span>
                          <span className="text-[10px] text-slate-400 font-mono block">Created: {createdAtString}</span>
                        </td>

                        {/* Column 2: Patient Info */}
                        <td className="py-4 px-6 space-y-1.5">
                          <div>
                            <span className="font-bold text-slate-900 block">{b.patientName}</span>
                            <span className="text-slate-500 block">{b.patientEmail}</span>
                            <span className="text-slate-500 block">{b.patientPhone}</span>
                          </div>
                          <div className="flex flex-wrap gap-1.5 pt-0.5">
                            <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md text-[9px] font-bold">
                              Age: {b.patientAge}
                            </span>
                            <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md text-[9px] font-bold">
                              Gender: {b.patientGender}
                            </span>
                            {b.insuranceProvider && (
                              <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md text-[9px] font-bold border border-blue-100/50">
                                {b.insuranceProvider}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Column 3: Doctor */}
                        <td className="py-4 px-6 space-y-0.5">
                          <span className="font-bold text-slate-900 block">{b.doctorName}</span>
                          <span className="text-[11px] text-slate-500 block">{b.departmentName}</span>
                        </td>

                        {/* Column 4: Schedule */}
                        <td className="py-4 px-6 space-y-1">
                          <div className="flex items-center gap-1.5 font-bold text-slate-900">
                            <Calendar className="w-3.5 h-3.5 text-blue-500" />
                            <span>{b.date}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-slate-500">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            <span>{b.timeSlot}</span>
                          </div>
                        </td>

                        {/* Column 5: Symptoms */}
                        <td className="py-4 px-6 max-w-xs">
                          <p className="line-clamp-3 text-slate-600 leading-normal" title={b.reason}>
                            {b.reason}
                          </p>
                        </td>

                        {/* Column 6: Status Badge */}
                        <td className="py-4 px-6">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide border ${
                            isConfirmed 
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-100' 
                              : 'bg-rose-50 text-rose-800 border-rose-100'
                          }`}>
                            <span className={`h-1.5 w-1.5 rounded-full ${isConfirmed ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                            {b.status}
                          </span>
                        </td>

                        {/* Column 7: Admin Actions */}
                        <td className="py-4 px-6 text-right space-y-1">
                          <div className="flex flex-wrap gap-1.5 justify-end">
                            {isConfirmed ? (
                              <button
                                onClick={() => handleCancelBooking(b.id)}
                                className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 hover:text-rose-800 font-bold text-[10px] rounded-lg transition-colors cursor-pointer"
                              >
                                Cancel Appointment
                              </button>
                            ) : (
                              <button
                                onClick={() => handleRestoreBooking(b.id)}
                                className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 hover:text-emerald-800 font-bold text-[10px] rounded-lg transition-colors cursor-pointer"
                              >
                                Re-Confirm
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteBooking(b.id)}
                              className="p-1.5 bg-slate-50 hover:bg-rose-50 text-slate-400 hover:text-rose-700 rounded-lg transition-colors cursor-pointer border border-slate-100 hover:border-rose-100"
                              title="Delete Record"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>

                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-20 px-4">
              <p className="text-slate-400 font-bold">No Clinical Records Found</p>
              <p className="text-slate-500 text-xs mt-1">
                Try adjusting your search keywords, status filters, or specialty filters.
              </p>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
