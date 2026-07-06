import { useState, useEffect, useRef } from 'react';
import { ArrowRight, Star, Heart, CheckCircle2, ShieldCheck, UserCheck } from 'lucide-react';
import { DEPARTMENTS, DOCTORS } from '../data';
import LucideIcon from './LucideIcon';

interface DepartmentsProps {
  initialDepartmentId?: string;
  setPage: (page: string, params?: { doctorId?: string; departmentId?: string }) => void;
}

export default function Departments({ initialDepartmentId, setPage }: DepartmentsProps) {
  // Use first department as default if none selected
  const [selectedDepId, setSelectedDepId] = useState<string>(
    initialDepartmentId && DEPARTMENTS.some(d => d.id === initialDepartmentId)
      ? initialDepartmentId
      : DEPARTMENTS[0].id
  );

  const detailPaneRef = useRef<HTMLDivElement>(null);

  // Sync state if initialDepartmentId prop changes
  useEffect(() => {
    if (initialDepartmentId && DEPARTMENTS.some(d => d.id === initialDepartmentId)) {
      setSelectedDepId(initialDepartmentId);
      // Scroll to detail pane for better focus on mobile
      if (window.innerWidth < 768) {
        detailPaneRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, [initialDepartmentId]);

  const selectedDep = DEPARTMENTS.find(d => d.id === selectedDepId) || DEPARTMENTS[0];
  const depDoctors = DOCTORS.filter(doc => doc.departmentId === selectedDepId);

  const handleDepSelect = (id: string) => {
    setSelectedDepId(id);
    if (detailPaneRef.current) {
      detailPaneRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div id="departments-page" className="bg-slate-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header Block */}
        <div className="max-w-3xl space-y-4">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
            Clinical Specialties
          </span>
          <h1 className="font-display font-bold text-4xl sm:text-5xl text-slate-950 tracking-tight leading-tight">
            Our Core Medical Departments
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            WeCare hosts specialized clinical centers designed to treat complex conditions. Select a department to explore our high-fidelity diagnostic procedures, treated conditions, and meet our board-certified experts.
          </p>
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Department Sidebar Selector */}
          <div id="departments-sidebar" className="lg:col-span-4 space-y-3">
            <h3 className="text-xs font-mono font-bold uppercase text-slate-400 tracking-wider px-3 mb-2">Select Specialty</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2.5">
              {DEPARTMENTS.map((dep) => {
                const isSelected = dep.id === selectedDepId;
                return (
                  <button
                    key={dep.id}
                    id={`sidebar-dep-${dep.id}`}
                    onClick={() => handleDepSelect(dep.id)}
                    className={`flex items-center gap-4 p-4 rounded-2xl border text-left cursor-pointer transition-all duration-200 focus:outline-hidden ${
                      isSelected
                        ? 'bg-slate-900 border-slate-900 text-white shadow-md'
                        : 'bg-white border-slate-100 hover:border-slate-200 text-slate-800'
                    }`}
                  >
                    <div className={`p-2.5 rounded-xl shrink-0 transition-colors duration-200 ${
                      isSelected 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-blue-50 text-blue-600'
                    }`}>
                      <LucideIcon name={dep.iconName} size={20} />
                    </div>
                    <div>
                      <h4 className="font-display font-bold text-sm leading-tight">{dep.name}</h4>
                      <p className={`text-[11px] mt-0.5 line-clamp-1 ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                        {dep.shortDescription}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Full Detail Pane */}
          <div 
            ref={detailPaneRef}
            id="department-detail-pane" 
            className="lg:col-span-8 bg-white border border-slate-100 rounded-3xl p-6 sm:p-10 shadow-xs space-y-10"
          >
            {/* Header of selected department */}
            <div className="flex items-start gap-4 pb-6 border-b border-slate-100">
              <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl shadow-xs">
                <LucideIcon name={selectedDep.iconName} size={32} />
              </div>
              <div>
                <span className="text-[10px] font-mono tracking-widest uppercase font-bold text-blue-600">Specialty Hub</span>
                <h2 className="font-display font-bold text-2xl sm:text-3xl text-slate-950 mt-1">{selectedDep.name} Department</h2>
              </div>
            </div>

            {/* Comprehensive Description */}
            <div className="space-y-4">
              <h3 className="font-display font-bold text-lg text-slate-900">Clinical Overview</h3>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                {selectedDep.fullDescription}
              </p>
            </div>

            {/* Grid of Services and Conditions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
              
              {/* Therapeutic Services */}
              <div className="space-y-4">
                <h4 className="font-display font-bold text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-blue-600" />
                  Clinical Services
                </h4>
                <ul className="space-y-2.5">
                  {selectedDep.services.map((serv, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-600">
                      <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                      <span>{serv}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Conditions Treated */}
              <div className="space-y-4">
                <h4 className="font-display font-bold text-slate-900 flex items-center gap-2">
                  <Heart className="w-5 h-5 text-blue-600" />
                  Conditions Treated
                </h4>
                <ul className="space-y-2.5">
                  {selectedDep.conditionsTreated.map((cond, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-600">
                      <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                      <span>{cond}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>

            {/* Associated Specialists */}
            <div className="pt-8 border-t border-slate-100 space-y-6">
              <div className="flex items-center gap-2.5">
                <UserCheck className="w-5 h-5 text-slate-900" />
                <h3 className="font-display font-bold text-xl text-slate-950">Active Department Specialists</h3>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {depDoctors.map((doc) => (
                  <div 
                    key={doc.id} 
                    id={`dep-doctor-${doc.id}`}
                    className="border border-slate-100 rounded-2xl p-5 hover:border-slate-200 hover:shadow-xs transition-all duration-200 flex flex-col justify-between"
                  >
                    <div className="space-y-4">
                      {/* Portrait & Core Info */}
                      <div className="flex items-center gap-4">
                        <img 
                          src={doc.image} 
                          alt={doc.name} 
                          referrerPolicy="no-referrer"
                          className="w-14 h-14 rounded-xl object-cover object-top shrink-0"
                        />
                        <div>
                          <h4 className="font-display font-bold text-base text-slate-900 leading-tight">{doc.name}</h4>
                          <p className="text-xs text-slate-500 mt-0.5">{doc.specialty}</p>
                          <div className="flex items-center gap-1 mt-1">
                            <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                            <span className="text-[11px] font-semibold text-slate-700">{doc.rating} ({doc.reviewsCount} reviews)</span>
                          </div>
                        </div>
                      </div>

                      {/* Brief Bio */}
                      <p className="text-slate-500 text-xs line-clamp-2 leading-relaxed">
                        {doc.bio}
                      </p>

                      {/* Small Credentials */}
                      <div className="text-[11px] text-slate-500 space-y-0.5 pt-2 border-t border-slate-50">
                        <p><span className="font-medium text-slate-700">Practice Exp:</span> {doc.experienceYears} Years</p>
                        <p className="line-clamp-1"><span className="font-medium text-slate-700">Languages:</span> {doc.languages.join(', ')}</p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="grid grid-cols-2 gap-2 mt-5">
                      <button
                        onClick={() => setPage('doctors', { doctorId: doc.id })}
                        className="text-center font-semibold text-[11px] py-2 border border-slate-200 hover:border-blue-200 hover:bg-slate-50 text-slate-700 rounded-lg cursor-pointer animate-none"
                      >
                        Profile & Bio
                      </button>
                      <button
                        onClick={() => setPage('booking_portal', { doctorId: doc.id, departmentId: selectedDep.id })}
                        className="text-center font-semibold text-[11px] py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg cursor-pointer"
                      >
                        Book Now
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
