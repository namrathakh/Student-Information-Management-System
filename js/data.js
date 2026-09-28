/**
 * EduPulse SIMS - Initial Database & Sample Dataset
 * High-fidelity academic dataset representing university students, courses, grades & attendance
 */

const DEFAULT_DEPARTMENTS = [
  { id: 'CSE', name: 'Computer Science & Engineering', code: 'CS', hod: 'Dr. Sarah Jenkins' },
  { id: 'AIDS', name: 'Artificial Intelligence & Data Science', code: 'AI', hod: 'Dr. Ramesh Sundaram' },
  { id: 'ECE', name: 'Electronics & Communication Eng.', code: 'EC', hod: 'Dr. Elena Rostova' },
  { id: 'MECH', name: 'Mechanical & Robotics Engineering', code: 'ME', hod: 'Prof. David Vance' }
];

const DEFAULT_COURSES = [
  { code: 'CS301', title: 'Data Structures & Algorithms', credits: 4, dept: 'CSE', semester: 5, instructor: 'Dr. Sarah Jenkins' },
  { code: 'CS302', title: 'Database Management Systems', credits: 4, dept: 'CSE', semester: 5, instructor: 'Prof. Michael Chang' },
  { code: 'CS303', title: 'Operating Systems & Concurrency', credits: 3, dept: 'CSE', semester: 5, instructor: 'Dr. Rajesh Nair' },
  { code: 'AI401', title: 'Deep Learning & Neural Architectures', credits: 4, dept: 'AIDS', semester: 7, instructor: 'Dr. Ramesh Sundaram' },
  { code: 'AI402', title: 'Natural Language Processing & LLMs', credits: 3, dept: 'AIDS', semester: 7, instructor: 'Dr. Emily Watson' },
  { code: 'AI301', title: 'Foundations of Machine Learning', credits: 4, dept: 'AIDS', semester: 5, instructor: 'Prof. Ananya Roy' },
  { code: 'EC201', title: 'Digital Signal Processing', credits: 4, dept: 'ECE', semester: 3, instructor: 'Dr. Elena Rostova' },
  { code: 'EC302', title: 'Embedded Systems & IoT Protocols', credits: 3, dept: 'ECE', semester: 5, instructor: 'Prof. Vikram Joshi' },
  { code: 'ME201', title: 'Thermodynamics & Heat Transfer', credits: 4, dept: 'MECH', semester: 3, instructor: 'Prof. David Vance' },
  { code: 'ME304', title: 'Robotics Kinematics & Automation', credits: 4, dept: 'MECH', semester: 5, instructor: 'Dr. Marcus Webb' }
];

