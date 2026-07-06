import { useState, useEffect } from 'react';
import { Calendar, Clock, Phone, AlertCircle, FileText, Trash2, ShieldAlert, CalendarX } from 'lucide-react';
import { Booking } from '../types';
import { useFirebase } from './FirebaseContext';
import AuthScreen from './AuthScreen';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';

interface MyBookingsProps {
  onRefreshTrigger: number;
}

export default function MyBookings({ onRefreshTrigger }: MyBookingsProps) {
  const { user } = useFirebase();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'confirmed' | 'cancelled'>('all');
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Load bookings from Firestore (with local fallback)
  const loadBookings = async () => {
    if (!user) {
      setBookings([]);
      return;
    }
    setLoading(true);
    setErrorMsg(null);
    try {
      const bookingsRef = collection(db, 'bookings');
      const q = query(bookingsRef, where('userId', '==', user.uid));
      const querySnapshot = await getDocs(q);
      
      const fetchedBookings: Booking[] = [];
      querySnapshot.forEach((docSnap) => {
        fetchedBookings.push(docSnap.data() as Booking);
      });
      
      // Sort by createdAt descending
      fetchedBookings.sort((a, b) => {
        const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return timeB - timeA;
      });
      
      setBookings(fetchedBookings);
    } catch (err) {
      console.error("Firestore loading error:", err);
      setErrorMsg("Unable to retrieve remote appointments. Loading local cache...");
      
      // Fallback to local storage if firestore is blocked or unconfigured
      const saved = localStorage.getItem('wecare_bookings');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setBookings(parsed);
        } catch (e) {
          setBookings([]);
        }
      } else {
        setBookings([]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, [user, onRefreshTrigger]);

  // Cancel an appointment in Firestore securely
  const handleCancelBooking = async (bookingId: string) => {
    const confirmCancel = window.confirm('Are you sure you want to cancel this clinical appointment? This will release the allocated doctor slot.');
    if (!confirmCancel) return;

    setErrorMsg(null);
    try {
      await updateDoc(doc(db, 'bookings', bookingId), {
        status: 'Cancelled'
      });
      
      // Update local state directly
      setBookings(prev => prev.map((b) => {
        if (b.id === bookingId) {
          return { ...b, status: 'Cancelled' as const };
        }
        return b;
      }));
    } catch (err) {
      console.error("Firestore cancellation error:", err);
      alert("Permission denied. You can only cancel your own confirmed clinical bookings.");
      try {
        handleFirestoreError(err, OperationType.UPDATE, `bookings/${bookingId}`);
      } catch (innerErr) {
        // Logged
      }
    }
  };

  // Permanently delete a cancelled record from local state cache
  const handleDeleteBooking = (bookingId: string) => {
    const confirmDelete = window.confirm('Are you sure you want to permanently clear this record from your local device cache?');
    if (!confirmDelete) return;

    const updated = bookings.filter(b => b.id !== bookingId);
    localStorage.setItem('wecare_bookings', JSON.stringify(updated));
    setBookings(updated);
  };

  // Filter Bookings
  const filteredBookings = bookings.filter((b) => {
    if (activeTab === 'confirmed') return b.status === 'Confirmed';
    if (activeTab === 'cancelled') return b.status === 'Cancelled';
    return true;
  });

  if (!user) {
    return (
      <div className="bg-slate-50 py-16">
        <div className="max-w-md mx-auto px-4">
          <AuthScreen 
            message="Please sign in or create an online profile to view and manage your clinic consultation schedule."
          />
        </div>
      </div>
    );
  }

  return (
    <div id="my-bookings-page" className="bg-slate-50 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-10">
        
        {/* Header Block */}
        <div className="space-y-4">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
            Clinical Portal
          </span>
          <h1 className="font-display font-bold text-4xl text-slate-950 tracking-tight leading-tight">
            My Scheduled Appointments
          </h1>
          <p className="text-slate-600 text-sm">
            Access and manage your active clinical consultations. You can review your booking receipt details or cancel upcoming sessions if your schedule fluctuates.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex border-b border-slate-200 gap-6 text-sm font-medium">
          {(['all', 'confirmed', 'cancelled'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 border-b-2 font-semibold capitalize transition-all duration-150 cursor-pointer focus:outline-hidden ${
                tab === activeTab
                  ? 'border-blue-600 text-blue-700 font-extrabold'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab === 'all' && 'All Bookings'}
              {tab === 'confirmed' && 'Confirmed Slots'}
              {tab === 'cancelled' && 'Cancelled Logs'}
            </button>
          ))}
        </div>

        {/* Error Notification */}
        {errorMsg && (
          <div className="p-4 bg-amber-50 border border-amber-200 text-amber-800 rounded-2xl text-xs sm:text-sm">
            {errorMsg}
          </div>
        )}

        {/* Display Bookings List */}
        {loading ? (
          <div className="text-center py-12">
            <span className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></span>
            <p className="text-slate-500 text-xs mt-3 font-semibold">Loading secure clinical patient records...</p>
          </div>
        ) : filteredBookings.length > 0 ? (
          <div className="space-y-6">
            {filteredBookings.map((b) => {
              const isConfirmed = b.status === 'Confirmed';
              return (
                <div 
                  key={b.id} 
                  id={`booking-card-${b.id}`}
                  className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-md transition-all duration-200"
                >
                  
                  {/* Left Side: Booking Metadata */}
                  <div className="space-y-4">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="font-mono text-xs font-bold bg-slate-100 border border-slate-200 text-slate-800 px-2.5 py-0.5 rounded">
                        {b.id}
                      </span>
                      
                      {/* Pulse Confirmed badge vs Cancelled Badge */}
                      {isConfirmed ? (
                        <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                          <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-ping"></span>
                          Confirmed Slot
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-slate-500 bg-slate-100 border border-slate-200 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                          Cancelled
                        </span>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <h3 className="font-display font-extrabold text-xl text-slate-900 leading-snug">
                        {b.doctorName}
                      </h3>
                      <p className="text-xs text-slate-500 font-medium">
                        {b.departmentName} Specialty Department
                      </p>
                    </div>

                    {/* Schedule Date & Hour */}
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-1">
                      <div className="flex items-center gap-2 text-slate-600 text-xs sm:text-sm font-medium">
                        <Calendar className="w-4 h-4 text-blue-600" />
                        <span>Date: {b.date}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-600 text-xs sm:text-sm font-medium">
                        <Clock className="w-4 h-4 text-blue-600" />
                        <span className="font-mono">{b.timeSlot}</span>
                      </div>
                    </div>

                    {/* Expandable description intake details */}
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2 text-xs text-slate-500 max-w-xl">
                      <p><span className="font-bold text-slate-700">Patient:</span> {b.patientName} ({b.patientAge}yo, {b.patientGender})</p>
                      <p><span className="font-bold text-slate-700">Clinical Complaints:</span> {b.reason}</p>
                      {b.insuranceProvider && <p><span className="font-bold text-slate-700">Insurance Network:</span> {b.insuranceProvider}</p>}
                    </div>
                  </div>

                  {/* Right Side Actions */}
                  <div className="flex md:flex-col gap-3 justify-end items-end shrink-0">
                    {isConfirmed ? (
                      <button
                        onClick={() => handleCancelBooking(b.id)}
                        className="w-full sm:w-auto inline-flex items-center gap-2 border border-red-200 hover:bg-red-50 text-red-600 font-semibold text-xs px-4 py-2.5 rounded-xl transition-all duration-200 cursor-pointer text-center"
                      >
                        <CalendarX className="w-4 h-4" />
                        Cancel Appointment
                      </button>
                    ) : (
                      <button
                        onClick={() => handleDeleteBooking(b.id)}
                        className="w-full sm:w-auto inline-flex items-center gap-2 border border-slate-200 hover:bg-slate-50 text-slate-500 hover:text-slate-800 font-semibold text-xs px-4 py-2.5 rounded-xl transition-all duration-200 cursor-pointer text-center"
                      >
                        <Trash2 className="w-4 h-4" />
                        Clear Record Log
                      </button>
                    )}
                  </div>

                </div>
              );
            })}
          </div>
        ) : (
          /* Empty Bookings State */
          <div className="bg-white rounded-3xl p-16 text-center border border-slate-100 max-w-xl mx-auto space-y-6">
            <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mx-auto">
              <FileText className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h3 className="font-display font-bold text-lg text-slate-900">No Appointments Recorded</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                You do not have any saved appointments under your current device browser profile. Click below to launch the clinical booking wizard.
              </p>
            </div>
            <p className="text-[11px] text-slate-400 bg-slate-50 p-3 rounded-xl border border-slate-100 leading-normal max-w-sm mx-auto">
              WeCare persists scheduled dates securely inside your local browser storage. Clearing your cookies will reset this history.
            </p>
          </div>
        )}

        {/* Support widget box */}
        <div className="bg-slate-900 text-white rounded-3xl p-8 border border-slate-800/80 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <h3 className="font-display font-bold text-lg flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-blue-400" />
              Need to reschedule on short notice?
            </h3>
            <p className="text-slate-400 text-xs sm:text-sm max-w-xl leading-relaxed">
              If you need to change your consulting time within 2 hours of your slot, please telephone our central dispatch team directly so we can coordinate immediate triage adjustments.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <div className="p-2.5 bg-blue-600 text-white rounded-xl">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-mono tracking-wider text-slate-400 uppercase">Direct Helpline</p>
              <p className="font-display font-bold text-base">+1 (212) 555-0199</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
