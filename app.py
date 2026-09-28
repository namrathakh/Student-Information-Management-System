"""
EduPulse SIMS - Enterprise Flask Web Application & RESTful API Backend
Integrates Python, Flask, SQLite, HTML5, CSS3, and Modern JavaScript.
"""

from flask import Flask, jsonify, request, send_from_directory, make_response
import sqlite3
import json
import os
import random
from database import init_db, get_db

app = Flask(__name__, static_folder='.', static_url_path='')

# Ensure SQLite Database is initialized on startup
init_db()

# ----------------- FRONTEND STATIC ROUTES -----------------

@app.route('/')
def index():
    """Serves the main single page dashboard application."""
    return send_from_directory('.', 'index.html')

@app.route('/<path:filename>')
def serve_static(filename):
    """Serves CSS, JS, Assets and other static files."""
    return send_from_directory('.', filename)

# ----------------- RESTful API ENDPOINTS -----------------

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint for reviewer inspection."""
    return jsonify({
        'status': 'healthy',
        'system': 'EduPulse SIMS',
        'backend': 'Python Flask 3.x',
        'database': 'SQLite 3 (Relational)',
        'version': '2.4.0'
    })

def student_row_to_dict(row):
    """Converts a SQLite row into a clean JSON dictionary."""
    guardian = json.loads(row['guardian_json']) if row['guardian_json'] else {}
    courses = json.loads(row['courses_json']) if row['courses_json'] else []
    semester_history = json.loads(row['semester_history_json']) if row['semester_history_json'] else []
    achievements = json.loads(row['achievements_json']) if row['achievements_json'] else []

    return {
        'id': row['id'],
        'rollNo': row['roll_no'],
        'name': row['name'],
        'email': row['email'],
        'phone': row['phone'],
        'gender': row['gender'],
        'dob': row['dob'],
        'bloodGroup': row['blood_group'],
        'avatarBg': row['avatar_bg'],
        'department': row['department'],
        'semester': row['semester'],
        'academicYear': row['academic_year'],
        'cgpa': row['cgpa'],
        'attendance': row['attendance'],
        'feeStatus': row['fee_status'],
        'feeDue': row['fee_due'],
        'academicStanding': row['academic_standing'],
        'mentor': row['mentor'],
        'address': row['address'],
        'guardian': guardian,
        'courses': courses,
        'semesterHistory': semester_history,
        'remarks': row['remarks'],
        'achievements': achievements
    }

def log_audit(action, user, details):
    """Inserts a governance audit trail entry into SQLite."""
    conn = get_db()
    cursor = conn.cursor()
    log_id = f"LOG-{random.randint(100, 999)}"
    cursor.execute('''
        INSERT INTO audit_logs (id, action, user, details)
        VALUES (?, ?, ?, ?)
    ''', (log_id, action, user, details))
    conn.commit()
    conn.close()

@app.route('/api/students', methods=['GET'])
def get_students():
    """Returns students list with optional search and multi-filtering."""
    dept = request.args.get('department')
    sem = request.args.get('semester')
    search = request.args.get('search', '').lower()
    standing = request.args.get('standing')
    sort_by = request.args.get('sortBy', 'cgpa_desc')

    conn = get_db()
    cursor = conn.cursor()

    query = "SELECT * FROM students WHERE 1=1"
    params = []

    if dept and dept != 'ALL':
        query += " AND department = ?"
        params.append(dept)

    if sem and sem != 'ALL':
        query += " AND semester = ?"
        params.append(int(sem))

    if standing and standing != 'ALL':
        query += " AND academic_standing = ?"
        params.append(standing)

    if search:
        query += " AND (LOWER(name) LIKE ? OR LOWER(roll_no) LIKE ? OR LOWER(email) LIKE ? OR LOWER(department) LIKE ?)"
        wildcard = f"%{search}%"
        params.extend([wildcard, wildcard, wildcard, wildcard])

    # Sorting
    if sort_by == 'cgpa_desc':
        query += " ORDER BY cgpa DESC"
    elif sort_by == 'cgpa_asc':
        query += " ORDER BY cgpa ASC"
    elif sort_by == 'name_asc':
        query += " ORDER BY name ASC"
    elif sort_by == 'attendance_desc':
        query += " ORDER BY attendance DESC"
    elif sort_by == 'attendance_asc':
        query += " ORDER BY attendance ASC"
    elif sort_by == 'roll_asc':
        query += " ORDER BY roll_no ASC"

    cursor.execute(query, params)
    rows = cursor.fetchall()
    conn.close()

    students = [student_row_to_dict(r) for r in rows]
    return jsonify({'success': True, 'count': len(students), 'students': students})

@app.route('/api/students/<student_id>', methods=['GET'])
def get_student(student_id):
    """Returns single student record by ID."""
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM students WHERE id = ?", (student_id,))
    row = cursor.fetchone()
    conn.close()

    if not row:
        return jsonify({'success': False, 'error': 'Student not found'}), 404

    return jsonify({'success': True, 'student': student_row_to_dict(row)})

@app.route('/api/students', methods=['POST'])
def create_student():
    """Creates a new student record in SQLite with validation."""
    data = request.get_json() or {}

    name = data.get('name', '').strip()
    roll_no = data.get('rollNo', '').strip().upper()
    email = data.get('email', '').strip().lower()

    if not name or not roll_no or not email:
        return jsonify({'success': False, 'error': 'Name, Roll Number, and Email are required'}), 400

    conn = get_db()
    cursor = conn.cursor()

    # Check duplicate roll number
    cursor.execute("SELECT id FROM students WHERE roll_no = ?", (roll_no,))
    if cursor.fetchone():
        conn.close()
        return jsonify({'success': False, 'error': f'Roll Number {roll_no} is already registered'}), 409

    student_id = f"STU-{random.randint(1020, 9999)}"
    cgpa = float(data.get('cgpa', 8.5))
    attendance = float(data.get('attendance', 90.0))

    standing = "Good Standing"
    if cgpa >= 9.0:
        standing = "Dean's List"
    elif cgpa < 5.0:
        standing = "Academic Probation"
    elif attendance < 75.0:
        standing = "Attendance Warning"

    colors = ['#3b82f6', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b', '#06b6d4', '#6366f1']
    avatar_bg = data.get('avatarBg') or random.choice(colors)

    guardian = {
        'name': data.get('guardianName', 'Guardian'),
        'phone': data.get('guardianPhone', '+91 98000 00000'),
        'relation': data.get('guardianRelation', 'Parent')
    }

    courses = data.get('courses') or [
        {'code': 'CS301', 'title': 'Data Structures & Algorithms', 'credits': 4, 'grade': 'A', 'gradePoint': 8, 'attendance': 90, 'internal': 42, 'final': 44}
    ]

    history = [{'semester': f"Sem {data.get('semester', 1)}", 'sgpa': cgpa, 'credits': 22}]

    cursor.execute('''
        INSERT INTO students (
            id, roll_no, name, email, phone, gender, dob, blood_group, avatar_bg,
            department, semester, academic_year, cgpa, attendance, fee_status,
            fee_due, academic_standing, mentor, address, guardian_json,
            courses_json, semester_history_json, remarks, achievements_json
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        student_id, roll_no, name, email, data.get('phone', '+91 98000 00000'),
        data.get('gender', 'Other'), data.get('dob', '2004-01-01'), data.get('bloodGroup', 'O+'),
        avatar_bg, data.get('department', 'CSE'), int(data.get('semester', 1)),
        data.get('academicYear', '2024-2028'), cgpa, attendance, data.get('feeStatus', 'Paid'),
        float(data.get('feeDue', 0)), standing, data.get('mentor', 'Dr. Sarah Jenkins'),
        data.get('address', 'University Campus'), json.dumps(guardian), json.dumps(courses),
        json.dumps(history), data.get('remarks', 'Newly enrolled candidate.'), json.dumps(['Enrolled Fall Term'])
    ))
    conn.commit()
    conn.close()

    log_audit('Student Registered', 'Flask API Controller', f"Created profile for {name} ({roll_no})")
    return jsonify({'success': True, 'id': student_id, 'message': f'Student {name} registered successfully'}), 201

@app.route('/api/students/<student_id>', methods=['PUT'])
def update_student(student_id):
    """Updates an existing student profile."""
    data = request.get_json() or {}

    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM students WHERE id = ?", (student_id,))
    existing = cursor.fetchone()

    if not existing:
        conn.close()
        return jsonify({'success': False, 'error': 'Student not found'}), 404

    cgpa = float(data.get('cgpa', existing['cgpa']))
    attendance = float(data.get('attendance', existing['attendance']))

    standing = "Good Standing"
    if cgpa >= 9.0:
        standing = "Dean's List"
    elif cgpa < 5.0:
        standing = "Academic Probation"
    elif attendance < 75.0:
        standing = "Attendance Warning"

    cursor.execute('''
        UPDATE students SET
            name = ?, email = ?, phone = ?, department = ?, semester = ?,
            cgpa = ?, attendance = ?, fee_status = ?, fee_due = ?,
            academic_standing = ?, mentor = ?
        WHERE id = ?
    ''', (
        data.get('name', existing['name']),
        data.get('email', existing['email']),
        data.get('phone', existing['phone']),
        data.get('department', existing['department']),
        int(data.get('semester', existing['semester'])),
        cgpa, attendance,
        data.get('feeStatus', existing['fee_status']),
        float(data.get('feeDue', existing['fee_due'])),
        standing,
        data.get('mentor', existing['mentor']),
        student_id
    ))
    conn.commit()
    conn.close()

    log_audit('Student Record Updated', 'Flask API Controller', f"Updated record for {existing['name']} ({existing['roll_no']})")
    return jsonify({'success': True, 'message': 'Student updated successfully'})

@app.route('/api/students/<student_id>', methods=['DELETE'])
def delete_student(student_id):
    """Deletes a student record from SQLite."""
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT name, roll_no FROM students WHERE id = ?", (student_id,))
    row = cursor.fetchone()

    if not row:
        conn.close()
        return jsonify({'success': False, 'error': 'Student not found'}), 404

    name, roll_no = row['name'], row['roll_no']
    cursor.execute("DELETE FROM students WHERE id = ?", (student_id,))
    conn.commit()
    conn.close()

    log_audit('Student Record Deleted', 'Admin / Dean', f"Removed student {name} ({roll_no})")
    return jsonify({'success': True, 'message': f'Student {name} deleted successfully'})

@app.route('/api/students/<student_id>/attendance', methods=['POST'])
def mark_attendance(student_id):
    """Quickly increments or decrements student attendance."""
    data = request.get_json() or {}
    is_present = data.get('isPresent', True)

    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT attendance, name FROM students WHERE id = ?", (student_id,))
    row = cursor.fetchone()

    if not row:
        conn.close()
        return jsonify({'success': False, 'error': 'Student not found'}), 404

    delta = 1.2 if is_present else -2.5
    new_att = round(max(10.0, min(100.0, row['attendance'] + delta)), 1)

    cursor.execute("UPDATE students SET attendance = ? WHERE id = ?", (new_att, student_id))
    conn.commit()
    conn.close()

    return jsonify({'success': True, 'attendance': new_att, 'message': f"Updated {row['name']} attendance to {new_att}%"})

@app.route('/api/students/<student_id>/pay-fees', methods=['POST'])
def pay_fees(student_id):
    """Settles all outstanding fee balances for a student."""
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("UPDATE students SET fee_status = 'Paid', fee_due = 0 WHERE id = ?", (student_id,))
    conn.commit()
    conn.close()

    log_audit('Fee Payment Verified', 'Finance Desk', f"Account cleared for ID {student_id}")
    return jsonify({'success': True, 'message': 'Fees cleared successfully'})

@app.route('/api/analytics', methods=['GET'])
def get_analytics():
    """Computes high-level aggregated academic KPIs from SQLite."""
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("SELECT COUNT(*), AVG(cgpa), AVG(attendance) FROM students")
    count, avg_cgpa, avg_att = cursor.fetchone()

    if not count or count == 0:
        conn.close()
        return jsonify({
            'total': 0, 'avgCgpa': 0, 'avgAttendance': 0,
            'feeCollectionRate': 0, 'atRiskCount': 0,
            'departmentDistribution': {}, 'gradeDistribution': {}
        })

    cursor.execute("SELECT COUNT(*) FROM students WHERE fee_status = 'Paid'")
    paid_count = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM students WHERE attendance < 75 OR cgpa < 5.0")
    at_risk = cursor.fetchone()[0]

    # Department distribution
    cursor.execute("SELECT department, COUNT(*) FROM students GROUP BY department")
    dept_dist = {r[0]: r[1] for r in cursor.fetchall()}

    # Grade tiers
    cursor.execute("SELECT COUNT(*) FROM students WHERE cgpa >= 9.0")
    o_tier = cursor.fetchone()[0]
    cursor.execute("SELECT COUNT(*) FROM students WHERE cgpa >= 8.0 AND cgpa < 9.0")
    a_tier = cursor.fetchone()[0]
    cursor.execute("SELECT COUNT(*) FROM students WHERE cgpa >= 7.0 AND cgpa < 8.0")
    b_tier = cursor.fetchone()[0]
    cursor.execute("SELECT COUNT(*) FROM students WHERE cgpa >= 5.0 AND cgpa < 7.0")
    c_tier = cursor.fetchone()[0]
    cursor.execute("SELECT COUNT(*) FROM students WHERE cgpa < 5.0")
    probation = cursor.fetchone()[0]

    conn.close()

    return jsonify({
        'total': count,
        'avgCgpa': f"{avg_cgpa:.2f}" if avg_cgpa else "0.00",
        'avgAttendance': f"{avg_att:.1f}" if avg_att else "0.0",
        'feeCollectionRate': round((paid_count / count) * 100) if count > 0 else 0,
        'atRiskCount': at_risk,
        'departmentDistribution': dept_dist,
        'gradeDistribution': {
            'O (9.0-10)': o_tier,
            'A (8.0-8.9)': a_tier,
            'B (7.0-7.9)': b_tier,
            'C (5.0-6.9)': c_tier,
            'Probation (<5)': probation
        }
    })

@app.route('/api/courses', methods=['GET'])
def get_courses():
    """Returns university course catalog from SQLite."""
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM courses")
    rows = cursor.fetchall()
    conn.close()

    courses = [{'code': r['code'], 'title': r['title'], 'credits': r['credits'], 'dept': r['dept'], 'semester': r['semester'], 'instructor': r['instructor']} for r in rows]
    return jsonify({'success': True, 'courses': courses})

@app.route('/api/audit-logs', methods=['GET'])
def get_logs():
    """Returns recent activity and governance audit logs."""
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM audit_logs ORDER BY timestamp DESC LIMIT 20")
    rows = cursor.fetchall()
    conn.close()

    logs = [{'id': r['id'], 'action': r['action'], 'user': r['user'], 'details': r['details'], 'time': str(r['timestamp'])} for r in rows]
    return jsonify({'success': True, 'logs': logs})

# ----------------- MAIN LAUNCHER -----------------

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    print("[+] EduPulse SIMS - Python Flask Web Server")
    print(f"    REST API & Web App running at: http://127.0.0.1:{port}")
    print("    Database: SQLite (edupulse.db)")
    print("=" * 65)
    app.run(host='0.0.0.0', port=port, debug=False)
