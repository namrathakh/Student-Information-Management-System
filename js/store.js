/**
 * EduPulse SIMS - Reactive Data Store & Flask REST API Sync Engine
 * Seamlessly connects Frontend JavaScript to Python Flask Backend & SQLite Database
 */

class EduPulseStore {
  constructor() {
    this.storageKey = 'edupulse_sims_db_v1';
    this.apiBase = '/api';
    this.isBackendOnline = false;

    this.state = {
      students: [],
      courses: [],
      departments: [],
      auditLogs: [],
      currentRole: 'admin',
      activeStudentId: null,
      theme: localStorage.getItem('edupulse_theme') || 'dark'
    };

    this.listeners = [];
    this.init();
  }

  async init() {
    // 1. First load cached data immediately for instant zero-latency UI paint
    const saved = localStorage.getItem(this.storageKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        this.state.students = parsed.students || window.EduPulseData.students;
        this.state.courses = parsed.courses || window.EduPulseData.courses;
        this.state.departments = parsed.departments || window.EduPulseData.departments;
        this.state.auditLogs = parsed.auditLogs || window.EduPulseData.auditLogs;
      } catch (e) {
        this.loadDefaults();
      }
    } else {
      this.loadDefaults();
    }

    if (this.state.students.length > 0) {
      this.state.activeStudentId = this.state.students[0].id;
    }
    this.notify();

