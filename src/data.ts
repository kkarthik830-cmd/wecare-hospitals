import { Department, Doctor, Testimonial, HospitalStat } from './types';

export const DEPARTMENTS: Department[] = [
  {
    id: 'cardiology',
    name: 'Cardiology',
    iconName: 'Heart',
    shortDescription: 'Comprehensive cardiovascular care including diagnostics, interventional cardiology, and rehabilitation.',
    fullDescription: 'Our Cardiology Department is equipped with cutting-edge technologies to provide full-spectrum heart care. From preventive health assessments to complex coronary interventions and heart failure management, our dedicated cardiac specialists work around the clock to keep your heart healthy.',
    services: [
      'Electrocardiogram (ECG) & Stress Testing',
      'Echocardiography (2D & 3D Echo)',
      'Cardiac Catheterization & Angioplasty',
      'Pacemaker and ICD Implantation',
      'Hypertension & Cholesterol Management',
      'Cardiac Rehabilitation Programs'
    ],
    conditionsTreated: [
      'Coronary Artery Disease',
      'Heart Failure & Arrhythmia',
      'Congenital Heart Defects',
      'Valvular Heart Disease',
      'Pericarditis & Myocarditis'
    ]
  },
  {
    id: 'neurology',
    name: 'Neurology',
    iconName: 'Brain',
    shortDescription: 'Advanced treatment for disorders of the nervous system, brain, spinal cord, and nerves.',
    fullDescription: 'WeCare Neurology provides expert evaluation and compassionate treatment for complex neurological conditions. Utilizing advanced neuro-imaging, neuro-physiology, and collaborative therapy approaches, our team works to restore nerve and cognitive function for a better quality of life.',
    services: [
      'Electroencephalogram (EEG)',
      'Electromyography (EMG) & Nerve Conduction Study',
      'Stroke Emergency Response & Care',
      'Chronic Pain Management',
      'Sleep Studies & Disorders Treatment',
      'Neuromuscular Consultations'
    ],
    conditionsTreated: [
      'Alzheimer\'s & Parkinson\'s Diseases',
      'Epilepsy & Seizure Disorders',
      'Migraines & Severe Headaches',
      'Multiple Sclerosis',
      'Stroke & Transient Ischemic Attacks (TIA)'
    ]
  },
  {
    id: 'pediatrics',
    name: 'Pediatrics',
    iconName: 'Baby',
    shortDescription: 'Specialized healthcare from infancy to adolescence, prioritizing growth, development, and preventive wellness.',
    fullDescription: 'Our Pediatrics Department offers warm, child-friendly care designed to make kids and parents feel at ease. We specialize in regular developmental checks, complete pediatric vaccination series, pediatric acute illnesses, and emotional-behavioral growth milestones, ensuring a bright, healthy future.',
    services: [
      'Newborn Care & Well-Baby Examinations',
      'Pediatric Immunization Programs',
      'Growth & Development Monitoring',
      'Pediatric Allergy & Asthma Care',
      'Childhood Nutrition Counseling',
      'Adolescent Health Consultations'
    ],
    conditionsTreated: [
      'Childhood Infectious Diseases',
      'Allergic Rhinitis & Asthma',
      'Juvenile Diabetes',
      'Developmental Delays & ADHD',
      'Pediatric Digestive Disorders'
    ]
  },
  {
    id: 'orthopedics',
    name: 'Orthopedics',
    iconName: 'Activity',
    shortDescription: 'Expert care for bones, joints, ligaments, tendons, and muscles including spine surgery and joint replacement.',
    fullDescription: 'Our Orthopedics and Traumatology team provides complete physical and surgical care for musculoskeletal disorders. Whether you are dealing with a sports injury, severe arthritis, bone fracture, or degenerative spine condition, we apply modern minimally invasive procedures to help you move pain-free.',
    services: [
      'Total Knee & Hip Replacements',
      'Arthroscopic Joint Surgery',
      'Sports Medicine & Ligament Reconstruction',
      'Spine Surgery & Disc Care',
      'Fracture Care & Trauma Management',
      'Osteoarthritis Management Plans'
    ],
    conditionsTreated: [
      'Osteoarthritis & Rheumatoid Arthritis',
      'Bone Fractures & Dislocations',
      'Tendonitis & Ligament Tears (ACL/MCL)',
      'Herniated Discs & Sciatica',
      'Carpal Tunnel Syndrome'
    ]
  },
  {
    id: 'dermatology',
    name: 'Dermatology',
    iconName: 'Sparkles',
    shortDescription: 'Clinical and cosmetic care for healthy skin, hair, nails, and comprehensive treatment for skin diseases.',
    fullDescription: 'Our Dermatology Department covers both medical and aesthetic skin concerns. From managing chronic skin conditions like eczema or psoriasis to skin cancer screening and advanced laser therapies, our board-certified dermatologists protect your body\'s largest organ.',
    services: [
      'Comprehensive Skin Cancer Screenings',
      'Eczema & Psoriasis Management',
      'Acne & Scar Laser Treatment',
      'Mole Removal & Biopsies',
      'Cryotherapy for Skin Lesions',
      'Cosmetic Anti-Aging Consultations'
    ],
    conditionsTreated: [
      'Severe Acne & Rosacea',
      'Atopic Dermatitis (Eczema)',
      'Psoriasis',
      'Alopecia (Hair Loss)',
      'Skin Infections & Melanoma'
    ]
  },
  {
    id: 'general_medicine',
    name: 'General Medicine',
    iconName: 'Stethoscope',
    shortDescription: 'Primary care, annual check-ups, preventive health counseling, and management of chronic conditions.',
    fullDescription: 'General Medicine is the cornerstone of patient care at WeCare. Our highly skilled primary care physicians provide preventive screenings, diagnose complex systemic illnesses, and coordinate inter-disciplinary specialized care, acting as your lifetime health partner.',
    services: [
      'Annual Wellness Exams & Screenings',
      'Chronic Disease Management (Diabetes, Hypertension)',
      'Adult Vaccinations & Travel Health',
      'Acute Illness Diagnostics (Flu, Infections)',
      'Lifestyle & Weight Management Coaching',
      'Comprehensive Blood Panel Screenings'
    ],
    conditionsTreated: [
      'Type 2 Diabetes',
      'Essential Hypertension',
      'Respiratory Tract Infections',
      'Gastrointestinal Issues',
      'Anemia & Thyroid Disorders'
    ]
  }
];

