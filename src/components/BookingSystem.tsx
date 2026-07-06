import { useState, useEffect } from 'react';
import { Calendar, Clock, User, Heart, ShieldCheck, CheckCircle, ArrowLeft, ArrowRight, UserCheck, AlertCircle } from 'lucide-react';
import { DEPARTMENTS, DOCTORS } from '../data';
import { Booking } from '../types';
import { useFirebase } from './FirebaseContext';
import AuthScreen from './AuthScreen';
import { doc, setDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';

interface BookingSystemProps {
  initialDoctorId?: string;
  initialDepartmentId?: string;
  onBookingSuccess: () => void;
  setPage: (page: string) => void;
}

export default function BookingSystem({ 
  initialDoctorId, 
  initialDepartmentId, 
  onBookingSuccess,
  setPage 
}: BookingSystemProps) {
  
  const { user } = useFirebase();

  // Wizard current step: 1 (Specialty & Doctor), 2 (Date & Time), 3 (Patient Info), 4 (Summary Success)
  const [step, setStep] = useState(1);
  const [loadingBooking, setLoadingBooking] = useState(false);

  // Auto-fill form from logged-in user profile
  useEffect(() => {
    if (user) {
      if (!patientName && user.displayName) setPatientName(user.displayName);
      if (!patientEmail && user.email) setPatientEmail(user.email);
    }
  }, [user]);

  // Form selections
  const [selectedDepId, setSelectedDepId] = useState<string>('');
  const [selectedDocId, setSelectedDocId] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('');

  // Patient details state
  const [patientName, setPatientName] = useState('');
  const [patientEmail, setPatientEmail] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [patientAge, setPatientAge] = useState('');
  const [patientGender, setPatientGender] = useState('Female');
  const [reason, setReason] = useState('');
  const [insuranceProvider, setInsuranceProvider] = useState('None (Private self-pay)');

  // Validation Error messages
  const [errorMsg, setErrorMsg] = useState('');

  // Success Booking Object
  const [latestBooking, setLatestBooking] = useState<Booking | null>(null);

  // Pre-populate if deep-linked
  useEffect(() => {
    if (initialDepartmentId && DEPARTMENTS.some(d => d.id === initialDepartmentId)) {
      setSelectedDepId(initialDepartmentId);
    }
    if (initialDoctorId && DOCTORS.some(d => d.id === initialDoctorId)) {
      setSelectedDocId(initialDoctorId);
      // If we have both, we can safely advance to step 2 directly to save clicks
      const docObj = DOCTORS.find(d => d.id === initialDoctorId);
      if (docObj && docObj.departmentId === initialDepartmentId) {
        setStep(2);
      }
    }
  }, [initialDoctorId, initialDepartmentId]);

  // Update Doctor list if department changes
  useEffect(() => {
    if (selectedDepId) {
      const doctorsInDep = DOCTORS.filter(doc => doc.departmentId === selectedDepId);
      // Reset selected doctor if they don't belong to newly selected department
      if (selectedDocId && !doctorsInDep.some(d => d.id === selectedDocId)) {
        setSelectedDocId('');
      }
    }
  }, [selectedDepId]);

  // Generate list of the next 7 days for booking
  const generateDates = () => {
    const dates = [];
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
    // Starting from today (or tomorrow if past standard office hours, let's start today)
    const startDate = new Date();
    
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(startDate.getDate() + i);
      
      const dayName = daysOfWeek[d.getDay()];
      const dayNum = d.getDate();
      const monthName = d.toLocaleString('en-US', { month: 'short' });
      const year = d.getFullYear();
      
      // Format YYYY-MM-DD
      const formattedMonth = String(d.getMonth() + 1).padStart(2, '0');
      const formattedDay = String(dayNum).padStart(2, '0');
      const fullDateStr = `${year}-${formattedMonth}-${formattedDay}`;

      dates.push({
        fullDateStr,
        dayName,
        dayNum,
        monthName,
        isSunday: d.getDay() === 0
      });
    }
    return dates;
  };

  const datesList = generateDates();

  const selectedDepartment = DEPARTMENTS.find(d => d.id === selectedDepId);
  const selectedDoctor = DOCTORS.find(d => d.id === selectedDocId);
  const filteredDoctorsList = selectedDepId 
    ? DOCTORS.filter(d => d.departmentId === selectedDepId)
    : [];

  // Navigation handlers with validations
  const handleNextStep = () => {
    setErrorMsg('');

    if (step === 1) {
      if (!selectedDepId) {
        setErrorMsg('Please select a clinical specialty department first.');
        return;
      }
      if (!selectedDocId) {
        setErrorMsg('Please choose your preferred specialist physician.');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!selectedDate) {
        setErrorMsg('Please select a calendar date for your appointment.');
        return;
      }
      if (!selectedTimeSlot) {
        setErrorMsg('Please select an available consultation time-slot.');
        return;
      }
      setStep(3);
    } else if (step === 3) {
      // Validate patient details
      if (!patientName.trim()) {
        setErrorMsg('Please enter the patient\'s full legal name.');
        return;
      }
      if (!patientEmail.trim() || !patientEmail.includes('@')) {
        setErrorMsg('Please enter a valid patient email address.');
        return;
      }
      if (!patientPhone.trim()) {
        setErrorMsg('Please enter a valid telephone contact number.');
        return;
      }
      if (!patientAge || isNaN(Number(patientAge)) || Number(patientAge) <= 0) {
        setErrorMsg('Please enter a valid patient age.');
        return;
      }
      if (!reason.trim()) {
        setErrorMsg('Please provide a brief reason for this clinical consultation.');
        return;
      }
      
      // Perform booking creation
      handleConfirmBooking();
    }
  };

  const handlePrevStep = () => {
    setErrorMsg('');
    if (step > 1) setStep(step - 1);
  };

  const handleConfirmBooking = async () => {
    if (!selectedDepartment || !selectedDoctor || !user) return;

    // Create a realistic booking object
    const bookingId = `WCH-${Math.floor(100000 + Math.random() * 900000)}`;
    
    const newBooking: Booking & { userId: string } = {
      id: bookingId,
      userId: user.uid,
      patientName,
      patientEmail,
      patientPhone,
      patientAge,
      patientGender,
      departmentId: selectedDepId,
      departmentName: selectedDepartment.name,
      doctorId: selectedDocId,
      doctorName: selectedDoctor.name,
      date: selectedDate,
      timeSlot: selectedTimeSlot,
      reason,
      status: 'Confirmed',
      createdAt: new Date().toISOString()
    };

    if (insuranceProvider && insuranceProvider !== 'None (Private self-pay)') {
      newBooking.insuranceProvider = insuranceProvider;
    }

    setLoadingBooking(true);
    setErrorMsg('');

    try {
      // Save directly to secure Firestore (Pillar 2 Schema and Identity matched)
      await setDoc(doc(db, 'bookings', bookingId), newBooking);

      // Keep localStorage as temporary fallback or backward compatibility
      const savedBookings = localStorage.getItem('wecare_bookings');
      let currentBookings: Booking[] = [];
      if (savedBookings) {
        try {
          currentBookings = JSON.parse(savedBookings);
        } catch (e) {
          currentBookings = [];
        }
      }
      currentBookings.unshift(newBooking);
      localStorage.setItem('wecare_bookings', JSON.stringify(currentBookings));

      setLatestBooking(newBooking);
      onBookingSuccess(); // Notifies outer app component of active count update
      setStep(4); // Move to Success panel
    } catch (err) {
      console.error("Firestore booking confirm error:", err);
      setErrorMsg("Failed to book appointment due to database permission rules. Please make sure you are signed in.");
      try {
        handleFirestoreError(err, OperationType.CREATE, `bookings/${bookingId}`);
      } catch (innerErr) {
        // Logged
      }
    } finally {
      setLoadingBooking(false);
    }
  };

  const insuranceOptions = [
    'None (Private self-pay)',
    'Blue Cross Blue Shield',
    'Aetna Health Insurance',
    'UnitedHealthcare',
    'Cigna Global Medical',
    'Medicare / Medicaid Plan',
    'Other International Provider'
  ];

  if (!user) {
    return (
      <div className="bg-slate-50 py-16">
        <div className="max-w-md mx-auto px-4">
          <AuthScreen 
            message="Please log in or register a new patient account to access our secure online booking portal."
          />
        </div>
      </div>
    );
  }

  return (
    <div id="booking-portal-page" className="bg-slate-50 py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        
        {/* Step Indicator (Only if not finished step 4) */}
        {step < 4 && (
          <div className="mb-10">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              <span>Step {step} of 3</span>
              <span className="text-blue-600">
                {step === 1 && 'Department & Specialist Selection'}
                {step === 2 && 'Schedule Calendar & Hours'}
                {step === 3 && 'Patient Information Record'}
              </span>
            </div>
            
            {/* Visual Progress Bar */}
            <div className="h-2 bg-slate-200 rounded-full overflow-hidden flex">
              <div className={`h-full bg-blue-600 transition-all duration-300 ${
                step === 1 ? 'w-1/3' : step === 2 ? 'w-2/3' : 'w-full'
              }`}></div>
            </div>
          </div>
        )}

        {/* Major validation alerts */}
        {errorMsg && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-start gap-3">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form Container */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-10 shadow-xs">
          
          {/* STEP 1: CHOOSE SPECIALTY & PHYSICIAN */}
          {step === 1 && (
            <div id="booking-step-1" className="space-y-8">
              <div className="space-y-2">
                <h2 className="font-display font-extrabold text-2xl text-slate-950">Department & Specialist</h2>
                <p className="text-slate-500 text-sm leading-relaxed">
                  Start by selecting your target medical department, then select your desired medical specialist from the clinical staff directory.
                </p>
              </div>

              {/* Specialty Department Selection */}
              <div className="space-y-3.5">
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">1. Select Medical Department</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {DEPARTMENTS.map((dep) => {
                    const isSelected = dep.id === selectedDepId;
                    return (
                      <button
                        key={dep.id}
                        onClick={() => setSelectedDepId(dep.id)}
                        className={`flex items-center gap-3.5 p-4 rounded-xl border text-left cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-slate-900 border-slate-900 text-white shadow-xs'
                            : 'bg-slate-50/50 border-slate-200/80 hover:bg-slate-100/50 text-slate-800'
                        }`}
                      >
                        <div className={`p-2 rounded-lg ${isSelected ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-600'}`}>
                          <Heart className="w-5 h-5" />
                        </div>
                        <span className="font-display font-bold text-sm">{dep.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Specialist Doctor Selection */}
              {selectedDepId && (
                <div className="space-y-3.5 pt-4 border-t border-slate-50 animate-fadeIn">
                  <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">2. Select Your Specialist Physician</label>
                  
                  {filteredDoctorsList.length > 0 ? (
                    <div className="grid grid-cols-1 gap-3.5">
                      {filteredDoctorsList.map((doc) => {
                        const isSelected = doc.id === selectedDocId;
                        return (
                          <button
                            key={doc.id}
                            onClick={() => setSelectedDocId(doc.id)}
                            className={`flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-2xl border text-left cursor-pointer transition-all gap-4 ${
                              isSelected
                                ? 'bg-blue-500/5 border-blue-600 shadow-xs ring-1 ring-blue-600/20'
                                : 'bg-slate-50/50 border-slate-200/80 hover:bg-slate-100/50 text-slate-800'
                            }`}
                          >
                            <div className="flex items-center gap-4">
                              <img 
                                src={doc.image} 
                                alt={doc.name} 
                                referrerPolicy="no-referrer"
                                className="w-12 h-12 rounded-xl object-cover object-top border border-slate-200"
                              />
                              <div>
                                <h4 className="font-display font-bold text-sm text-slate-900">{doc.name}</h4>
                                <p className="text-xs text-slate-500">{doc.specialty}</p>
                                <p className="text-[10px] text-blue-600 mt-0.5">Rating: ★ {doc.rating} ({doc.reviewsCount} reviews)</p>
                              </div>
                            </div>
                            
                            <div className="text-xs bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-slate-600 shrink-0 font-medium">
                              {isSelected ? '✓ Selected Specialist' : 'Choose Physician'}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-400 italic">No doctors found for this department.</p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* STEP 2: DATE & TIME SELECTION */}
          {step === 2 && selectedDoctor && (
            <div id="booking-step-2" className="space-y-8">
              
              {/* Return link/info block */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <img 
                    src={selectedDoctor.image} 
                    alt={selectedDoctor.name} 
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 rounded-lg object-cover object-top"
                  />
                  <div>
                    <h4 className="font-display font-bold text-sm text-slate-900">{selectedDoctor.name}</h4>
                    <p className="text-[10px] text-slate-500">{selectedDoctor.specialty}</p>
                  </div>
                </div>
                <button
                  onClick={() => setStep(1)}
                  className="text-xs text-slate-400 hover:text-blue-600 hover:underline"
                >
                  Change doctor
                </button>
              </div>

              <div className="space-y-2">
                <h2 className="font-display font-extrabold text-2xl text-slate-950">Choose Date & Time</h2>
                <p className="text-slate-500 text-sm leading-relaxed">
                  Select an available calendar day from the clinician's upcoming schedule. Sunday is clinical rest day.
                </p>
              </div>

              {/* Calendar Date Grid */}
              <div className="space-y-3.5">
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">1. Select Appointment Date</label>
                <div className="grid grid-cols-4 sm:grid-cols-7 gap-2.5">
                  {datesList.map((dateObj) => {
                    const isSunday = dateObj.isSunday;
                    // Doctor is only available on specific weekdays
                    const isDocAvailableOnDay = selectedDoctor.availability.includes(dateObj.dayName);
                    const isDisabled = isSunday || !isDocAvailableOnDay;
                    const isSelected = dateObj.fullDateStr === selectedDate;

                    return (
                      <button
                        key={dateObj.fullDateStr}
                        disabled={isDisabled}
                        onClick={() => setSelectedDate(dateObj.fullDateStr)}
                        className={`p-3.5 rounded-xl border text-center flex flex-col justify-between items-center transition-all ${
                          isDisabled
                            ? 'bg-slate-100/50 text-slate-300 border-slate-100 cursor-not-allowed opacity-50'
                            : isSelected
                              ? 'bg-slate-900 border-slate-900 text-white shadow-xs'
                              : 'bg-slate-50/50 border-slate-200/80 hover:bg-slate-100 text-slate-700 cursor-pointer'
                        }`}
                      >
                        <span className="text-[10px] font-medium tracking-wide uppercase">{dateObj.dayName.substring(0, 3)}</span>
                        <span className="font-display font-black text-lg my-1 leading-none">{dateObj.dayNum}</span>
                        <span className="text-[9px] font-medium uppercase">{dateObj.monthName}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Time Slot Selection */}
              {selectedDate && (
                <div className="space-y-3.5 pt-6 border-t border-slate-50 animate-fadeIn">
                  <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">2. Select Consultation Shift Slot</label>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {selectedDoctor.timeSlots.map((slot) => {
                      const isSelected = slot === selectedTimeSlot;
                      return (
                        <button
                          key={slot}
                          onClick={() => setSelectedTimeSlot(slot)}
                          className={`p-3 rounded-xl border text-center font-mono font-medium text-xs sm:text-sm cursor-pointer transition-all ${
                            isSelected
                              ? 'bg-blue-600 border-blue-600 text-white shadow-xs'
                              : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                          }`}
                        >
                          {slot}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 3: PATIENT INTAKE INFORMATION */}
          {step === 3 && selectedDoctor && selectedDepartment && (
            <div id="booking-step-3" className="space-y-8">
              
              <div className="space-y-2">
                <h2 className="font-display font-extrabold text-2xl text-slate-950">Patient Intake Record</h2>
                <p className="text-slate-500 text-sm leading-relaxed">
                  Provide the patient's valid legal details, contact channels, and health reasons to pre-compile the consultation record.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Patient Name */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">Patient Full Legal Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g., Jonathan Doe" 
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm text-slate-800 focus:outline-hidden focus:border-blue-500 focus:bg-white transition-all"
                  />
                </div>

                {/* Patient Email */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">Primary Email Address</label>
                  <input 
                    type="email" 
                    placeholder="e.g., jdoe@example.com" 
                    value={patientEmail}
                    onChange={(e) => setPatientEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm text-slate-800 focus:outline-hidden focus:border-blue-500 focus:bg-white transition-all"
                  />
                </div>

                {/* Patient Phone */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">Telephone Contact Number</label>
                  <input 
                    type="tel" 
                    placeholder="e.g., +1 (212) 555-0145" 
                    value={patientPhone}
                    onChange={(e) => setPatientPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm text-slate-800 focus:outline-hidden focus:border-blue-500 focus:bg-white transition-all"
                  />
                </div>

                {/* Patient Age & Gender */}
                <div className="grid grid-cols-2 gap-3.5">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">Patient Age</label>
                    <input 
                      type="number" 
                      placeholder="e.g., 28" 
                      value={patientAge}
                      onChange={(e) => setPatientAge(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm text-slate-800 focus:outline-hidden focus:border-blue-500 focus:bg-white transition-all"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">Patient Gender</label>
                    <select
                      value={patientGender}
                      onChange={(e) => setPatientGender(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-3.5 text-sm text-slate-800 focus:outline-hidden focus:border-blue-500 focus:bg-white transition-all"
                    >
                      <option value="Female">Female</option>
                      <option value="Male">Male</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Insurance Provider */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">Partner Insurance Provider (Optional)</label>
                <select
                  value={insuranceProvider}
                  onChange={(e) => setPatientGender(e.target.value)} // Safe mapping or save to own state
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm text-slate-800 focus:outline-hidden focus:border-blue-500 focus:bg-white transition-all"
                >
                  {insuranceOptions.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
                <p className="text-[10px] text-slate-400">Co-pay deduction calculations are calculated based on your provider contract upon physical check-in.</p>
              </div>

              {/* Reason for Visit */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">Reason for Clinical Visit / Symptoms</label>
                <textarea 
                  rows={4}
                  placeholder="Provide a short description of current physical symptoms, medication history, or referral background..." 
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm text-slate-800 focus:outline-hidden focus:border-blue-500 focus:bg-white transition-all resize-none"
                />
              </div>

            </div>
          )}

          {/* STEP 4: SUCCESS BANNER SCREEN */}
          {step === 4 && latestBooking && (
            <div id="booking-success" className="text-center space-y-8 animate-fadeIn">
              
              {/* Success Badge */}
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto shadow-md">
                <CheckCircle className="w-10 h-10" />
              </div>

              <div className="space-y-3">
                <span className="text-[10px] font-mono font-bold tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase">Appointment Registered</span>
                <h2 className="font-display font-extrabold text-3xl text-slate-950">Your Appointment is Confirmed!</h2>
                <p className="text-slate-500 text-sm max-w-lg mx-auto">
                  Thank you for choosing WeCare. A digital confirmation with a medical receipt code has been saved to your clinical portal database.
                </p>
              </div>

              {/* Itemized Confirmation Receipt */}
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 text-left space-y-4 max-w-md mx-auto">
                <div className="flex justify-between items-center pb-3 border-b border-slate-200/50">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Appointment Receipt ID</span>
                  <span className="font-mono font-bold text-sm text-slate-900 bg-white border border-slate-200 px-2.5 py-1 rounded">{latestBooking.id}</span>
                </div>

                <div className="space-y-2.5 text-xs text-slate-600">
                  <p><span className="font-semibold text-slate-800">Specialist:</span> {latestBooking.doctorName}</p>
                  <p><span className="font-semibold text-slate-800">Specialty Hub:</span> {latestBooking.departmentName} Dept</p>
                  <p><span className="font-semibold text-slate-800">Consultation Date:</span> {latestBooking.date}</p>
                  <p><span className="font-semibold text-slate-800">Assigned Shift Slot:</span> {latestBooking.timeSlot}</p>
                  <p><span className="font-semibold text-slate-800">Intake Name:</span> {latestBooking.patientName} ({latestBooking.patientAge}yo, {latestBooking.patientGender})</p>
                  <p><span className="font-semibold text-slate-800">Insurance Status:</span> {latestBooking.insuranceProvider || 'Private self-pay'}</p>
                </div>
              </div>

              {/* Closing buttons */}
              <div className="flex flex-col sm:flex-row gap-3.5 max-w-sm mx-auto pt-4">
                <button
                  onClick={() => setPage('bookings')}
                  className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl transition-all text-sm cursor-pointer"
                >
                  My Appointments
                </button>
                <button
                  onClick={() => {
                    // Reset wizard state to start fresh next time
                    setStep(1);
                    setSelectedDepId('');
                    setSelectedDocId('');
                    setSelectedDate('');
                    setSelectedTimeSlot('');
                    setPatientName('');
                    setPatientEmail('');
                    setPatientPhone('');
                    setPatientAge('');
                    setReason('');
                    setPage('home');
                  }}
                  className="flex-1 border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold py-3 rounded-xl transition-all text-sm cursor-pointer"
                >
                  Return to Home
                </button>
              </div>

            </div>
          )}

          {/* Navigation Controls (If not finished step 4) */}
          {step < 4 && (
            <div className="mt-10 pt-6 border-t border-slate-100 flex justify-between items-center">
              
              {/* Back CTA */}
              {step > 1 ? (
                <button
                  onClick={handlePrevStep}
                  className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-800 text-xs sm:text-sm font-semibold transition-colors cursor-pointer focus:outline-hidden"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>
              ) : (
                <div /> // Placeholder to keep layout spacing
              )}

              {/* Next/Confirm CTA */}
              <button
                onClick={handleNextStep}
                disabled={loadingBooking}
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-xl shadow-xs transition-all transform hover:-translate-y-0.5 cursor-pointer focus:outline-hidden"
              >
                {loadingBooking ? (
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  <>
                    {step === 3 ? 'Confirm & Secure Appointment' : 'Continue'}
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}