    // 2. Check and fetch live data from Python Flask API & SQLite
    await this.syncWithFlaskBackend();
  }

  async syncWithFlaskBackend() {
    try {
      const res = await fetch(`${this.apiBase}/health`, { signal: AbortSignal.timeout(2500) });
      if (res.ok) {
        this.isBackendOnline = true;
        console.log('✅ Connected to Python Flask & SQLite Backend!');
        this.updateBackendStatusBadge(true);
        await this.refreshStudentsFromBackend();
      } else {
        this.isBackendOnline = false;
        this.updateBackendStatusBadge(false);
      }
    } catch (e) {
      this.isBackendOnline = false;
      this.updateBackendStatusBadge(false);
      console.log('ℹ️ Running in Client-First Mode (Flask backend offline or opened directly)');
    }
  }

  updateBackendStatusBadge(isOnline) {
    let badge = document.getElementById('backend-status-pill');
    if (!badge) {
      const brandText = document.querySelector('.brand-text h1');
      if (brandText) {
        badge = document.createElement('span');
        badge.id = 'backend-status-pill';
        badge.style.cssText = 'font-size: 0.65rem; padding: 2px 7px; border-radius: 999px; margin-left: 6px; font-weight: 700;';
        brandText.appendChild(badge);
      }
    }
    if (badge) {
      if (isOnline) {
        badge.style.background = 'rgba(16, 185, 129, 0.2)';
        badge.style.color = '#34d399';
        badge.style.border = '1px solid rgba(16, 185, 129, 0.4)';
        badge.innerText = '⚡ Flask API + SQLite Active';
      } else {
        badge.style.background = 'rgba(59, 130, 246, 0.2)';
        badge.style.color = '#60a5fa';
        badge.style.border = '1px solid rgba(59, 130, 246, 0.4)';
        badge.innerText = '💾 Offline Store Active';
      }
    }
  }

  async refreshStudentsFromBackend() {
    if (!this.isBackendOnline) return;
    try {
      const res = await fetch(`${this.apiBase}/students`);
      const data = await res.json();
      if (data.success && Array.isArray(data.students) && data.students.length > 0) {
        this.state.students = data.students;
        this.persist(false); // don't re-ping backend
      }
    } catch (e) {
      console.warn('Flask fetch students failed:', e);
    }
  }

  loadDefaults() {
    this.state.students = JSON.parse(JSON.stringify(window.EduPulseData.students));
    this.state.courses = JSON.parse(JSON.stringify(window.EduPulseData.courses));
    this.state.departments = JSON.parse(JSON.stringify(window.EduPulseData.departments));
    this.state.auditLogs = JSON.parse(JSON.stringify(window.EduPulseData.auditLogs));
    this.persist(false);
  }

  persist(syncToBackend = true) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify({
        students: this.state.students,
        courses: this.state.courses,
        departments: this.state.departments,
        auditLogs: this.state.auditLogs
      }));
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
    this.notify();
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify() {
    this.listeners.forEach(fn => fn(this.state));
  }

  // --- Audit Logging ---
  logAction(action, user, details) {
    const newLog = {
      id: 'LOG-' + Math.floor(100 + Math.random() * 900),
      time: 'Just now',
      action,
      user: user || (this.state.currentRole === 'admin' ? 'Dr. Arthur Vance (Dean)' : 'Faculty Advisor'),
      details
    };
    this.state.auditLogs.unshift(newLog);
    if (this.state.auditLogs.length > 30) this.state.auditLogs.pop();
    this.persist(false);
  }

  getStudents() {
    return this.state.students;
  }

  getStudentById(id) {
    return this.state.students.find(s => s.id === id);
  }

  // --- CRUD: Add Student ---
  async addStudent(studentData) {
    const cgpa = parseFloat(studentData.cgpa) || 0;
    let standing = 'Good Standing';
    if (cgpa >= 9.0) standing = "Dean's List";
    else if (cgpa < 5.0) standing = 'Academic Probation';

    const colors = ['#3b82f6', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b', '#06b6d4', '#6366f1'];
    const avatarBg = colors[Math.floor(Math.random() * colors.length)];

    const id = 'STU-' + (1000 + this.state.students.length + 1 + Math.floor(Math.random() * 100));

    const newStudent = {
      id,
      rollNo: studentData.rollNo.trim().toUpperCase(),
      name: studentData.name.trim(),
      email: studentData.email.trim().toLowerCase(),
      phone: studentData.phone || '+91 98000 00000',
      gender: studentData.gender || 'Other',
      dob: studentData.dob || '2004-01-01',
      bloodGroup: studentData.bloodGroup || 'O+',
      avatarBg: studentData.avatarBg || avatarBg,
      department: studentData.department,
      semester: parseInt(studentData.semester) || 1,
      academicYear: studentData.academicYear || '2024-2028',
      cgpa: cgpa,
      attendance: parseFloat(studentData.attendance) || 85.0,
      feeStatus: studentData.feeStatus || 'Paid',
      feeDue: parseFloat(studentData.feeDue) || 0,
      academicStanding: standing,
      mentor: studentData.mentor || 'Faculty Advisor Assigned',
      address: studentData.address || 'Campus Hostel Block B',
      guardian: {
        name: studentData.guardianName || 'Guardian',
        phone: studentData.guardianPhone || '+91 98000 99999',
        relation: studentData.guardianRelation || 'Parent'
      },
      courses: studentData.courses && studentData.courses.length ? studentData.courses : [
        { code: 'CS301', title: 'Data Structures & Algorithms', credits: 4, grade: 'A', gradePoint: 8, attendance: 88, internal: 40, final: 42 }
      ],
      semesterHistory: [
        { semester: `Sem ${studentData.semester || 1}`, sgpa: cgpa, credits: 22 }
      ],
      remarks: studentData.remarks || 'Newly enrolled candidate.',
      achievements: studentData.achievements ? [studentData.achievements] : ['Freshman Orientation Participant']
    };

    // If Flask Backend is online, POST to SQLite
    if (this.isBackendOnline) {
      try {
        await fetch(`${this.apiBase}/students`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newStudent)
        });
      } catch (err) {
        console.warn('Flask POST failed, saving locally:', err);
      }
    }

    this.state.students.unshift(newStudent);
    this.logAction('Student Added', null, `Created student record for ${newStudent.name} (${newStudent.rollNo})`);
    this.persist(false);
    return newStudent;
  }

  // --- CRUD: Update Student ---
  async updateStudent(id, updatedFields) {
    const index = this.state.students.findIndex(s => s.id === id);
    if (index === -1) return null;

    const current = this.state.students[index];
    let standing = current.academicStanding;
    if (updatedFields.cgpa !== undefined) {
      const cgpa = parseFloat(updatedFields.cgpa);
      if (cgpa >= 9.0) standing = "Dean's List";
      else if (cgpa < 5.0) standing = 'Academic Probation';
      else standing = 'Good Standing';
    }

    const updated = {
      ...current,
      ...updatedFields,
      academicStanding: updatedFields.academicStanding || standing
    };
    this.state.students[index] = updated;

    // Send update to Flask API if online
    if (this.isBackendOnline) {
      try {
        await fetch(`${this.apiBase}/students/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updated)
        });
      } catch (e) {
        console.warn('Flask PUT failed, saving locally:', e);
      }
    }

    this.logAction('Student Record Updated', null, `Modified profile for ${updated.name} (${updated.rollNo})`);
    this.persist(false);
    return updated;
  }

  // --- CRUD: Delete Student ---
  async deleteStudent(id) {
    const student = this.getStudentById(id);
    if (!student) return false;

    // Send delete to Flask API if online
    if (this.isBackendOnline) {
      try {
        await fetch(`${this.apiBase}/students/${id}`, { method: 'DELETE' });
      } catch (e) {
        console.warn('Flask DELETE failed, removing locally:', e);
      }
    }

    this.state.students = this.state.students.filter(s => s.id !== id);
    this.logAction('Student Record Deleted', null, `Removed student ${student.name} (${student.rollNo})`);
    this.persist(false);
    return true;
  }

  // --- Quick Attendance Adjustment ---
  async markQuickAttendance(studentId, isPresent) {
    const s = this.getStudentById(studentId);
    if (!s) return;
    const delta = isPresent ? +1.2 : -2.5;
    let newAtt = Math.min(100, Math.max(10, s.attendance + delta));
    newAtt = Math.round(newAtt * 10) / 10;

    if (this.isBackendOnline) {
      try {
        await fetch(`${this.apiBase}/students/${studentId}/attendance`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ isPresent })
        });
      } catch (e) {
        console.warn('Flask attendance update failed:', e);
      }
    }

    this.updateStudent(studentId, { attendance: newAtt });
  }

  dispatchWarningNotice(studentId) {
    const s = this.getStudentById(studentId);
    if (!s) return;
    this.logAction('Formal Warning Issued', 'System Compliance Engine', `Notice sent to ${s.name} (Attendance: ${s.attendance}%)`);
    return `Warning dispatch simulation triggered for ${s.name} & guardian (${s.guardian.phone})`;
  }

  getAnalytics() {
    const students = this.state.students;
    const total = students.length;
    if (total === 0) {
      return {
        total: 0, avgCgpa: 0, avgAttendance: 0, feeCollectionRate: 0,
        atRiskCount: 0, deansListCount: 0, departmentDistribution: {},
        gradeDistribution: { 'O (9.0-10)': 0, 'A (8.0-8.9)': 0, 'B (7.0-7.9)': 0, 'C (5.0-6.9)': 0, 'Probation (<5.0)': 0 }
      };
    }

    const totalCgpa = students.reduce((acc, s) => acc + (s.cgpa || 0), 0);
    const totalAtt = students.reduce((acc, s) => acc + (s.attendance || 0), 0);
    const fullyPaid = students.filter(s => s.feeStatus === 'Paid').length;
    const atRisk = students.filter(s => s.attendance < 75 || s.cgpa < 5.0).length;
    const deansList = students.filter(s => s.cgpa >= 9.0).length;

    const deptDist = {};
    students.forEach(s => {
      deptDist[s.department] = (deptDist[s.department] || 0) + 1;
    });

    const gradeDist = {
      'O (9.0-10)': students.filter(s => s.cgpa >= 9.0).length,
      'A (8.0-8.9)': students.filter(s => s.cgpa >= 8.0 && s.cgpa < 9.0).length,
      'B (7.0-7.9)': students.filter(s => s.cgpa >= 7.0 && s.cgpa < 8.0).length,
      'C (5.0-6.9)': students.filter(s => s.cgpa >= 5.0 && s.cgpa < 7.0).length,
      'Probation (<5)': students.filter(s => s.cgpa < 5.0).length
    };

    return {
      total,
      avgCgpa: (totalCgpa / total).toFixed(2),
      avgAttendance: (totalAtt / total).toFixed(1),
      feeCollectionRate: Math.round((fullyPaid / total) * 100),
      atRiskCount: atRisk,
      deansListCount: deansList,
      departmentDistribution: deptDist,
      gradeDistribution: gradeDist
    };
  }

  loadEdgeCases() {
    this.loadDefaults();
    this.state.students.unshift({
      id: 'STU-9901',
      rollNo: '2023CSE999',
      name: 'Alexander Turing',
      email: 'a.turing@aurainst.edu',
      phone: '+91 99999 11111',
      gender: 'Male',
      dob: '2004-06-23',
      bloodGroup: 'AB+',
      avatarBg: '#8b5cf6',
      department: 'CSE',
      semester: 6,
      academicYear: '2023-2027',
      cgpa: 10.0,
      attendance: 100.0,
      feeStatus: 'Paid',
      feeDue: 0,
      academicStanding: "Dean's List",
      mentor: 'Dr. Sarah Jenkins',
      address: '1 Cambridge Way, Bengaluru',
      guardian: { name: 'E. Turing', phone: '+91 99999 00000', relation: 'Father' },
      courses: [{ code: 'CS301', title: 'Data Structures & Algorithms', credits: 4, grade: 'O', gradePoint: 10, attendance: 100, internal: 50, final: 50 }],
      semesterHistory: [{ semester: 'Sem 1', sgpa: 10, credits: 24 }],
      remarks: 'Edge Case Test: Perfect 10.0 CGPA & 100% Attendance.',
      achievements: ['Turing Award Youth Medalist']
    });
    this.logAction('Reviewer Preset Loaded', 'Reviewer Mode', 'Injected boundary test profiles');
    this.persist(false);
  }

  resetToDefault() {
    this.loadDefaults();
    this.logAction('Database Factory Reset', 'Admin Vance', 'Restored default standard academic dataset');
  }

  clearDatabase() {
    this.state.students = [];
    this.logAction('Database Cleared', 'Admin Vance', 'Purged all student records for fresh entry test');
    this.persist(false);
  }

  exportToJson() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(this.state, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute("href", dataStr);
    dlAnchor.setAttribute("download", `edupulse_sims_backup_${new Date().toISOString().slice(0,10)}.json`);
    dlAnchor.click();
    this.logAction('Database Backup Exported', null, 'Downloaded JSON backup file');
  }

  importFromJson(jsonString) {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.students && Array.isArray(parsed.students)) {
        this.state.students = parsed.students;
        if (parsed.courses) this.state.courses = parsed.courses;
        if (parsed.departments) this.state.departments = parsed.departments;
        this.logAction('Database Imported', null, `Restored ${parsed.students.length} students from backup file`);
        this.persist(false);
        return { success: true, count: parsed.students.length };
      }
      return { success: false, error: 'Invalid file format: missing students array' };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }

  exportToCsv(filteredStudents) {
    const list = filteredStudents || this.state.students;
    const headers = ['Roll No', 'Name', 'Email', 'Department', 'Semester', 'CGPA', 'Attendance (%)', 'Academic Standing', 'Fee Status', 'Fee Due (INR)', 'Phone', 'Mentor'];
    const rows = list.map(s => [
      `"${s.rollNo}"`, `"${s.name}"`, `"${s.email}"`, `"${s.department}"`,
      s.semester, s.cgpa, s.attendance, `"${s.academicStanding}"`,
      `"${s.feeStatus}"`, s.feeDue || 0, `"${s.phone}"`, `"${s.mentor}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `student_roster_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    this.logAction('Roster Exported to CSV', null, `Exported ${list.length} student records`);
  }
}

window.EduStore = new EduPulseStore();