const DEFAULT_STUDENTS = [
  {
    id: 'STU-1001',
    rollNo: '2023CSE101',
    name: 'Aarav Sharma',
    email: 'aarav.sharma@aurainst.edu',
    phone: '+91 98450 12345',
    gender: 'Male',
    dob: '2004-03-15',
    bloodGroup: 'O+',
    avatarBg: '#3b82f6',
    department: 'CSE',
    semester: 5,
    academicYear: '2023-2027',
    cgpa: 9.42,
    attendance: 94.5,
    feeStatus: 'Paid',
    feeDue: 0,
    academicStanding: 'Dean\'s List',
    mentor: 'Dr. Sarah Jenkins',
    address: '42 Orchid Heights, Tech Zone, Bengaluru, KA',
    guardian: { name: 'Sanjay Sharma', phone: '+91 98450 99881', relation: 'Father' },
    courses: [
      { code: 'CS301', title: 'Data Structures & Algorithms', credits: 4, grade: 'O', gradePoint: 10, attendance: 96, internal: 48, final: 49 },
      { code: 'CS302', title: 'Database Management Systems', credits: 4, grade: 'A+', gradePoint: 9, attendance: 92, internal: 45, final: 47 },
      { code: 'CS303', title: 'Operating Systems & Concurrency', credits: 3, grade: 'O', gradePoint: 10, attendance: 95, internal: 49, final: 48 }
    ],
    semesterHistory: [
      { semester: 'Sem 1', sgpa: 9.10, credits: 22 },
      { semester: 'Sem 2', sgpa: 9.35, credits: 24 },
      { semester: 'Sem 3', sgpa: 9.50, credits: 22 },
      { semester: 'Sem 4', sgpa: 9.60, credits: 24 },
      { semester: 'Sem 5', sgpa: 9.55, credits: 20 }
    ],
    remarks: 'Nominated for ACM Collegiate Hackathon finalist. Outstanding researcher.',
    achievements: ['Gold Medalist Sem 3', 'Lead Coordinator - Open Source Lab']
  },
  {
    id: 'STU-1002',
    rollNo: '2023AIDS204',
    name: 'Priya Iyer',
    email: 'priya.iyer@aurainst.edu',
    phone: '+91 98112 45678',
    gender: 'Female',
    dob: '2004-07-22',
    bloodGroup: 'B+',
    avatarBg: '#8b5cf6',
    department: 'AIDS',
    semester: 7,
    academicYear: '2022-2026',
    cgpa: 9.78,
    attendance: 98.0,
    feeStatus: 'Paid',
    feeDue: 0,
    academicStanding: 'Dean\'s List',
    mentor: 'Dr. Ramesh Sundaram',
    address: '104 Lotus Villa, Indiranagar, Bengaluru, KA',
    guardian: { name: 'K. S. Iyer', phone: '+91 98112 88776', relation: 'Father' },
    courses: [
      { code: 'AI401', title: 'Deep Learning & Neural Architectures', credits: 4, grade: 'O', gradePoint: 10, attendance: 100, internal: 50, final: 49 },
      { code: 'AI402', title: 'Natural Language Processing & LLMs', credits: 3, grade: 'O', gradePoint: 10, attendance: 97, internal: 49, final: 50 }
    ],
    semesterHistory: [
      { semester: 'Sem 1', sgpa: 9.60, credits: 22 },
      { semester: 'Sem 2', sgpa: 9.80, credits: 24 },
      { semester: 'Sem 3', sgpa: 9.75, credits: 22 },
      { semester: 'Sem 4', sgpa: 9.85, credits: 24 },
      { semester: 'Sem 5', sgpa: 9.70, credits: 22 },
      { semester: 'Sem 6', sgpa: 9.90, credits: 24 },
      { semester: 'Sem 7', sgpa: 9.80, credits: 20 }
    ],
    remarks: 'Published paper in IEEE AI Symposium on Transformer Efficiency.',
    achievements: ['Institute Rank 1 (Sem 6)', 'Google Summer of Code Scholar']
  },
  {
    id: 'STU-1003',
    rollNo: '2023CSE108',
    name: 'Rohan Deshmukh',
    email: 'rohan.d@aurainst.edu',
    phone: '+91 97654 33221',
    gender: 'Male',
    dob: '2004-11-09',
    bloodGroup: 'A+',
    avatarBg: '#ec4899',
    department: 'CSE',
    semester: 5,
    academicYear: '2023-2027',
    cgpa: 6.84,
    attendance: 68.2, // Critical Low
    feeStatus: 'Partial',
    feeDue: 25000,
    academicStanding: 'Probation Risk',
    mentor: 'Prof. Michael Chang',
    address: '77 Shivaji Marg, Pune, MH',
    guardian: { name: 'Anil Deshmukh', phone: '+91 97654 99110', relation: 'Father' },
    courses: [
      { code: 'CS301', title: 'Data Structures & Algorithms', credits: 4, grade: 'C', gradePoint: 6, attendance: 65, internal: 28, final: 32 },
      { code: 'CS302', title: 'Database Management Systems', credits: 4, grade: 'B', gradePoint: 7, attendance: 70, internal: 34, final: 36 },
      { code: 'CS303', title: 'Operating Systems & Concurrency', credits: 3, grade: 'C', gradePoint: 6, attendance: 69, internal: 30, final: 31 }
    ],
    semesterHistory: [
      { semester: 'Sem 1', sgpa: 7.20, credits: 22 },
      { semester: 'Sem 2', sgpa: 7.00, credits: 24 },
      { semester: 'Sem 3', sgpa: 6.60, credits: 22 },
      { semester: 'Sem 4', sgpa: 6.55, credits: 24 }
    ],
    remarks: 'Attendance warning letter #2 issued. Mentor counseling scheduled.',
    achievements: ['Captain - University Badminton Squad']
  },
  {
    id: 'STU-1004',
    rollNo: '2024ECE115',
    name: 'Ananya Verma',
    email: 'ananya.verma@aurainst.edu',
    phone: '+91 99230 87654',
    gender: 'Female',
    dob: '2005-02-18',
    bloodGroup: 'AB+',
    avatarBg: '#10b981',
    department: 'ECE',
    semester: 3,
    academicYear: '2024-2028',
    cgpa: 8.75,
    attendance: 91.0,
    feeStatus: 'Paid',
    feeDue: 0,
    academicStanding: 'Good Standing',
    mentor: 'Dr. Elena Rostova',
    address: '22 Civil Lines, Jaipur, RJ',
    guardian: { name: 'Sunita Verma', phone: '+91 99230 11223', relation: 'Mother' },
    courses: [
      { code: 'EC201', title: 'Digital Signal Processing', credits: 4, grade: 'A', gradePoint: 8, attendance: 90, internal: 42, final: 44 },
      { code: 'CS301', title: 'Data Structures & Algorithms', credits: 4, grade: 'A+', gradePoint: 9, attendance: 93, internal: 46, final: 45 }
    ],
    semesterHistory: [
      { semester: 'Sem 1', sgpa: 8.60, credits: 22 },
      { semester: 'Sem 2', sgpa: 8.90, credits: 24 }
    ],
    remarks: 'Enthusiastic robotics club contributor. High participation in labs.',
    achievements: ['1st Place - State Level Embedded Hardware Expo']
  },
  {
    id: 'STU-1005',
    rollNo: '2024MECH201',
    name: 'Kavya Patel',
    email: 'kavya.p@aurainst.edu',
    phone: '+91 98980 44332',
    gender: 'Female',
    dob: '2005-06-30',
    bloodGroup: 'O-',
    avatarBg: '#f59e0b',
    department: 'MECH',
    semester: 3,
    academicYear: '2024-2028',
    cgpa: 8.92,
    attendance: 93.4,
    feeStatus: 'Paid',
    feeDue: 0,
    academicStanding: 'Good Standing',
    mentor: 'Prof. David Vance',
    address: '502 Navrang Towers, Ahmedabad, GJ',
    guardian: { name: 'Rajesh Patel', phone: '+91 98980 77889', relation: 'Father' },
    courses: [
      { code: 'ME201', title: 'Thermodynamics & Heat Transfer', credits: 4, grade: 'A+', gradePoint: 9, attendance: 94, internal: 46, final: 47 }
    ],
    semesterHistory: [
      { semester: 'Sem 1', sgpa: 8.80, credits: 22 },
      { semester: 'Sem 2', sgpa: 9.05, credits: 24 }
    ],
    remarks: 'Formula Student SAE Chassis design team leader.',
    achievements: ['Best CAD Modeling Award 2025']
  },
  {
    id: 'STU-1006',
    rollNo: '2023AIDS210',
    name: 'Arjun Nambiar',
    email: 'arjun.n@aurainst.edu',
    phone: '+91 94471 22334',
    gender: 'Male',
    dob: '2004-09-05',
    bloodGroup: 'A-',
    avatarBg: '#06b6d4',
    department: 'AIDS',
    semester: 5,
    academicYear: '2023-2027',
    cgpa: 8.35,
    attendance: 87.5,
    feeStatus: 'Paid',
    feeDue: 0,
    academicStanding: 'Good Standing',
    mentor: 'Prof. Ananya Roy',
    address: '15 Marine Drive, Kochi, KL',
    guardian: { name: 'Gopal Nambiar', phone: '+91 94471 99001', relation: 'Father' },
    courses: [
      { code: 'AI301', title: 'Foundations of Machine Learning', credits: 4, grade: 'A', gradePoint: 8, attendance: 88, internal: 40, final: 42 }
    ],
    semesterHistory: [
      { semester: 'Sem 1', sgpa: 8.20, credits: 22 },
      { semester: 'Sem 2', sgpa: 8.40, credits: 24 },
      { semester: 'Sem 3', sgpa: 8.30, credits: 22 },
      { semester: 'Sem 4', sgpa: 8.50, credits: 24 }
    ],
    remarks: 'Consistent student, keen interest in statistical inference.',
    achievements: ['Kaggle Notebooks Master']
  },
  {
    id: 'STU-1007',
    rollNo: '2022CSE130',
    name: 'Meera Sen',
    email: 'meera.sen@aurainst.edu',
    phone: '+91 98300 66778',
    gender: 'Female',
    dob: '2003-12-14',
    bloodGroup: 'B-',
    avatarBg: '#a855f7',
    department: 'CSE',
    semester: 7,
    academicYear: '2022-2026',
    cgpa: 9.65,
    attendance: 96.2,
    feeStatus: 'Paid',
    feeDue: 0,
    academicStanding: 'Dean\'s List',
    mentor: 'Dr. Sarah Jenkins',
    address: '88 Salt Lake Sector V, Kolkata, WB',
    guardian: { name: 'Subhash Sen', phone: '+91 98300 11992', relation: 'Father' },
    courses: [
      { code: 'CS301', title: 'Data Structures & Algorithms', credits: 4, grade: 'O', gradePoint: 10, attendance: 98, internal: 49, final: 50 },
      { code: 'CS303', title: 'Operating Systems & Concurrency', credits: 3, grade: 'O', gradePoint: 10, attendance: 95, internal: 48, final: 49 }
    ],
    semesterHistory: [
      { semester: 'Sem 1', sgpa: 9.40, credits: 22 },
      { semester: 'Sem 2', sgpa: 9.60, credits: 24 },
      { semester: 'Sem 3', sgpa: 9.70, credits: 22 },
      { semester: 'Sem 4', sgpa: 9.65, credits: 24 },
      { semester: 'Sem 5', sgpa: 9.75, credits: 22 },
      { semester: 'Sem 6', sgpa: 9.80, credits: 24 }
    ],
    remarks: 'Pre-placement offer received from Microsoft Cloud Security division.',
    achievements: ['Grace Hopper Celebration Scholar 2025']
  },
  {
    id: 'STU-1008',
    rollNo: '2023MECH215',
    name: 'Devraj Singh Chauhan',
    email: 'devraj.singh@aurainst.edu',
    phone: '+91 94140 55443',
    gender: 'Male',
    dob: '2004-05-19',
    bloodGroup: 'O+',
    avatarBg: '#e11d48',
    department: 'MECH',
    semester: 5,
    academicYear: '2023-2027',
    cgpa: 5.40,
    attendance: 62.0, // Critical Low
    feeStatus: 'Overdue',
    feeDue: 60000,
    academicStanding: 'Academic Probation',
    mentor: 'Dr. Marcus Webb',
    address: '14 Rathore Enclave, Udaipur, RJ',
    guardian: { name: 'Mahendra Singh', phone: '+91 94140 88221', relation: 'Father' },
    courses: [
      { code: 'ME304', title: 'Robotics Kinematics & Automation', credits: 4, grade: 'D', gradePoint: 5, attendance: 60, internal: 22, final: 24 }
    ],
    semesterHistory: [
      { semester: 'Sem 1', sgpa: 6.00, credits: 22 },
      { semester: 'Sem 2', sgpa: 5.50, credits: 24 },
      { semester: 'Sem 3', sgpa: 5.20, credits: 22 },
      { semester: 'Sem 4', sgpa: 4.90, credits: 24 }
    ],
    remarks: 'Academic probation review pending with Dean of Student Affairs. Dues reminder sent.',
    achievements: ['University Track & Field 200m Silver']
  },
  {
    id: 'STU-1009',
    rollNo: '2023ECE122',
    name: 'Tanvi Kulkarni',
    email: 'tanvi.k@aurainst.edu',
    phone: '+91 97234 11223',
    gender: 'Female',
    dob: '2004-10-12',
    bloodGroup: 'B+',
    avatarBg: '#14b8a6',
    department: 'ECE',
    semester: 5,
    academicYear: '2023-2027',
    cgpa: 8.88,
    attendance: 92.5,
    feeStatus: 'Paid',
    feeDue: 0,
    academicStanding: 'Good Standing',
    mentor: 'Prof. Vikram Joshi',
    address: '304 Deccan Gymkhana, Pune, MH',
    guardian: { name: 'Vivek Kulkarni', phone: '+91 97234 99009', relation: 'Father' },
    courses: [
      { code: 'EC302', title: 'Embedded Systems & IoT Protocols', credits: 3, grade: 'A+', gradePoint: 9, attendance: 93, internal: 44, final: 46 }
    ],
    semesterHistory: [
      { semester: 'Sem 1', sgpa: 8.70, credits: 22 },
      { semester: 'Sem 2', sgpa: 8.80, credits: 24 },
      { semester: 'Sem 3', sgpa: 9.00, credits: 22 },
      { semester: 'Sem 4', sgpa: 9.00, credits: 24 }
    ],
    remarks: 'Selected for Smart India Hackathon Grand Finale in Hardware category.',
    achievements: ['IEEE Student Branch Secretary']
  },
  {
    id: 'STU-1010',
    rollNo: '2023CSE142',
    name: 'Vikramaditya Rao',
    email: 'vikram.rao@aurainst.edu',
    phone: '+91 98490 88776',
    gender: 'Male',
    dob: '2004-01-28',
    bloodGroup: 'AB-',
    avatarBg: '#6366f1',
    department: 'CSE',
    semester: 5,
    academicYear: '2023-2027',
    cgpa: 7.92,
    attendance: 84.0,
    feeStatus: 'Paid',
    feeDue: 0,
    academicStanding: 'Good Standing',
    mentor: 'Dr. Rajesh Nair',
    address: '12 Jubilee Hills, Hyderabad, TS',
    guardian: { name: 'K. V. Rao', phone: '+91 98490 33445', relation: 'Father' },
    courses: [
      { code: 'CS301', title: 'Data Structures & Algorithms', credits: 4, grade: 'A', gradePoint: 8, attendance: 85, internal: 38, final: 41 },
      { code: 'CS302', title: 'Database Management Systems', credits: 4, grade: 'A', gradePoint: 8, attendance: 83, internal: 40, final: 40 }
    ],
    semesterHistory: [
      { semester: 'Sem 1', sgpa: 7.80, credits: 22 },
      { semester: 'Sem 2', sgpa: 8.00, credits: 24 },
      { semester: 'Sem 3', sgpa: 7.90, credits: 22 },
      { semester: 'Sem 4', sgpa: 8.00, credits: 24 }
    ],
    remarks: 'Consistent grades, active member of Developer Student Clubs.',
    achievements: ['Organizer - CodeStorm 2025']
  },
  {
    id: 'STU-1011',
    rollNo: '2024AIDS105',
    name: 'Sneha Chawla',
    email: 'sneha.c@aurainst.edu',
    phone: '+91 98101 22345',
    gender: 'Female',
    dob: '2005-04-02',
    bloodGroup: 'O+',
    avatarBg: '#d946ef',
    department: 'AIDS',
    semester: 3,
    academicYear: '2024-2028',
    cgpa: 9.15,
    attendance: 95.0,
    feeStatus: 'Paid',
    feeDue: 0,
    academicStanding: 'Dean\'s List',
    mentor: 'Dr. Emily Watson',
    address: '67 Greater Kailash I, New Delhi, DL',
    guardian: { name: 'Sunil Chawla', phone: '+91 98101 77665', relation: 'Father' },
    courses: [
      { code: 'AI301', title: 'Foundations of Machine Learning', credits: 4, grade: 'O', gradePoint: 10, attendance: 95, internal: 48, final: 48 }
    ],
    semesterHistory: [
      { semester: 'Sem 1', sgpa: 9.00, credits: 22 },
      { semester: 'Sem 2', sgpa: 9.30, credits: 24 }
    ],
    remarks: 'Exceptional math and linear algebra intuition.',
    achievements: ['Dean’s Scholarship Recipient']
  },
  {
    id: 'STU-1012',
    rollNo: '2023ECE134',
    name: 'Farhan Akhtar',
    email: 'farhan.a@aurainst.edu',
    phone: '+91 98200 99887',
    gender: 'Male',
    dob: '2004-08-11',
    bloodGroup: 'A+',
    avatarBg: '#f97316',
    department: 'ECE',
    semester: 5,
    academicYear: '2023-2027',
    cgpa: 7.25,
    attendance: 71.5, // Critical Low
    feeStatus: 'Partial',
    feeDue: 18000,
    academicStanding: 'Attendance Warning',
    mentor: 'Prof. Vikram Joshi',
    address: '92 Bandra West, Mumbai, MH',
    guardian: { name: 'Rashid Akhtar', phone: '+91 98200 11443', relation: 'Father' },
    courses: [
      { code: 'EC302', title: 'Embedded Systems & IoT Protocols', credits: 3, grade: 'B', gradePoint: 7, attendance: 71, internal: 35, final: 34 }
    ],
    semesterHistory: [
      { semester: 'Sem 1', sgpa: 7.50, credits: 22 },
      { semester: 'Sem 2', sgpa: 7.30, credits: 24 },
      { semester: 'Sem 3', sgpa: 7.10, credits: 22 },
      { semester: 'Sem 4', sgpa: 7.10, credits: 24 }
    ],
    remarks: 'Missed labs due to medical reasons, medical certificates verified.',
    achievements: ['Cultural Society Head']
  },
  {
    id: 'STU-1013',
    rollNo: '2024MECH210',
    name: 'Ritika Bannerjee',
    email: 'ritika.b@aurainst.edu',
    phone: '+91 98311 33445',
    gender: 'Female',
    dob: '2005-09-17',
    bloodGroup: 'B+',
    avatarBg: '#059669',
    department: 'MECH',
    semester: 3,
    academicYear: '2024-2028',
    cgpa: 8.60,
    attendance: 89.0,
    feeStatus: 'Paid',
    feeDue: 0,
    academicStanding: 'Good Standing',
    mentor: 'Prof. David Vance',
    address: '19 Ballygunge Circular Rd, Kolkata, WB',
    guardian: { name: 'Soumen Bannerjee', phone: '+91 98311 88990', relation: 'Father' },
    courses: [
      { code: 'ME201', title: 'Thermodynamics & Heat Transfer', credits: 4, grade: 'A', gradePoint: 8, attendance: 89, internal: 42, final: 43 }
    ],
    semesterHistory: [
      { semester: 'Sem 1', sgpa: 8.50, credits: 22 },
      { semester: 'Sem 2', sgpa: 8.70, credits: 24 }
    ],
    remarks: 'High acumen in thermodynamics and CFD simulation tooling.',
    achievements: ['Women in STEM Ambassador']
  },
  {
    id: 'STU-1014',
    rollNo: '2022CSE150',
    name: 'Karan Mehra',
    email: 'karan.m@aurainst.edu',
    phone: '+91 98720 11445',
    gender: 'Male',
    dob: '2003-08-25',
    bloodGroup: 'O+',
    avatarBg: '#2563eb',
    department: 'CSE',
    semester: 7,
    academicYear: '2022-2026',
    cgpa: 8.48,
    attendance: 88.0,
    feeStatus: 'Paid',
    feeDue: 0,
    academicStanding: 'Good Standing',
    mentor: 'Dr. Sarah Jenkins',
    address: '31 Sector 17, Chandigarh, CH',
    guardian: { name: 'Surjit Mehra', phone: '+91 98720 55667', relation: 'Father' },
    courses: [
      { code: 'CS302', title: 'Database Management Systems', credits: 4, grade: 'A', gradePoint: 8, attendance: 88, internal: 42, final: 42 }
    ],
    semesterHistory: [
      { semester: 'Sem 1', sgpa: 8.30, credits: 22 },
      { semester: 'Sem 2', sgpa: 8.50, credits: 24 },
      { semester: 'Sem 3', sgpa: 8.40, credits: 22 },
      { semester: 'Sem 4', sgpa: 8.60, credits: 24 },
      { semester: 'Sem 5', sgpa: 8.50, credits: 22 },
      { semester: 'Sem 6', sgpa: 8.60, credits: 24 }
    ],
    remarks: 'Published open source library for distributed caching with 500+ stars.',
    achievements: ['Fintech Hackathon Runner-up']
  },
  {
    id: 'STU-1015',
    rollNo: '2024CSE112',
    name: 'Zara Khan',
    email: 'zara.khan@aurainst.edu',
    phone: '+91 99100 88223',
    gender: 'Female',
    dob: '2005-01-14',
    bloodGroup: 'AB+',
    avatarBg: '#84cc16',
    department: 'CSE',
    semester: 3,
    academicYear: '2024-2028',
    cgpa: 9.30,
    attendance: 96.0,
    feeStatus: 'Paid',
    feeDue: 0,
    academicStanding: 'Dean\'s List',
    mentor: 'Prof. Michael Chang',
    address: '15 Hazratganj, Lucknow, UP',
    guardian: { name: 'Tariq Khan', phone: '+91 99100 44556', relation: 'Father' },
    courses: [
      { code: 'CS301', title: 'Data Structures & Algorithms', credits: 4, grade: 'O', gradePoint: 10, attendance: 96, internal: 49, final: 48 }
    ],
    semesterHistory: [
      { semester: 'Sem 1', sgpa: 9.20, credits: 22 },
      { semester: 'Sem 2', sgpa: 9.40, credits: 24 }
    ],
    remarks: 'Excellent analytical speed. Active peer tutor for discrete math.',
    achievements: ['National Cyber Olympiad Gold']
  },
  {
    id: 'STU-1016',
    rollNo: '2023AIDS225',
    name: 'Aditya Swaminathan',
    email: 'aditya.s@aurainst.edu',
    phone: '+91 98401 77665',
    gender: 'Male',
    dob: '2004-12-03',
    bloodGroup: 'O-',
    avatarBg: '#7c3aed',
    department: 'AIDS',
    semester: 5,
    academicYear: '2023-2027',
    cgpa: 7.60,
    attendance: 78.5,
    feeStatus: 'Paid',
    feeDue: 0,
    academicStanding: 'Good Standing',
    mentor: 'Dr. Emily Watson',
    address: '44 Besant Nagar, Chennai, TN',
    guardian: { name: 'R. Swaminathan', phone: '+91 98401 22339', relation: 'Father' },
    courses: [
      { code: 'AI301', title: 'Foundations of Machine Learning', credits: 4, grade: 'B+', gradePoint: 7, attendance: 78, internal: 36, final: 38 }
    ],
    semesterHistory: [
      { semester: 'Sem 1', sgpa: 7.40, credits: 22 },
      { semester: 'Sem 2', sgpa: 7.70, credits: 24 },
      { semester: 'Sem 3', sgpa: 7.50, credits: 22 },
      { semester: 'Sem 4', sgpa: 7.80, credits: 24 }
    ],
    remarks: 'Consistent progress in reinforcement learning modules.',
    achievements: ['Chess Grand Prix Campus Champion']
  }
];

const AUDIT_LOGS = [
  { id: 'LOG-301', time: '10 mins ago', action: 'Grade Submitted', user: 'Dr. Sarah Jenkins', details: 'Final grades published for CS301' },
  { id: 'LOG-302', time: '25 mins ago', action: 'Attendance Warning Dispatched', user: 'System Bot', details: 'Notice sent to 3 students below 75%' },
  { id: 'LOG-303', time: '1 hour ago', action: 'Student Registered', user: 'Admin Vance', details: 'Added Zara Khan (2024CSE112)' },
  { id: 'LOG-304', time: '3 hours ago', action: 'Fee Payment Verified', user: 'Finance Desk', details: 'INR 60,000 received for Roll 2023CSE101' },
  { id: 'LOG-305', time: 'Yesterday', action: 'Course Catalog Updated', user: 'Dean Academics', details: 'Added AI402 LLM special elective' }
];

window.EduPulseData = {
  departments: DEFAULT_DEPARTMENTS,
  courses: DEFAULT_COURSES,
  students: DEFAULT_STUDENTS,
  auditLogs: AUDIT_LOGS
};
