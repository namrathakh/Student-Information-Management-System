"""
EduPulse SIMS - SQLite Database Manager
Provides relational database schema, SQLite connection, and initial seed data.
"""

import sqlite3
import json
import os

DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'edupulse.db')

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    cursor = conn.cursor()

    # 1. Students Table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS students (
            id TEXT PRIMARY KEY,
            roll_no TEXT UNIQUE NOT NULL,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            phone TEXT,
            gender TEXT,
            dob TEXT,
            blood_group TEXT,
            avatar_bg TEXT,
            department TEXT NOT NULL,
            semester INTEGER NOT NULL,
            academic_year TEXT,
            cgpa REAL NOT NULL,
            attendance REAL NOT NULL,
            fee_status TEXT NOT NULL,
            fee_due REAL DEFAULT 0,
            academic_standing TEXT NOT NULL,
            mentor TEXT,
            address TEXT,
            guardian_json TEXT,
            courses_json TEXT,
            semester_history_json TEXT,
            remarks TEXT,
            achievements_json TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')

    # 2. Courses Table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS courses (
            code TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            credits INTEGER NOT NULL,
            dept TEXT NOT NULL,
            semester INTEGER NOT NULL,
            instructor TEXT NOT NULL
        )
    ''')

    # 3. Departments Table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS departments (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            code TEXT NOT NULL,
            hod TEXT NOT NULL
        )
    ''')

    # 4. Audit Logs Table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS audit_logs (
            id TEXT PRIMARY KEY,
            action TEXT NOT NULL,
            user TEXT NOT NULL,
            details TEXT NOT NULL,
            timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')

    conn.commit()

    cursor.execute('SELECT COUNT(*) FROM students')
    if cursor.fetchone()[0] < 10:
        seed_data(conn)

    conn.close()

