import { Shield, Mail, Phone, MapPin, Clock } from 'lucide-react';

interface FooterProps {
  setPage: (page: string) => void;
}

export default function Footer({ setPage }: FooterProps) {
  const currentYear = new Date().getFullYear();

  const handleLinkClick = (pageId: string) => {
    setPage(pageId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="hospital-footer" className="bg-white text-slate-600 border-t border-slate-200 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand & Mission */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3 text-slate-900">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-sm">
                <Shield className="w-5 h-5" />
              </div>
              <span className="font-display font-bold text-2xl tracking-tight text-blue-900">
                WeCare <span className="text-blue-600">Hospitals</span>
              </span>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed">
              Serving our community with clinical excellence and gentle, patient-first compassion. Equipped with advanced medical technologies and senior healthcare experts.
            </p>
            <div className="border-l-2 border-blue-600 pl-4 py-1 bg-slate-50 rounded-r-lg pr-4">
              <p className="text-xs font-mono tracking-wider text-slate-400 uppercase font-bold">Emergency Service</p>
              <p className="font-display font-bold text-lg text-blue-900 mt-0.5">Call: +1 (800) 911-CARE</p>
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div>
            <h3 className="font-display font-bold text-slate-800 text-xs tracking-wider uppercase mb-6">Our Quick Links</h3>
            <ul className="space-y-3.5 text-sm">
              <li>
                <button 
                  onClick={() => handleLinkClick('home')} 
                  className="hover:text-blue-600 transition-colors duration-150 cursor-pointer focus:outline-hidden text-left"
                >
                  Home & Overview
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleLinkClick('about')} 
                  className="hover:text-blue-600 transition-colors duration-150 cursor-pointer focus:outline-hidden text-left"
                >
                  About Our Hospital
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleLinkClick('departments')} 
                  className="hover:text-blue-600 transition-colors duration-150 cursor-pointer focus:outline-hidden text-left"
                >
                  Medical Departments
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleLinkClick('doctors')} 
                  className="hover:text-blue-600 transition-colors duration-150 cursor-pointer focus:outline-hidden text-left"
                >
                  Meet Our Doctors
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleLinkClick('booking_portal')} 
                  className="hover:text-blue-600 transition-colors duration-150 cursor-pointer focus:outline-hidden text-left"
                >
                  Book an Appointment
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleLinkClick('admin')} 
                  className="hover:text-blue-600 font-medium text-blue-600/85 transition-colors duration-150 cursor-pointer focus:outline-hidden text-left flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                  Admin Staff Portal
                </button>
              </li>
            </ul>
          </div>

          {/* Working Hours */}
          <div>
            <h3 className="font-display font-bold text-slate-800 text-xs tracking-wider uppercase mb-6">Opening Hours</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-slate-800">Emergency Care</p>
                  <p className="text-xs text-slate-500 mt-0.5">Open 24 hours / 7 days</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-slate-800">Outpatient Services</p>
                  <p className="text-xs text-slate-500 mt-0.5">Mon - Sat: 8:00 AM - 8:00 PM</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-slate-800">Visiting Hours</p>
                  <p className="text-xs text-slate-500 mt-0.5">Daily: 10:00 AM - 8:00 PM</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="font-display font-bold text-slate-800 text-xs tracking-wider uppercase mb-6">Hospital Contacts</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <span className="text-slate-500 leading-relaxed">
                  120 Medical Center Parkway,<br />Suite 400, New York, NY 10023
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-blue-600 shrink-0" />
                <span className="text-slate-500">+1 (212) 555-0190</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-blue-600 shrink-0" />
                <span className="text-slate-500">support@wecarehospitals.com</span>
              </li>
            </ul>
            
            {/* Styled Mock Location */}
            <div className="mt-5 p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-2.5 h-2.5 bg-blue-600 rounded-full animate-ping"></div>
                <p className="text-xs font-semibold text-slate-700">Central Campus Plaza</p>
              </div>
              <span className="text-[10px] bg-slate-200 px-2 py-0.5 rounded text-slate-600 uppercase font-mono font-medium">Metro Access</span>
            </div>
          </div>

        </div>

        {/* Footer Base */}
        <div className="border-t border-slate-200 pt-8 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-400 gap-4">
          <div className="flex gap-6">
            <span>24/7 Helpline: <b>1-800-WECARE</b></span>
            <span>Emergency Care: <b>+1 (212) 555-0190</b></span>
          </div>
          <div className="flex gap-4 items-center">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span> 
              All systems operational
            </span>
            <span className="text-slate-300">|</span>
            <span>© {currentYear} WeCare Healthcare Group</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
