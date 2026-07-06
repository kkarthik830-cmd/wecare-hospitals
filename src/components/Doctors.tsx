import { useState, useEffect } from 'react';
import { Search, Star, Languages, Calendar, GraduationCap, ChevronLeft, CalendarCheck, HelpCircle } from 'lucide-react';
import { DOCTORS, DEPARTMENTS } from '../data';

interface DoctorsProps {
  initialDoctorId?: string;
  setPage: (page: string, params?: { doctorId?: string; departmentId?: string }) => void;
}

export default function Doctors({ initialDoctorId, setPage }: DoctorsProps) {
  // If we have a deep-linked doctor, we open profile mode directly
  const [selectedDocId, setSelectedDocId] = useState<string | null>(
    initialDoctorId && DOCTORS.some(d => d.id === initialDoctorId) ? initialDoctorId : null
  );

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepFilter, setSelectedDepFilter] = useState<string>('all');

  // Sync if deep link changes
  useEffect(() => {
    if (initialDoctorId && DOCTORS.some(d => d.id === initialDoctorId)) {
      setSelectedDocId(initialDoctorId);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (initialDoctorId === undefined) {
      setSelectedDocId(null);
    }
  }, [initialDoctorId]);

  // Reset page position when switching mode
  const handleSelectDoctor = (id: string) => {
    setSelectedDocId(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToList = () => {
    setSelectedDocId(null);
    // Clear initial parameters if there were any
    setPage('doctors');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Filtered Doctors array
  const filteredDoctors = DOCTORS.filter((doc) => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          doc.specialty.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesDep = selectedDepFilter === 'all' || doc.departmentId === selectedDepFilter;
    
    return matchesSearch && matchesDep;
  });

  // Render Doctor Biography Profile
  if (selectedDocId) {
    const doctor = DOCTORS.find(d => d.id === selectedDocId);
    if (doctor) {
      const docDep = DEPARTMENTS.find(d => d.id === doctor.departmentId);
      return (
        <div id="doctor-profile-view" className="bg-slate-50 py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            
            {/* Back Button */}
            <button
              onClick={handleBackToList}
              className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 font-semibold text-sm mb-8 transition-colors cursor-pointer focus:outline-hidden"
            >
              <ChevronLeft className="w-4 h-4" strokeWidth={2.5} />
              Back to Doctors Directory
            </button>

            {/* Profile Card */}
            <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-xs">
              
              {/* Header Profile Info */}
              <div className="p-6 sm:p-10 border-b border-slate-100">
                <div className="flex flex-col sm:flex-row gap-8 items-start sm:items-center">
                  
                  {/* Doctor Portrait */}
                  <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl bg-slate-100 overflow-hidden shrink-0 shadow-xs border border-slate-100">
                    <img 
                      src={doctor.image} 
                      alt={doctor.name} 
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-top"
                    />
                  </div>

                  {/* Core Details */}
                  <div className="space-y-3.5">
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">
                        {docDep?.name || 'Medical Specialist'}
                      </span>
                      <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-950 mt-1.5">{doctor.name}</h1>
                      <p className="text-slate-500 text-sm font-medium">{doctor.specialty}</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs">
                      <div className="flex items-center gap-1.5 text-slate-700">
                        <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                        <span className="font-bold">{doctor.rating}</span>
                        <span className="text-slate-400">({doctor.reviewsCount} verified patient reviews)</span>
                      </div>
                      
                      <div className="flex items-center gap-1.5 text-slate-700">
                        <Languages className="w-4 h-4 text-slate-400" />
                        <span className="font-medium">Languages: {doctor.languages.join(', ')}</span>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              {/* Grid of Profile Body */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 p-6 sm:p-10">
                
                {/* Left Side: Bio & Credentials */}
                <div className="md:col-span-7 space-y-8">
                  
                  {/* Doctor Bio */}
                  <div className="space-y-3">
                    <h3 className="font-display font-bold text-lg text-slate-950">Professional Summary</h3>
                    <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
                      {doctor.bio}
                    </p>
                  </div>

                  {/* Academic Credentials */}
                  <div className="space-y-4 pt-6 border-t border-slate-100">
                    <h3 className="font-display font-bold text-lg text-slate-950 flex items-center gap-2">
                      <GraduationCap className="w-5 h-5 text-blue-600" />
                      Education & Training
                    </h3>
                    <div className="space-y-3">
                      {doctor.education.split(',').map((edu, idx) => (
                        <div key={idx} className="flex gap-3 text-sm">
                          <span className="flex items-center justify-center w-5 h-5 bg-blue-50 text-blue-600 font-bold rounded-full text-[10px] shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <p className="text-slate-600 leading-normal">{edu.trim()}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Practice Stats */}
                  <div className="grid grid-cols-2 gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-100">
                    <div>
                      <p className="text-slate-400 text-[11px] font-medium uppercase tracking-wider">Experience</p>
                      <p className="font-display font-bold text-lg text-slate-800 mt-1">{doctor.experienceYears} Years Clinical</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-[11px] font-medium uppercase tracking-wider">Patient Care</p>
                      <p className="font-display font-bold text-lg text-slate-800 mt-1">Adult & Pediatric</p>
                    </div>
                  </div>

                </div>

                {/* Right Side: Schedule & Booking Trigger */}
                <div className="md:col-span-5 bg-slate-50 border border-slate-100 rounded-2xl p-6 space-y-6">
                  
                  <div className="flex items-center gap-2 pb-4 border-b border-slate-200/60">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    <div>
                      <h3 className="font-display font-bold text-slate-900 text-base">Weekly Availability</h3>
                      <p className="text-[10px] text-slate-400 mt-0.5">Consultation Days & Shifts</p>
                    </div>
                  </div>

                  {/* Available Days */}
                  <div className="space-y-3">
                    <p className="text-xs font-semibold text-slate-700">Days Active at WeCare:</p>
                    <div className="flex flex-wrap gap-1.5">
                      {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day) => {
                        const isAvailable = doctor.availability.includes(day);
                        return (
                          <span 
                            key={day}
                            className={`text-xs px-2.5 py-1 rounded-md font-medium ${
                              isAvailable 
                                ? 'bg-blue-500/10 text-blue-700 border border-blue-500/25' 
                                : 'bg-slate-200/50 text-slate-400 line-through'
                            }`}
                          >
                            {day.substring(0, 3)}
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  {/* Active Slots Info */}
                  <div className="space-y-3">
                    <p className="text-xs font-semibold text-slate-700">Daily Consultation Hours:</p>
                    <div className="grid grid-cols-2 gap-1.5">
                      {doctor.timeSlots.slice(0, 4).map((slot, i) => (
                        <div key={i} className="bg-white border border-slate-200 rounded-lg p-2 text-center text-xs text-slate-600 font-mono font-medium">
                          {slot}
                        </div>
                      ))}
                    </div>
                    <p className="text-[10px] text-slate-400 italic mt-1 text-center">Time slots can be explicitly selected in the scheduler portal.</p>
                  </div>

                  {/* Booking Trigger CTA */}
                  <button
                    id="doctor-profile-book-btn"
                    onClick={() => setPage('booking_portal', { doctorId: doctor.id, departmentId: doctor.departmentId })}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-blue-600/10"
                  >
                    <CalendarCheck className="w-5 h-5" />
                    Book Appointment Now
                  </button>

                </div>

              </div>

            </div>

          </div>
        </div>
      );
    }
  }

  // Render General Directory
  return (
    <div id="doctors-directory-page" className="bg-slate-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header Title */}
        <div className="max-w-3xl space-y-4">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
            Clinical Team
          </span>
          <h1 className="font-display font-bold text-4xl sm:text-5xl text-slate-950 tracking-tight leading-tight">
            Meet Our Senior Medical Consultants
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Search our elite directory of healthcare specialists. Use the text search or department filter to find clinicians specializing in your specific health symptoms.
          </p>
        </div>

        {/* Filters and Search Bar */}
        <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-xs space-y-4 md:space-y-0 md:flex md:gap-4 md:items-center">
          
          {/* Text Search Input */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search specialists by name, symptom, or credential..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-12 pr-4 text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-blue-500 focus:bg-white transition-all"
            />
          </div>

          {/* Department Selection Filter */}
          <div className="w-full md:w-72">
            <select
              value={selectedDepFilter}
              onChange={(e) => setSelectedDepFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm text-slate-800 focus:outline-hidden focus:border-blue-500 focus:bg-white transition-all"
            >
              <option value="all">All Departments (Specialties)</option>
              {DEPARTMENTS.map(dep => (
                <option key={dep.id} value={dep.id}>{dep.name}</option>
              ))}
            </select>
          </div>

        </div>

        {/* Directory List Grid */}
        {filteredDoctors.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredDoctors.map((doc) => {
              const docDep = DEPARTMENTS.find(d => d.id === doc.departmentId);
              return (
                <div 
                  key={doc.id} 
                  id={`doctor-card-${doc.id}`}
                  className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between"
                >
                  <div>
                    {/* Compact Portrait */}
                    <div className="relative aspect-square bg-slate-50 overflow-hidden border-b border-slate-100">
                      <img 
                        src={doc.image} 
                        alt={doc.name} 
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded-md text-[10px] font-bold text-slate-700 flex items-center gap-0.5 shadow-xs">
                        <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                        {doc.rating}
                      </div>
                    </div>

                    {/* Quick Bio Info */}
                    <div className="p-5 space-y-3">
                      <div>
                        <span className="text-[9px] font-mono tracking-wider font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-sm">
                          {docDep?.name || 'Specialist'}
                        </span>
                        <h4 className="font-display font-bold text-base text-slate-900 mt-2">{doc.name}</h4>
                        <p className="text-slate-400 text-xs font-medium leading-tight">{doc.specialty}</p>
                      </div>

                      <div className="text-[11px] text-slate-500 space-y-1 pt-2 border-t border-slate-50">
                        <p><span className="font-medium text-slate-600">Experience:</span> {doc.experienceYears} Years</p>
                        <p className="line-clamp-1"><span className="font-medium text-slate-600">Alma Mater:</span> {doc.education.split(',')[0]}</p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="p-5 pt-0 flex gap-2">
                    <button
                      onClick={() => handleSelectDoctor(doc.id)}
                      className="flex-1 border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs py-2 rounded-lg transition-colors cursor-pointer text-center"
                    >
                      Biography
                    </button>
                    <button
                      onClick={() => setPage('booking_portal', { doctorId: doc.id, departmentId: doc.departmentId })}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs py-2 rounded-lg transition-colors cursor-pointer text-center"
                    >
                      Book Now
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        ) : (
          /* Empty Search results state */
          <div className="bg-white rounded-3xl p-16 text-center border border-slate-100 max-w-xl mx-auto space-y-4">
            <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mx-auto">
              <HelpCircle className="w-8 h-8" />
            </div>
            <h3 className="font-display font-bold text-lg text-slate-900">No Specialist Clinicians Found</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              We couldn't find any medical consultants matching your current query. Try adjusting your spelling or selecting "All Departments" to see our full available staff.
            </p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedDepFilter('all'); }}
              className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:underline cursor-pointer"
            >
              Reset All Filters & Search
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