def seed_data(conn):
    cursor = conn.cursor()

    # Clear existing to re-seed rich cohort
    cursor.execute('DELETE FROM students')
    cursor.execute('DELETE FROM courses')
    cursor.execute('DELETE FROM departments')
    cursor.execute('DELETE FROM audit_logs')

    departments = [
        ('CSE', 'Computer Science & Engineering', 'CS', 'Dr. Sarah Jenkins'),
        ('AIDS', 'Artificial Intelligence & Data Science', 'AI', 'Dr. Ramesh Sundaram'),
        ('ECE', 'Electronics & Communication Eng.', 'EC', 'Dr. Elena Rostova'),
        ('MECH', 'Mechanical & Robotics Engineering', 'ME', 'Prof. David Vance')
    ]
    cursor.executemany('''
        INSERT OR IGNORE INTO departments (id, name, code, hod) VALUES (?, ?, ?, ?)
    ''', departments)

    courses = [
        ('CS301', 'Data Structures & Algorithms', 4, 'CSE', 5, 'Dr. Sarah Jenkins'),
        ('CS302', 'Database Management Systems', 4, 'CSE', 5, 'Prof. Michael Chang'),
        ('CS303', 'Operating Systems & Concurrency', 3, 'CSE', 5, 'Dr. Rajesh Nair'),
        ('AI401', 'Deep Learning & Neural Architectures', 4, 'AIDS', 7, 'Dr. Ramesh Sundaram'),
        ('AI402', 'Natural Language Processing & LLMs', 3, 'AIDS', 7, 'Dr. Emily Watson'),
        ('AI301', 'Foundations of Machine Learning', 4, 'AIDS', 5, 'Prof. Ananya Roy'),
        ('EC201', 'Digital Signal Processing', 4, 'ECE', 3, 'Dr. Elena Rostova'),
        ('EC302', 'Embedded Systems & IoT Protocols', 3, 'ECE', 5, 'Prof. Vikram Joshi'),
        ('ME201', 'Thermodynamics & Heat Transfer', 4, 'MECH', 3, 'Prof. David Vance'),
        ('ME304', 'Robotics Kinematics & Automation', 4, 'MECH', 5, 'Dr. Marcus Webb')
    ]
    cursor.executemany('''
        INSERT OR IGNORE INTO courses (code, title, credits, dept, semester, instructor) VALUES (?, ?, ?, ?, ?, ?)
    ''', courses)

    # 16 High-Fidelity Students
    students = [
        (
            'STU-1001', '2023CSE101', 'Aarav Sharma', 'aarav.sharma@aurainst.edu', '+91 98450 12345',
            'Male', '2004-03-15', 'O+', '#3b82f6', 'CSE', 5, '2023-2027', 9.42, 94.5,
            'Paid', 0, "Dean's List", 'Dr. Sarah Jenkins', '42 Orchid Heights, Bengaluru',
            json.dumps({'name': 'Sanjay Sharma', 'phone': '+91 98450 99881', 'relation': 'Father'}),
            json.dumps([
                {'code': 'CS301', 'title': 'Data Structures & Algorithms', 'credits': 4, 'grade': 'O', 'gradePoint': 10, 'attendance': 96, 'internal': 48, 'final': 49},
                {'code': 'CS302', 'title': 'Database Management Systems', 'credits': 4, 'grade': 'A+', 'gradePoint': 9, 'attendance': 92, 'internal': 45, 'final': 47}
            ]),
            json.dumps([{'semester': 'Sem 1', 'sgpa': 9.1, 'credits': 22}, {'semester': 'Sem 2', 'sgpa': 9.35, 'credits': 24}, {'semester': 'Sem 3', 'sgpa': 9.5, 'credits': 22}, {'semester': 'Sem 4', 'sgpa': 9.6, 'credits': 24}, {'semester': 'Sem 5', 'sgpa': 9.55, 'credits': 20}]),
            'Nominated for ACM Collegiate Hackathon finalist. Outstanding researcher.',
            json.dumps(['Gold Medalist Sem 3', 'Lead Coordinator - Open Source Lab'])
        ),
        (
            'STU-1002', '2023AIDS204', 'Priya Iyer', 'priya.iyer@aurainst.edu', '+91 98112 45678',
            'Female', '2004-07-22', 'B+', '#8b5cf6', 'AIDS', 7, '2022-2026', 9.78, 98.0,
            'Paid', 0, "Dean's List", 'Dr. Ramesh Sundaram', '104 Lotus Villa, Bengaluru',
            json.dumps({'name': 'K. S. Iyer', 'phone': '+91 98112 88776', 'relation': 'Father'}),
            json.dumps([
                {'code': 'AI401', 'title': 'Deep Learning & Neural Architectures', 'credits': 4, 'grade': 'O', 'gradePoint': 10, 'attendance': 100, 'internal': 50, 'final': 49},
                {'code': 'AI402', 'title': 'Natural Language Processing & LLMs', 'credits': 3, 'grade': 'O', 'gradePoint': 10, 'attendance': 97, 'internal': 49, 'final': 50}
            ]),
            json.dumps([{'semester': 'Sem 1', 'sgpa': 9.6, 'credits': 22}, {'semester': 'Sem 2', 'sgpa': 9.8, 'credits': 24}, {'semester': 'Sem 3', 'sgpa': 9.75, 'credits': 22}, {'semester': 'Sem 4', 'sgpa': 9.85, 'credits': 24}, {'semester': 'Sem 5', 'sgpa': 9.7, 'credits': 22}, {'semester': 'Sem 6', 'sgpa': 9.9, 'credits': 24}]),
            'Published paper in IEEE AI Symposium on Transformer Efficiency.',
            json.dumps(['Institute Rank 1 (Sem 6)', 'Google Summer of Code Scholar'])
        ),
        (
            'STU-1003', '2023CSE108', 'Rohan Deshmukh', 'rohan.d@aurainst.edu', '+91 97654 33221',
            'Male', '2004-11-09', 'A+', '#ec4899', 'CSE', 5, '2023-2027', 6.84, 68.2,
            'Partial', 25000, 'Attendance Warning', 'Prof. Michael Chang', '77 Shivaji Marg, Pune',
            json.dumps({'name': 'Anil Deshmukh', 'phone': '+91 97654 99110', 'relation': 'Father'}),
            json.dumps([
                {'code': 'CS301', 'title': 'Data Structures & Algorithms', 'credits': 4, 'grade': 'C', 'gradePoint': 6, 'attendance': 65, 'internal': 28, 'final': 32}
            ]),
            json.dumps([{'semester': 'Sem 1', 'sgpa': 7.2, 'credits': 22}, {'semester': 'Sem 2', 'sgpa': 7.0, 'credits': 24}, {'semester': 'Sem 3', 'sgpa': 6.6, 'credits': 22}, {'semester': 'Sem 4', 'sgpa': 6.55, 'credits': 24}]),
            'Attendance warning letter #2 issued. Counseling scheduled.',
            json.dumps(['Captain - University Badminton Squad'])
        ),
        (
            'STU-1004', '2024ECE115', 'Ananya Verma', 'ananya.verma@aurainst.edu', '+91 99230 87654',
            'Female', '2005-02-18', 'AB+', '#10b981', 'ECE', 3, '2024-2028', 8.75, 91.0,
            'Paid', 0, 'Good Standing', 'Dr. Elena Rostova', '22 Civil Lines, Jaipur',
            json.dumps({'name': 'Sunita Verma', 'phone': '+91 99230 11223', 'relation': 'Mother'}),
            json.dumps([
                {'code': 'EC201', 'title': 'Digital Signal Processing', 'credits': 4, 'grade': 'A', 'gradePoint': 8, 'attendance': 90, 'internal': 42, 'final': 44}
            ]),
            json.dumps([{'semester': 'Sem 1', 'sgpa': 8.6, 'credits': 22}, {'semester': 'Sem 2', 'sgpa': 8.9, 'credits': 24}]),
            'Enthusiastic robotics club contributor. High lab participation.',
            json.dumps(['1st Place - State Level Embedded Hardware Expo'])
        ),
        (
            'STU-1005', '2024MECH201', 'Kavya Patel', 'kavya.p@aurainst.edu', '+91 98980 44332',
            'Female', '2005-06-30', 'O-', '#f59e0b', 'MECH', 3, '2024-2028', 8.92, 93.4,
            'Paid', 0, 'Good Standing', 'Prof. David Vance', '502 Navrang Towers, Ahmedabad',
            json.dumps({'name': 'Rajesh Patel', 'phone': '+91 98980 77889', 'relation': 'Father'}),
            json.dumps([
                {'code': 'ME201', 'title': 'Thermodynamics & Heat Transfer', 'credits': 4, 'grade': 'A+', 'gradePoint': 9, 'attendance': 94, 'internal': 46, 'final': 47}
            ]),
            json.dumps([{'semester': 'Sem 1', 'sgpa': 8.8, 'credits': 22}, {'semester': 'Sem 2', 'sgpa': 9.05, 'credits': 24}]),
            'Formula Student SAE Chassis design team leader.',
            json.dumps(['Best CAD Modeling Award 2025'])
        ),
        (
            'STU-1006', '2023AIDS210', 'Arjun Nambiar', 'arjun.n@aurainst.edu', '+91 94471 22334',
            'Male', '2004-09-05', 'A-', '#06b6d4', 'AIDS', 5, '2023-2027', 8.35, 87.5,
            'Paid', 0, 'Good Standing', 'Prof. Ananya Roy', '15 Marine Drive, Kochi',
            json.dumps({'name': 'Gopal Nambiar', 'phone': '+91 94471 99001', 'relation': 'Father'}),
            json.dumps([{'code': 'AI301', 'title': 'Foundations of Machine Learning', 'credits': 4, 'grade': 'A', 'gradePoint': 8, 'attendance': 88, 'internal': 40, 'final': 42}]),
            json.dumps([{'semester': 'Sem 1', 'sgpa': 8.2, 'credits': 22}, {'semester': 'Sem 2', 'sgpa': 8.4, 'credits': 24}]),
            'Consistent student, keen interest in statistical inference.',
            json.dumps(['Kaggle Notebooks Master'])
        ),
        (
            'STU-1007', '2022CSE130', 'Meera Sen', 'meera.sen@aurainst.edu', '+91 98300 66778',
            'Female', '2003-12-14', 'B-', '#a855f7', 'CSE', 7, '2022-2026', 9.65, 96.2,
            'Paid', 0, "Dean's List", 'Dr. Sarah Jenkins', '88 Salt Lake Sector V, Kolkata',
            json.dumps({'name': 'Subhash Sen', 'phone': '+91 98300 11992', 'relation': 'Father'}),
            json.dumps([{'code': 'CS301', 'title': 'Data Structures & Algorithms', 'credits': 4, 'grade': 'O', 'gradePoint': 10, 'attendance': 98, 'internal': 49, 'final': 50}]),
            json.dumps([{'semester': 'Sem 1', 'sgpa': 9.4, 'credits': 22}, {'semester': 'Sem 2', 'sgpa': 9.6, 'credits': 24}]),
            'Pre-placement offer received from Microsoft Cloud Security.',
            json.dumps(['Grace Hopper Celebration Scholar'])
        ),
        (
            'STU-1008', '2023MECH215', 'Devraj Singh', 'devraj.singh@aurainst.edu', '+91 94140 55443',
            'Male', '2004-05-19', 'O+', '#e11d48', 'MECH', 5, '2023-2027', 5.40, 62.0,
            'Overdue', 60000, 'Academic Probation', 'Dr. Marcus Webb', '14 Rathore Enclave, Udaipur',
            json.dumps({'name': 'Mahendra Singh', 'phone': '+91 94140 88221', 'relation': 'Father'}),
            json.dumps([{'code': 'ME304', 'title': 'Robotics Kinematics & Automation', 'credits': 4, 'grade': 'D', 'gradePoint': 5, 'attendance': 60, 'internal': 22, 'final': 24}]),
            json.dumps([{'semester': 'Sem 1', 'sgpa': 6.0, 'credits': 22}, {'semester': 'Sem 2', 'sgpa': 5.5, 'credits': 24}]),
            'Academic probation review pending. Attendance <75%.',
            json.dumps(['University Track & Field Silver'])
        ),
        (
            'STU-1009', '2023ECE122', 'Tanvi Kulkarni', 'tanvi.k@aurainst.edu', '+91 97234 11223',
            'Female', '2004-10-12', 'B+', '#14b8a6', 'ECE', 5, '2023-2027', 8.88, 92.5,
            'Paid', 0, 'Good Standing', 'Prof. Vikram Joshi', '304 Deccan Gymkhana, Pune',
            json.dumps({'name': 'Vivek Kulkarni', 'phone': '+91 97234 99009', 'relation': 'Father'}),
            json.dumps([{'code': 'EC302', 'title': 'Embedded Systems & IoT Protocols', 'credits': 3, 'grade': 'A+', 'gradePoint': 9, 'attendance': 93, 'internal': 44, 'final': 46}]),
            json.dumps([{'semester': 'Sem 1', 'sgpa': 8.7, 'credits': 22}, {'semester': 'Sem 2', 'sgpa': 8.8, 'credits': 24}]),
            'Selected for Smart India Hackathon Grand Finale in Hardware.',
            json.dumps(['IEEE Student Branch Secretary'])
        ),
        (
            'STU-1010', '2023CSE142', 'Vikramaditya Rao', 'vikram.rao@aurainst.edu', '+91 98490 88776',
            'Male', '2004-01-28', 'AB-', '#6366f1', 'CSE', 5, '2023-2027', 7.92, 84.0,
            'Paid', 0, 'Good Standing', 'Dr. Rajesh Nair', '12 Jubilee Hills, Hyderabad',
            json.dumps({'name': 'K. V. Rao', 'phone': '+91 98490 33445', 'relation': 'Father'}),
            json.dumps([{'code': 'CS301', 'title': 'Data Structures & Algorithms', 'credits': 4, 'grade': 'A', 'gradePoint': 8, 'attendance': 85, 'internal': 38, 'final': 41}]),
            json.dumps([{'semester': 'Sem 1', 'sgpa': 7.8, 'credits': 22}, {'semester': 'Sem 2', 'sgpa': 8.0, 'credits': 24}]),
            'Consistent grades, active member of Developer Student Clubs.',
            json.dumps(['Organizer - CodeStorm 2025'])
        ),
        (
            'STU-1011', '2024AIDS105', 'Sneha Chawla', 'sneha.c@aurainst.edu', '+91 98101 22345',
            'Female', '2005-04-02', 'O+', '#d946ef', 'AIDS', 3, '2024-2028', 9.15, 95.0,
            'Paid', 0, "Dean's List", 'Dr. Emily Watson', '67 Greater Kailash I, New Delhi',
            json.dumps({'name': 'Sunil Chawla', 'phone': '+91 98101 77665', 'relation': 'Father'}),
            json.dumps([{'code': 'AI301', 'title': 'Foundations of Machine Learning', 'credits': 4, 'grade': 'O', 'gradePoint': 10, 'attendance': 95, 'internal': 48, 'final': 48}]),
            json.dumps([{'semester': 'Sem 1', 'sgpa': 9.0, 'credits': 22}, {'semester': 'Sem 2', 'sgpa': 9.3, 'credits': 24}]),
            'Exceptional math and linear algebra intuition.',
            json.dumps(['Deans Scholarship Recipient'])
        ),
        (
            'STU-1012', '2023ECE134', 'Farhan Akhtar', 'farhan.a@aurainst.edu', '+91 98200 99887',
            'Male', '2004-08-11', 'A+', '#f97316', 'ECE', 5, '2023-2027', 7.25, 71.5,
            'Partial', 18000, 'Attendance Warning', 'Prof. Vikram Joshi', '92 Bandra West, Mumbai',
            json.dumps({'name': 'Rashid Akhtar', 'phone': '+91 98200 11443', 'relation': 'Father'}),
            json.dumps([{'code': 'EC302', 'title': 'Embedded Systems & IoT Protocols', 'credits': 3, 'grade': 'B', 'gradePoint': 7, 'attendance': 71, 'internal': 35, 'final': 34}]),
            json.dumps([{'semester': 'Sem 1', 'sgpa': 7.5, 'credits': 22}, {'semester': 'Sem 2', 'sgpa': 7.3, 'credits': 24}]),
            'Missed labs due to medical reasons, medical certificates verified.',
            json.dumps(['Cultural Society Head'])
        ),
        (
            'STU-1013', '2024MECH210', 'Ritika Bannerjee', 'ritika.b@aurainst.edu', '+91 98311 33445',
            'Female', '2005-09-17', 'B+', '#059669', 'MECH', 3, '2024-2028', 8.60, 89.0,
            'Paid', 0, 'Good Standing', 'Prof. David Vance', '19 Ballygunge Circular Rd, Kolkata',
            json.dumps({'name': 'Soumen Bannerjee', 'phone': '+91 98311 88990', 'relation': 'Father'}),
            json.dumps([{'code': 'ME201', 'title': 'Thermodynamics & Heat Transfer', 'credits': 4, 'grade': 'A', 'gradePoint': 8, 'attendance': 89, 'internal': 42, 'final': 43}]),
            json.dumps([{'semester': 'Sem 1', 'sgpa': 8.5, 'credits': 22}, {'semester': 'Sem 2', 'sgpa': 8.7, 'credits': 24}]),
            'High acumen in thermodynamics and CFD simulation tooling.',
            json.dumps(['Women in STEM Ambassador'])
        ),
        (
            'STU-1014', '2022CSE150', 'Karan Mehra', 'karan.m@aurainst.edu', '+91 98720 11445',
            'Male', '2003-08-25', 'O+', '#2563eb', 'CSE', 7, '2022-2026', 8.48, 88.0,
            'Paid', 0, 'Good Standing', 'Dr. Sarah Jenkins', '31 Sector 17, Chandigarh',
            json.dumps({'name': 'Surjit Mehra', 'phone': '+91 98720 55667', 'relation': 'Father'}),
            json.dumps([{'code': 'CS302', 'title': 'Database Management Systems', 'credits': 4, 'grade': 'A', 'gradePoint': 8, 'attendance': 88, 'internal': 42, 'final': 42}]),
            json.dumps([{'semester': 'Sem 1', 'sgpa': 8.3, 'credits': 22}, {'semester': 'Sem 2', 'sgpa': 8.5, 'credits': 24}]),
            'Published open source library for distributed caching with 500+ stars.',
            json.dumps(['Fintech Hackathon Runner-up'])
        ),
        (
            'STU-1015', '2024CSE112', 'Zara Khan', 'zara.khan@aurainst.edu', '+91 99100 88223',
            'Female', '2005-01-14', 'AB+', '#84cc16', 'CSE', 3, '2024-2028', 9.30, 96.0,
            'Paid', 0, "Dean's List", 'Prof. Michael Chang', '15 Hazratganj, Lucknow',
            json.dumps({'name': 'Tariq Khan', 'phone': '+91 99100 44556', 'relation': 'Father'}),
            json.dumps([{'code': 'CS301', 'title': 'Data Structures & Algorithms', 'credits': 4, 'grade': 'O', 'gradePoint': 10, 'attendance': 96, 'internal': 49, 'final': 48}]),
            json.dumps([{'semester': 'Sem 1', 'sgpa': 9.2, 'credits': 22}, {'semester': 'Sem 2', 'sgpa': 9.4, 'credits': 24}]),
            'Excellent analytical speed. Active peer tutor for discrete math.',
            json.dumps(['National Cyber Olympiad Gold'])
        ),
        (
            'STU-1016', '2023AIDS225', 'Aditya Swaminathan', 'aditya.s@aurainst.edu', '+91 98401 77665',
            'Male', '2004-12-03', 'O-', '#7c3aed', 'AIDS', 5, '2023-2027', 7.60, 78.5,
            'Paid', 0, 'Good Standing', 'Dr. Emily Watson', '44 Besant Nagar, Chennai',
            json.dumps({'name': 'R. Swaminathan', 'phone': '+91 98401 22339', 'relation': 'Father'}),
            json.dumps([{'code': 'AI301', 'title': 'Foundations of Machine Learning', 'credits': 4, 'grade': 'B+', 'gradePoint': 7, 'attendance': 78, 'internal': 36, 'final': 38}]),
            json.dumps([{'semester': 'Sem 1', 'sgpa': 7.4, 'credits': 22}, {'semester': 'Sem 2', 'sgpa': 7.7, 'credits': 24}]),
            'Consistent progress in reinforcement learning modules.',
            json.dumps(['Chess Grand Prix Campus Champion'])
        )
    ]

    cursor.executemany('''
        INSERT INTO students (
            id, roll_no, name, email, phone, gender, dob, blood_group, avatar_bg,
            department, semester, academic_year, cgpa, attendance, fee_status,
            fee_due, academic_standing, mentor, address, guardian_json,
            courses_json, semester_history_json, remarks, achievements_json
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', students)

    logs = [
        ('LOG-301', 'Flask & SQLite Server Active', 'System', 'SQLite database initialized with 16 accredited student profiles'),
        ('LOG-302', 'Grade Submitted', 'Dr. Sarah Jenkins', 'Final grades published for CS301'),
        ('LOG-303', 'Attendance Warning Dispatched', 'Compliance Bot', 'Notice sent to 3 students below 75% cutoff'),
        ('LOG-304', 'Student Registered', 'Admin Vance', 'Verified enrollment for Zara Khan (2024CSE112)'),
        ('LOG-305', 'Fee Payment Verified', 'Finance Desk', 'INR 85,000 tuition cleared for Roll 2023CSE101')
    ]
    cursor.executemany('''
        INSERT INTO audit_logs (id, action, user, details) VALUES (?, ?, ?, ?)
    ''', logs)

    conn.commit()
