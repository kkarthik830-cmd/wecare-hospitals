import { ShieldAlert, Target, Heart, Award, Sparkles, Building, History, Check } from 'lucide-react';
import { motion } from 'motion/react';

export default function About() {
  const values = [
    {
      title: 'Compassion First',
      desc: 'We treat the person, not just the diagnosis. Every protocol is rooted in deep respect for patient comfort and mental peace.',
      icon: Heart,
      bg: 'bg-rose-50 text-rose-600'
    },
    {
      title: 'Surgical Precision',
      desc: 'Investing in robotic surgical controls, ultra-resolution MRI imaging, and sterile standards to guarantee clinical safety.',
      icon: Award,
      bg: 'bg-emerald-50 text-emerald-600'
    },
    {
      title: 'Absolute Transparency',
      desc: 'Honest medical advice, transparent co-pay estimations, and zero hidden billing items. Medical care should never cause stress.',
      icon: ShieldAlert,
      bg: 'bg-blue-50 text-blue-600'
    },
    {
      title: 'Medical Innovation',
      desc: 'Continuous engagement with global clinical research pipelines to incorporate emerging therapies into daily treatment options.',
      icon: Sparkles,
      bg: 'bg-purple-50 text-purple-600'
    }
  ];

  const milestones = [
    {
      year: '2008',
      title: 'Foundation Stone',
      desc: 'WeCare commenced outpatient care in a small clinic with 12 specialists and a single primary medicine ward.'
    },
    {
      year: '2013',
      title: 'Joint Commission International Accreditation',
      desc: 'Awarded JCI accreditation, verifying alignment with global safety benchmarks.'
    },
    {
      year: '2019',
      title: 'Advanced Robotic Surgery Wing',
      desc: 'Equipped state-of-the-art robotic surgery assistance modules for neurology and urology teams.'
    },
    {
      year: '2024',
      title: 'Cardiovascular Research Center',
      desc: 'Opened a dedicated 120-bed comprehensive cardiovascular department featuring modern imaging labs.'
    }
  ];

  return (
    <div id="about-page" className="bg-slate-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
        
        {/* Banner Section */}
        <section id="about-hero" className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
              Our Legacy
            </span>
            <h1 className="font-display font-bold text-4xl sm:text-5xl text-slate-950 tracking-tight leading-tight">
              A Legacy of Clinical Excellence and <span className="text-blue-600">Gentle Care</span>
            </h1>
            <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
              WeCare Hospitals was founded with a singular, clear vision: to create an oasis of medical healing that balances state-of-the-art surgical technology with traditional, compassionate patient care. Over the past 18 years, we have expanded to house over 85 elite consultants, treating over 150,000 patients with a success rate that makes us a trusted healthcare destination.
            </p>
            
            <div className="grid grid-cols-2 gap-6 pt-4">
              <div className="flex items-start gap-2">
                <div className="p-1 bg-blue-600 rounded-full text-white shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 text-sm">State-of-the-art Ward Care</h4>
                  <p className="text-xs text-slate-500">Equipped with automated nursing calls and high-fidelity ventilators</p>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <div className="p-1 bg-blue-600 rounded-full text-white shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 text-sm">24/7 ICU & Pharmacy</h4>
                  <p className="text-xs text-slate-500">Active emergency team support and clinical pharmacy access around the clock</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column decoration */}
          <div className="lg:col-span-5 relative">
            <div className="absolute -inset-2 bg-gradient-to-r from-blue-600 to-sky-400 rounded-3xl blur-md opacity-20"></div>
            <div className="relative bg-white border border-slate-100 rounded-3xl p-8 shadow-xl flex flex-col items-center justify-center text-center space-y-6 h-96">
              <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
                <Building className="w-10 h-10" />
              </div>
              <div>
                <h3 className="font-display font-extrabold text-3xl text-slate-950">18+ Years</h3>
                <p className="text-slate-500 text-xs tracking-wider uppercase mt-1">Preserving Life and Comfort</p>
              </div>
              <p className="text-sm text-slate-500 max-w-xs">
                Accredited by the Joint Commission International, WeCare has continuously achieved gold stars for diagnostic hygiene and record compliance.
              </p>
            </div>
          </div>
        </section>

        {/* Mission and Vision Grid */}
        <section id="mission-vision" className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-slate-900 text-white p-10 rounded-3xl border border-slate-800 shadow-md relative overflow-hidden space-y-5">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl pointer-events-none"></div>
            <div className="w-12 h-12 bg-blue-500/10 text-blue-400 rounded-xl flex items-center justify-center">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="font-display font-bold text-2xl">Our Vision</h3>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              To be the premier global healthcare center where advanced medical science and patient safety merge seamlessly. We aim to inspire hope and contribute to health and well-being by providing the best care to every patient through integrated clinical practice, education, and continuous medical research.
            </p>
          </div>

          <div className="bg-blue-50 p-10 rounded-3xl border border-blue-100/50 shadow-xs space-y-5">
            <div className="w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center">
              <Heart className="w-6 h-6" />
            </div>
            <h3 className="font-display font-bold text-2xl text-blue-950">Our Mission</h3>
            <p className="text-blue-900/80 text-sm sm:text-base leading-relaxed">
              WeCare is committed to providing outstanding, clinical quality healthcare. We aim to heal with empathy, maintain complete service transparency, and treat every family member who enters our doors as our own. We continuously invest in our personnel, technology, and clinical guidelines to ensure safe, comfortable healing.
            </p>
          </div>
        </section>

        {/* Core Values Section */}
        <section id="values" className="space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-blue-600">The Principles of WeCare</h2>
            <h3 className="font-display font-bold text-3xl text-slate-950 tracking-tight">Our Core Values</h3>
            <p className="text-slate-500 text-sm">
              We live by these pillars every single day, keeping our focus centered where it belongs: on the safe, comfortable recovery of our patients.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((val, idx) => {
              const Icon = val.icon;
              return (
                <div key={idx} className="bg-white p-8 rounded-2xl border border-slate-100 shadow-xs space-y-5 hover:shadow-md transition-all duration-300">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${val.bg}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h4 className="font-display font-bold text-lg text-slate-950">{val.title}</h4>
                  <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">{val.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Interactive Timeline Section */}
        <section id="timeline" className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-100 shadow-xs space-y-12">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-2xl text-slate-950 tracking-tight">Our Historical Milestones</h3>
              <p className="text-xs text-slate-400 mt-0.5">The timeline of clinical progress and expansion</p>
            </div>
          </div>

          <div className="relative border-l border-slate-100 pl-6 sm:pl-8 space-y-10">
            {milestones.map((stone, idx) => (
              <div key={idx} className="relative group">
                {/* Year Badge Indicator */}
                <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 bg-white border-2 border-blue-600 rounded-full group-hover:scale-125 transition-transform duration-200"></div>
                
                <div className="space-y-1">
                  <span className="text-xs font-mono font-bold text-blue-600">{stone.year}</span>
                  <h4 className="font-display font-bold text-lg text-slate-900">{stone.title}</h4>
                  <p className="text-slate-500 text-sm max-w-2xl leading-relaxed">{stone.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