export const DOCTORS: Doctor[] = [
  {
    id: 'dr_sarah_jenkins',
    name: 'Dr. Sarah Jenkins',
    specialty: 'Senior Interventional Cardiologist',
    departmentId: 'cardiology',
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400',
    rating: 4.9,
    reviewsCount: 312,
    education: 'MD - Harvard Medical School, Residency in Cardiology - Johns Hopkins Hospital',
    experienceYears: 16,
    languages: ['English', 'Spanish'],
    bio: 'Dr. Sarah Jenkins is an award-winning interventional cardiologist with over 15 years of experience in performing minimally invasive catheter procedures. She is deeply passionate about preventive cardiology and empowering patients to build healthy habits to avoid cardiovascular disease.',
    availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday'],
    timeSlots: ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM'],
    gender: 'Female'
  },
  {
    id: 'dr_marcus_vance',
    name: 'Dr. Marcus Vance',
    specialty: 'Clinical Cardiologist & Arrhythmia Specialist',
    departmentId: 'cardiology',
    image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400',
    rating: 4.8,
    reviewsCount: 198,
    education: 'MD - Columbia University, Fellowship in Electrophysiology - Stanford Medicine',
    experienceYears: 12,
    languages: ['English', 'French'],
    bio: 'Dr. Marcus Vance specializes in heart rhythm disorders, diagnostic imaging, and pacing therapies. He brings a precise, analytical approach combined with a warm bedside manner to treat chronic heart failure and complex cardiac abnormalities.',
    availability: ['Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    timeSlots: ['09:30 AM', '10:30 AM', '11:30 AM', '01:30 PM', '02:30 PM', '03:30 PM'],
    gender: 'Male'
  },
  {
    id: 'dr_elena_rodriguez',
    name: 'Dr. Elena Rodriguez',
    specialty: 'Pediatric Neurologist',
    departmentId: 'neurology',
    image: 'https://images.unsplash.com/photo-1594824813573-246434de83fb?auto=format&fit=crop&q=80&w=400',
    rating: 4.9,
    reviewsCount: 245,
    education: 'MD - Stanford University School of Medicine, Pediatric Residency - Seattle Children\'s Hospital',
    experienceYears: 14,
    languages: ['English', 'Spanish', 'Portuguese'],
    bio: 'Dr. Elena Rodriguez is double-certified in Neurology and Pediatrics. She specializes in pediatric epilepsy, migraine management, and neurodevelopmental assessments. She is dedicated to tailoring care plans that accommodate a child\'s unique lifestyle and family environment.',
    availability: ['Monday', 'Wednesday', 'Friday'],
    timeSlots: ['09:00 AM', '10:00 AM', '11:00 AM', '01:00 PM', '02:00 PM', '03:00 PM'],
    gender: 'Female'
  },
  {
    id: 'dr_jonathan_wu',
    name: 'Dr. Jonathan Wu',
    specialty: 'Neurosurgeon & Spine Specialist',
    departmentId: 'neurology',
    image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=400',
    rating: 4.7,
    reviewsCount: 156,
    education: 'MD - Yale School of Medicine, Neurosurgery Residency - Mayo Clinic',
    experienceYears: 18,
    languages: ['English', 'Mandarin'],
    bio: 'Dr. Jonathan Wu is a renowned neurosurgeon with a focus on advanced minimally invasive spinal fusion, brain tumor resections, and nerve compression treatments. He combines surgical precision with a highly communicative, transparent patient pathway.',
    availability: ['Monday', 'Tuesday', 'Thursday'],
    timeSlots: ['08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM'],
    gender: 'Male'
  },
  {
    id: 'dr_lisa_patel',
    name: 'Dr. Lisa Patel',
    specialty: 'Consultant Pediatrician',
    departmentId: 'pediatrics',
    image: 'https://images.unsplash.com/photo-1527613426441-4da17471b66d?auto=format&fit=crop&q=80&w=400',
    rating: 4.9,
    reviewsCount: 420,
    education: 'MD - Perelman School of Medicine (UPenn), Residency - Children\'s Hospital of Philadelphia',
    experienceYears: 10,
    languages: ['English', 'Gujarati', 'Hindi'],
    bio: 'Dr. Lisa Patel has been caring for kids and counsel parents for a decade. Known for her infectious laugh and soothing demeanor, she specializes in developmental pediatrics, childhood nutrition, and asthma management, making clinic visits fun.',
    availability: ['Monday', 'Tuesday', 'Thursday', 'Friday'],
    timeSlots: ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM'],
    gender: 'Female'
  },
  {
    id: 'dr_james_carter',
    name: 'Dr. James Carter',
    specialty: 'Sports Medicine & Joint Reconstruction Specialist',
    departmentId: 'orthopedics',
    image: 'https://images.unsplash.com/photo-1622902046580-2b47f47f0471?auto=format&fit=crop&q=80&w=400',
    rating: 4.8,
    reviewsCount: 289,
    education: 'MD - University of Michigan Medical School, Orthopedic Fellowship - Hospital for Special Surgery (NYC)',
    experienceYears: 15,
    languages: ['English'],
    bio: 'Dr. James Carter is an expert in reconstructive joint surgery and sports injury treatments. He has served as a consulting doctor for collegiate sports teams and utilizes progressive, non-surgical therapies alongside cutting-edge arthroscopic techniques.',
    availability: ['Tuesday', 'Wednesday', 'Friday'],
    timeSlots: ['09:00 AM', '10:00 AM', '11:00 AM', '01:30 PM', '02:30 PM', '03:30 PM', '04:30 PM'],
    gender: 'Male'
  },
  {
    id: 'dr_clara_montgomery',
    name: 'Dr. Clara Montgomery',
    specialty: 'Clinical & Cosmetic Dermatologist',
    departmentId: 'dermatology',
    image: 'https://images.unsplash.com/photo-1614608682850-e0d6ed316d47?auto=format&fit=crop&q=80&w=400',
    rating: 4.9,
    reviewsCount: 335,
    education: 'MD - NYU Grossman School of Medicine, Residency in Dermatology - Ronald Reagan UCLA Medical Center',
    experienceYears: 11,
    languages: ['English', 'German'],
    bio: 'Dr. Clara Montgomery is highly regarded for her academic research in acne solutions and clinical excellence in complex skin pathologies. She offers dedicated consultation in laser therapeutics, scar treatments, and general adult dermatology.',
    availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday'],
    timeSlots: ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM'],
    gender: 'Female'
  },
  {
    id: 'dr_robert_chen',
    name: 'Dr. Robert Chen',
    specialty: 'Consultant General Physician',
    departmentId: 'general_medicine',
    image: 'https://images.unsplash.com/photo-1550831107-1553da8cbd6a?auto=format&fit=crop&q=80&w=400',
    rating: 4.8,
    reviewsCount: 512,
    education: 'MD - Chicago Medical School, Residency in Internal Medicine - Northwestern Memorial Hospital',
    experienceYears: 20,
    languages: ['English', 'Mandarin'],
    bio: 'Dr. Robert Chen is WeCare\'s lead General Medicine practitioner. With 20 years of experience managing complex multi-system disorders, hypertension, and diabetes, his diagnostic insight is trusted by families across the region.',
    availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    timeSlots: ['08:30 AM', '09:30 AM', '10:30 AM', '11:30 AM', '02:00 PM', '03:00 PM', '04:00 PM'],
    gender: 'Male'
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 'test_1',
    name: 'Eleanor Vance',
    role: 'Cardiology Patient',
    content: 'Dr. Sarah Jenkins and the nursing team were exceptional. They made me feel completely secure before and after my angioplasty. I cannot recommend WeCare enough!',
    rating: 5,
    date: 'June 14, 2026'
  },
  {
    id: 'test_2',
    name: 'Michael Miller',
    role: 'Parent of Pediatric Patient',
    content: 'We take both our boys to Dr. Lisa Patel. She is incredibly warm and knows exactly how to keep young kids calm and laughing. The booking system was seamless.',
    rating: 5,
    date: 'May 28, 2026'
  },
  {
    id: 'test_3',
    name: 'Gabriela Silva',
    role: 'Orthopedic Patient',
    content: 'Recovering from my ACL tear felt like a mountain, but Dr. Carter\'s expertise and detailed rehab program got me back on the field sooner than expected.',
    rating: 5,
    date: 'April 10, 2026'
  }
];

export const STATS: HospitalStat[] = [
  { id: 'patients', label: 'Satisfied Patients', value: '150k+', iconName: 'Users' },
  { id: 'doctors', label: 'Specialist Doctors', value: '85+', iconName: 'UserCheck' },
  { id: 'beds', label: 'Modern Hospital Beds', value: '350+', iconName: 'Bed' },
  { id: 'years', label: 'Years of Excellence', value: '18+', iconName: 'Award' }
];

export const FAQS = [
  {
    q: 'How do I schedule an online appointment?',
    a: 'Simply click any "Book Appointment" button on our website, select your clinical department and doctor, pick an available date and time slot, and fill in your details. You will receive an instant confirmation which is also displayed in the "My Bookings" section.'
  },
  {
    q: 'What should I bring to my first appointment?',
    a: 'Please bring a valid photo ID, your insurance card, list of current medications, and any recent laboratory results or medical imaging reports related to your condition.'
  },
  {
    q: 'Do you accept international or local health insurance?',
    a: 'Yes, WeCare is partnered with over 30 major insurance providers. In the booking panel, you can select your provider to assist with direct billing and co-pay calculations.'
  },
  {
    q: 'What is your cancellation policy?',
    a: 'We understand schedules change. You can cancel or reschedule your appointment at any time up to 2 hours prior to your slot directly through the "My Bookings" portal on our website without any fee.'
  },
  {
    q: 'Are visiting hours restricted?',
    a: 'In general inpatient wards, visiting hours are from 10:00 AM to 08:00 PM daily. Special care units like Intensive Care Units (ICU) have separate clinical visiting schedules. Please check at our front desk.'
  }
];
