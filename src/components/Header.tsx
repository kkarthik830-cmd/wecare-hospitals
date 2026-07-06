import { useState } from 'react';
import { Menu, X, CalendarCheck, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useFirebase } from './FirebaseContext';

interface HeaderProps {
  currentPage: string;
  setPage: (page: string) => void;
  activeBookingsCount: number;
}

export default function Header({ currentPage, setPage, activeBookingsCount }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logOut } = useFirebase();

  const isAdmin = user?.email === 'wecareteam@gmail.com';

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About Us' },
    { id: 'departments', label: 'Departments' },
    { id: 'doctors', label: 'Find a Doctor' },
    { id: 'bookings', label: 'My Bookings', badge: activeBookingsCount > 0 ? activeBookingsCount : undefined },
    ...(isAdmin ? [{ id: 'admin', label: 'Admin Portal' }] : [])
  ];

  const handleNavClick = (pageId: string) => {
    setPage(pageId);
    setIsOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header id="hospital-header" className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo Brand */}
          <button 
            id="brand-logo"
            onClick={() => handleNavClick('home')} 
            className="flex items-center space-x-3 group cursor-pointer text-left focus:outline-hidden"
          >
            <div className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center shadow-md shadow-blue-500/10 group-hover:scale-105 transition-transform duration-300">
              <Shield className="w-5 h-5" strokeWidth={2.5} />
            </div>
            <div>
              <span className="font-display font-bold text-xl tracking-tight text-blue-900">
                WeCare <span className="text-blue-600">Hospitals</span>
              </span>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav id="desktop-nav" className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  className={`relative px-4 py-2 rounded-xl text-sm font-medium transition-colors duration-200 cursor-pointer focus:outline-hidden ${
                    isActive 
                      ? 'text-blue-600 bg-blue-50/70' 
                      : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    {item.label}
                    {item.badge !== undefined && (
                      <span className="flex items-center justify-center w-5 h-5 text-[10px] font-bold text-white bg-blue-600 rounded-full animate-pulse">
                        {item.badge}
                      </span>
                    )}
                  </span>
                </button>
              );
            })}
          </nav>

          {/* Desktop Call To Action */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-2.5">
                <span className="text-[11px] font-mono font-bold tracking-tight text-blue-700 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100/50">
                  Hi, {user.displayName || 'Patient'}
                </span>
                <button
                  onClick={() => { logOut(); handleNavClick('home'); }}
                  className="text-xs font-bold text-slate-500 hover:text-blue-600 transition-colors cursor-pointer"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => handleNavClick('bookings')}
                className="text-xs font-bold text-slate-600 hover:text-blue-600 transition-colors cursor-pointer"
              >
                Sign In
              </button>
            )}
            <button
              id="cta-book-appointment"
              onClick={() => handleNavClick('booking_portal')}
              className="bg-blue-600 text-white px-5 py-2.5 rounded-full font-semibold hover:bg-blue-700 transition-colors shadow-sm inline-flex items-center gap-2 cursor-pointer focus:outline-hidden text-sm"
            >
              <CalendarCheck className="w-4 h-4" />
              Book Appointment
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              id="mobile-menu-toggle"
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 focus:outline-hidden cursor-pointer"
              aria-expanded="false"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Navigation Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="mobile-nav-panel"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="md:hidden border-b border-slate-100 bg-white"
          >
            <div className="px-4 pt-2 pb-6 space-y-2">
              {navItems.map((item) => {
                const isActive = currentPage === item.id;
                return (
                  <button
                    key={item.id}
                    id={`mobile-nav-${item.id}`}
                    onClick={() => handleNavClick(item.id)}
                    className={`flex items-center justify-between w-full text-left px-4 py-3 rounded-xl text-base font-medium cursor-pointer ${
                      isActive 
                        ? 'text-blue-600 bg-blue-50' 
                        : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'
                    }`}
                  >
                    <span>{item.label}</span>
                    {item.badge !== undefined && (
                      <span className="flex items-center justify-center px-2.5 py-0.5 text-xs font-bold text-white bg-blue-600 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
              <div className="pt-4 border-t border-slate-100 px-2 space-y-3">
                {user ? (
                  <div className="flex items-center justify-between px-3 text-xs text-slate-500">
                    <span className="font-semibold text-slate-800">Hi, {user.displayName || 'Patient'}</span>
                    <button 
                      onClick={() => { logOut(); setIsOpen(false); handleNavClick('home'); }}
                      className="text-blue-600 font-bold hover:underline cursor-pointer"
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <div className="px-1">
                    <button
                      onClick={() => handleNavClick('bookings')}
                      className="w-full text-center py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl font-bold text-xs cursor-pointer"
                    >
                      Sign In to Clinical Portal
                    </button>
                  </div>
                )}
                <button
                  id="mobile-cta-book-appointment"
                  onClick={() => handleNavClick('booking_portal')}
                  className="flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-full shadow-sm transition-colors duration-200 cursor-pointer text-sm font-semibold"
                >
                  <CalendarCheck className="w-5 h-5" />
                  Book Appointment
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
