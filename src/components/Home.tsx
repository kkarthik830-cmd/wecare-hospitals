import { ArrowRight, Star, Heart, Calendar, Clock, Award, Users, CheckCircle, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';
import { DEPARTMENTS, DOCTORS, STATS, TESTIMONIALS, FAQS } from '../data';
import LucideIcon from './LucideIcon';

interface HomeProps {
  setPage: (page: string, params?: { doctorId?: string; departmentId?: string }) => void;
}

export default function Home({ setPage }: HomeProps) {
  // Select top 3 departments to display
  const featuredDeps = DEPARTMENTS.slice(0, 3);
  // Select top 3 doctors to display
  const featuredDocs = DOCTORS.slice(0, 3);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
  };

  return (
    <div id="home-page" className="bg-slate-50 overflow-hidden">
      
      {/* 1. HERO SECTION */}
      <section id="hero" className="relative bg-gradient-to-br from-blue-700 via-blue-800 to-blue-950 text-white py-24 px-4 sm:px-6 lg:px-8 rounded-b-[2.5rem] shadow-xl">
        {/* Abstract Background Visuals */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-500/20 via-transparent to-transparent pointer-events-none"></div>
        <div className="absolute top-1/2 left-0 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Copy */}
            <motion.div 
              className="lg:col-span-7 space-y-8"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-400/30 px-3.5 py-1.5 rounded-full text-blue-200 text-xs font-semibold uppercase tracking-wider font-mono">
                <ShieldCheck className="w-4 h-4" />
                Trusted Healthcare Partner
              </div>
              
              <h1 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-[1.1] text-white">
                Compassionate Care, <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-teal-200">
                  Advanced Medicine.
                </span>
              </h1>
              
              <p className="text-blue-100/90 text-base sm:text-lg max-w-xl leading-relaxed">
                WeCare Hospitals brings together senior specialist doctors, advanced robotic diagnostics, and a nursing culture defined by profound patient empathy.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 pt-2">
                <button
                  id="hero-cta-book"
                  onClick={() => setPage('booking_portal')}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-7 py-4 rounded-xl shadow-lg shadow-emerald-500/20 transition-all duration-200 transform hover:-translate-y-0.5 inline-flex items-center gap-2 cursor-pointer focus:outline-hidden"
                >
                  <Calendar className="w-5 h-5" />
                  Book Appointment Now
                </button>
                <button
                  id="hero-cta-deps"
                  onClick={() => setPage('departments')}
                  className="bg-blue-800/80 hover:bg-blue-800 border border-blue-700 hover:border-blue-600 text-white font-medium px-7 py-4 rounded-xl transition-all duration-200 inline-flex items-center gap-2 cursor-pointer focus:outline-hidden"
                >
                  Explore Specialties
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Trust badges */}
              <div className="grid grid-cols-3 gap-6 pt-6 border-t border-blue-800/60">
                <div>
                  <p className="font-display font-extrabold text-2xl text-blue-300">100%</p>
                  <p className="text-xs text-blue-100/75 font-medium mt-0.5">HIPAA Compliant Data</p>
                </div>
                <div>
                  <p className="font-display font-extrabold text-2xl text-blue-300">24/7</p>
                  <p className="text-xs text-blue-100/75 font-medium mt-0.5">Emergency Triage</p>
                </div>
                <div>
                  <p className="font-display font-extrabold text-2xl text-blue-300">JCI</p>
                  <p className="text-xs text-blue-100/75 font-medium mt-0.5">Accredited Standard</p>
                </div>
              </div>

            </motion.div>

            {/* Right Column: Hero Image Mockup & Quick Access Widget */}
            <motion.div 
              className="lg:col-span-5"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="relative">
                {/* Visual Glow */}
                <div className="absolute -inset-1.5 bg-gradient-to-r from-blue-500 to-sky-400 rounded-3xl blur-md opacity-30"></div>
                
                <div className="relative bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6">
                  <div className="flex justify-between items-center pb-4 border-b border-slate-800">
                    <div>
                      <h3 className="font-display font-bold text-lg text-white">Find Care Fast</h3>
                      <p className="text-xs text-slate-400 mt-0.5">Direct scheduling with top professionals</p>
                    </div>
                    <span className="p-1.5 bg-blue-500/10 text-blue-400 rounded-lg text-xs font-mono font-bold">LIVE SLOTS</span>
                  </div>

                  {/* Feature Checklist */}
                  <div className="space-y-4">
                    <div className="flex items-start gap-3.5">
                      <div className="p-1 bg-blue-500/10 text-blue-400 rounded-md shrink-0 mt-0.5">
                        <CheckCircle className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-200">No Booking Fees</p>
                        <p className="text-xs text-slate-400">Zero additional fee for standard slots</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3.5">
                      <div className="p-1 bg-blue-500/10 text-blue-400 rounded-md shrink-0 mt-0.5">
                        <CheckCircle className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-200">Immediate Confirmation</p>
                        <p className="text-xs text-slate-400">Guaranteed calendar block on booking</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3.5">
                      <div className="p-1 bg-blue-500/10 text-blue-400 rounded-md shrink-0 mt-0.5">
                        <CheckCircle className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-200">24h Flexible Postponement</p>
                        <p className="text-xs text-slate-400">Reschedule through client dashboard</p>
                      </div>
                    </div>
                  </div>

                  <button
                    id="hero-widget-cta"
                    onClick={() => setPage('booking_portal')}
                    className="w-full bg-slate-850 hover:bg-blue-600 hover:text-white border border-slate-800 hover:border-blue-600 text-slate-200 font-semibold py-3.5 rounded-xl transition-all duration-300 text-sm flex items-center justify-center gap-2 cursor-pointer"
                  >
                    Launch Scheduler Triage
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* 2. STATS BANNER */}
      <section id="stats" className="relative -mt-8 z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8 sm:p-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {STATS.map((stat, i) => (
              <div key={stat.id} id={`stat-${stat.id}`} className={`flex items-center gap-4 ${i > 0 && 'sm:border-l sm:border-slate-100 sm:pl-8'}`}>
                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                  <LucideIcon name={stat.iconName} className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-display font-extrabold text-3xl text-slate-900 tracking-tight">{stat.value}</p>
                  <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mt-0.5">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. CORE HIGHLIGHTS / VALUE PROPOSITION */}
      <section id="features" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-blue-600">Why Choose WeCare</h2>
          <p className="font-display font-bold text-3xl sm:text-4xl text-slate-950 tracking-tight">
            Setting the Benchmark in Patient-Centered Medicine
          </p>
          <p className="text-slate-500 text-base sm:text-lg">
            We operate beyond standard diagnostics, offering high-fidelity specialty consultations and digital medical conveniences designed around modern life.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-xs hover:shadow-md transition-shadow duration-300 space-y-5">
            <div className="w-12 h-12 bg-red-50 text-red-600 rounded-xl flex items-center justify-center font-bold">
              <Heart className="w-6 h-6" />
            </div>
            <h3 className="font-display font-bold text-xl text-slate-900">24/7 Emergency Wing</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              Equipped with a trauma team, multi-channel ICU monitors, and active emergency cardiologists available at any second of the day.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-xs hover:shadow-md transition-shadow duration-300 space-y-5">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-bold">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="font-display font-bold text-xl text-slate-900">Elite Specialist Staff</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              Every clinician at WeCare holds senior credentials from leading medical institutes, ensuring deep mastery of complex cases.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-xs hover:shadow-md transition-shadow duration-300 space-y-5">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-bold">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="font-display font-bold text-xl text-slate-900">Patient-Centric Care</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              We design treatment pathways collaboratively, taking hours to understand concerns, explain options, and support rehabilitation journeys.
            </p>
          </div>
        </div>
      </section>

      {/* 4. CLINICAL SPECIALTIES GRID */}
      <section id="specialties" className="bg-white py-24 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16">
            <div className="space-y-4 max-w-2xl">
              <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-blue-600">Specialty Fields</h2>
              <h3 className="font-display font-bold text-3xl sm:text-4xl text-slate-950 tracking-tight">Our Premier Departments</h3>
              <p className="text-slate-500 text-sm sm:text-base">
                Discover specialized medicine segments. Select a department to view detailed therapeutic clinical procedures, diagnostic capabilities, and active experts.
              </p>
            </div>
            <button
              onClick={() => setPage('departments')}
              className="group inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 font-semibold text-sm transition-colors cursor-pointer shrink-0"
            >
              See All Departments
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredDeps.map((dep) => (
              <div 
                key={dep.id} 
                id={`featured-dep-${dep.id}`}
                className="bg-slate-50 hover:bg-slate-950 hover:text-white rounded-2xl p-8 border border-slate-100 hover:border-slate-900 transition-all duration-300 group flex flex-col justify-between h-80"
              >
                <div className="space-y-5">
                  <div className="w-12 h-12 bg-white text-blue-600 group-hover:bg-blue-600 group-hover:text-white rounded-xl flex items-center justify-center shadow-xs transition-colors duration-300">
                    <LucideIcon name={dep.iconName} className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-xl text-slate-955 group-hover:text-white transition-colors">
                      {dep.name}
                    </h4>
                    <p className="text-slate-500 group-hover:text-slate-400 text-sm mt-3.5 line-clamp-3 leading-relaxed">
                      {dep.shortDescription}
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={() => setPage('departments', { departmentId: dep.id })}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 group-hover:text-blue-400 hover:underline transition-all pt-4 cursor-pointer"
                >
                  View Services & Specialists
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 5. MEET OUR ELITE STAFF SECTION */}
      <section id="featured-doctors" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-blue-600">Clinical Leadership</h2>
          <p className="font-display font-bold text-3xl sm:text-4xl text-slate-950 tracking-tight">Meet Our Senior Specialist Doctors</p>
          <p className="text-slate-500 text-sm sm:text-base">
            Consult directly with clinical researchers, medical board leaders, and surgery chiefs dedicated to compassionate restoration.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredDocs.map((doc) => {
            const docDep = DEPARTMENTS.find(d => d.id === doc.departmentId);
            return (
              <div 
                key={doc.id} 
                id={`featured-doc-${doc.id}`}
                className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Portrait */}
                  <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
                    <img 
                      src={doc.image} 
                      alt={doc.name} 
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-lg text-xs font-semibold text-slate-900 flex items-center gap-1 shadow-xs">
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      {doc.rating}
                    </div>
                  </div>

                  {/* Body Info */}
                  <div className="p-6 space-y-4">
                    <div>
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">
                        {docDep?.name || doc.specialty}
                      </span>
                      <h4 className="font-display font-bold text-lg text-slate-900 mt-2.5">{doc.name}</h4>
                      <p className="text-slate-500 text-xs mt-0.5">{doc.specialty}</p>
                    </div>
                    <p className="text-slate-500 text-xs line-clamp-3 leading-relaxed italic">
                      "{doc.bio}"
                    </p>
                    <div className="pt-2 border-t border-slate-50 space-y-1.5 text-xs text-slate-500">
                      <p><span className="font-semibold text-slate-700">Exp:</span> {doc.experienceYears} Years Clinical Practice</p>
                      <p><span className="font-semibold text-slate-700">Alma Mater:</span> {doc.education.split(',')[0]}</p>
                    </div>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="p-6 pt-0 flex gap-3">
                  <button
                    onClick={() => setPage('doctors', { doctorId: doc.id })}
                    className="flex-1 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs py-2.5 rounded-xl transition-all cursor-pointer text-center"
                  >
                    View Biography
                  </button>
                  <button
                    onClick={() => setPage('booking_portal', { doctorId: doc.id, departmentId: doc.departmentId })}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs py-2.5 rounded-xl transition-all cursor-pointer text-center"
                  >
                    Quick Book
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <button
            onClick={() => setPage('doctors')}
            className="inline-flex items-center gap-2 border border-slate-300 hover:bg-slate-50 text-slate-800 font-bold text-sm px-6 py-3 rounded-xl transition-all cursor-pointer"
          >
            Browse Full Clinical Staff
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* 6. TESTIMONIALS SECTION */}
      <section id="testimonials" className="bg-slate-900 text-white py-24 relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-blue-950/20 via-transparent to-transparent pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-blue-400">Patient Experiences</h2>
            <h3 className="font-display font-bold text-3xl sm:text-4xl text-white tracking-tight">What Our Families Say</h3>
            <p className="text-slate-400 text-sm sm:text-base">
              The health of our patients is WeCare’s daily reward. Read real reviews from individuals who recovered under our custom-built therapy channels.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((test) => (
              <div 
                key={test.id} 
                id={`testimonial-card-${test.id}`}
                className="bg-slate-950/70 border border-slate-800/80 p-8 rounded-2xl flex flex-col justify-between space-y-6"
              >
                <div className="space-y-4">
                  <div className="flex gap-1 text-amber-500">
                    {Array.from({ length: test.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-500" />
                    ))}
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed italic">
                    "{test.content}"
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-white text-sm">{test.name}</h4>
                  <p className="text-slate-500 text-xs mt-0.5">{test.role}</p>
                  <p className="text-[10px] font-mono text-slate-600 mt-2">{test.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. QUICK FAQ ACCORDION BLOCK */}
      <section id="faqs" className="py-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-blue-600">Common Questions</h2>
          <h3 className="font-display font-bold text-3xl text-slate-950 tracking-tight">General Hospital FAQs</h3>
          <p className="text-slate-500 text-sm">
            Find immediate answers regarding booking procedures, clinical documentation requirements, and co-pay policies.
          </p>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, idx) => (
            <div key={idx} id={`faq-item-${idx}`} className="bg-white border border-slate-100 p-6 rounded-xl space-y-3">
              <h4 className="font-display font-semibold text-slate-900 text-base">{faq.q}</h4>
              <p className="text-slate-500 text-sm leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
