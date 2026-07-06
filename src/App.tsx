import { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/Home';
import About from './components/About';
import Departments from './components/Departments';
import Doctors from './components/Doctors';
import BookingSystem from './components/BookingSystem';
import MyBookings from './components/MyBookings';
import AdminPortal from './components/AdminPortal';
import { Booking } from './types';
import { useFirebase } from './components/FirebaseContext';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from './lib/firebase';

export default function App() {
  const [currentPage, setCurrentPage] = useState<string>('home');
  
  // Transition / Deep Link Parameters
  const [preselectedDoctorId, setPreselectedDoctorId] = useState<string | undefined>(undefined);
  const [preselectedDepartmentId, setPreselectedDepartmentId] = useState<string | undefined>(undefined);

  // Active bookings count state for Header notification badge
  const [activeBookingsCount, setActiveBookingsCount] = useState<number>(0);
  const [bookingsTrigger, setBookingsTrigger] = useState<number>(0);

  const { user } = useFirebase();

  // Sync active bookings count on initial mount and when trigger fires
  const syncActiveBookingsCount = async () => {
    if (user) {
      try {
        const bookingsRef = collection(db, 'bookings');
        const q = query(bookingsRef, where('userId', '==', user.uid), where('status', '==', 'Confirmed'));
        const querySnapshot = await getDocs(q);
        setActiveBookingsCount(querySnapshot.size);
      } catch (err) {
        console.error("Error syncing active bookings from firestore:", err);
        fallbackLocalSync();
      }
    } else {
      setActiveBookingsCount(0);
    }
  };

  const fallbackLocalSync = () => {
    const saved = localStorage.getItem('wecare_bookings');
    if (saved) {
      try {
        const parsed: Booking[] = JSON.parse(saved);
        const activeCount = parsed.filter(b => b.status === 'Confirmed').length;
        setActiveBookingsCount(activeCount);
      } catch (e) {
        setActiveBookingsCount(0);
      }
    } else {
      setActiveBookingsCount(0);
    }
  };

  useEffect(() => {
    syncActiveBookingsCount();
  }, [user, bookingsTrigger]);

  // Unified router function supporting query param transitions
  const navigateToPage = (
    pageId: string, 
    params?: { doctorId?: string; departmentId?: string }
  ) => {
    setCurrentPage(pageId);
    setPreselectedDoctorId(params?.doctorId);
    setPreselectedDepartmentId(params?.departmentId);
    
    // Always slide screen back to top on transitions
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleBookingSuccess = () => {
    // Increment trigger count to sync other components
    setBookingsTrigger(prev => prev + 1);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans selection:bg-emerald-500/30 selection:text-emerald-950">
      
      {/* 1. Global Navigation Header */}
      <Header 
        currentPage={currentPage} 
        setPage={navigateToPage} 
        activeBookingsCount={activeBookingsCount} 
      />

      {/* 2. Main Client View Container */}
      <main className="flex-grow">
        {currentPage === 'home' && (
          <Home setPage={navigateToPage} />
        )}

        {currentPage === 'about' && (
          <About />
        )}

        {currentPage === 'departments' && (
          <Departments 
            initialDepartmentId={preselectedDepartmentId} 
            setPage={navigateToPage} 
          />
        )}

        {currentPage === 'doctors' && (
          <Doctors 
            initialDoctorId={preselectedDoctorId} 
            setPage={navigateToPage} 
          />
        )}

        {currentPage === 'booking_portal' && (
          <BookingSystem 
            initialDoctorId={preselectedDoctorId} 
            initialDepartmentId={preselectedDepartmentId}
            onBookingSuccess={handleBookingSuccess}
            setPage={navigateToPage}
          />
        )}

        {currentPage === 'bookings' && (
          <MyBookings onRefreshTrigger={bookingsTrigger} />
        )}

        {currentPage === 'admin' && (
          <AdminPortal 
            onRefreshTrigger={bookingsTrigger} 
            onBookingSuccess={handleBookingSuccess} 
          />
        )}
      </main>

      {/* 3. Global Footer */}
      <Footer setPage={navigateToPage} />

    </div>
  );
}
