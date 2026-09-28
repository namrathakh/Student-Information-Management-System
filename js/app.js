/**
 * EduPulse SIMS - Main Application Controller
 * Handles View Routing, Event Listeners, Modals, Forms, Filters & Rendering
 */

const App = {
  activeView: 'dashboard',
  viewMode: 'grid', // 'grid' or 'table'
  filters: {
    search: '',
    department: 'ALL',
    semester: 'ALL',
    standing: 'ALL',
    feeStatus: 'ALL',
    sortBy: 'cgpa_desc'
  },
  selectedStudent: null,

  init() {
    this.setupTheme();
    this.bindEvents();
    this.render();

    // Subscribe to store updates
    window.EduStore.subscribe(() => {
      this.render();
    });

    // Handle global shortcuts
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.getElementById('search-students');
        if (searchInput) searchInput.focus();
      }
    });

    // Initialize Reviewer Kit
    window.ReviewerKit.init();
  },

  setupTheme() {
    const saved = localStorage.getItem('edupulse_theme') || 'dark';
    if (saved === 'light') {
      document.body.classList.add('light-theme');
    } else {
      document.body.classList.remove('light-theme');
    }
  },

  toggleTheme() {
    const isLight = document.body.classList.toggle('light-theme');
    localStorage.setItem('edupulse_theme', isLight ? 'light' : 'dark');
    this.renderCharts();
  },

  bindEvents() {
    // Nav view switching
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetView = link.dataset.view;
        this.switchView(targetView);
      });
    });

    // Theme toggle
    const themeBtn = document.getElementById('btn-theme-toggle');
    if (themeBtn) themeBtn.addEventListener('click', () => this.toggleTheme());

    // Role switcher
    const roleSelect = document.getElementById('role-selector');
    if (roleSelect) {
      roleSelect.addEventListener('change', (e) => {
        window.EduStore.state.currentRole = e.target.value;
        this.handleRoleChange(e.target.value);
      });
    }

    // Search and filter inputs
    const searchInput = document.getElementById('search-students');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.filters.search = e.target.value.toLowerCase();
        this.renderStudentsView();
      });
    }

    const deptFilter = document.getElementById('filter-dept');
    if (deptFilter) {
      deptFilter.addEventListener('change', (e) => {
        this.filters.department = e.target.value;
        this.renderStudentsView();
      });
    }

    const semFilter = document.getElementById('filter-sem');
    if (semFilter) {
      semFilter.addEventListener('change', (e) => {
        this.filters.semester = e.target.value;
        this.renderStudentsView();
      });
    }

    const standingFilter = document.getElementById('filter-standing');
    if (standingFilter) {
      standingFilter.addEventListener('change', (e) => {
        this.filters.standing = e.target.value;
        this.renderStudentsView();
      });
    }

    const sortFilter = document.getElementById('filter-sort');
    if (sortFilter) {
      sortFilter.addEventListener('change', (e) => {
        this.filters.sortBy = e.target.value;
        this.renderStudentsView();
      });
    }

    // View toggle buttons
    const btnGrid = document.getElementById('btn-view-grid');
    const btnTable = document.getElementById('btn-view-table');
    if (btnGrid && btnTable) {
      btnGrid.addEventListener('click', () => {
        this.viewMode = 'grid';
        btnGrid.classList.add('active');
        btnTable.classList.remove('active');
        this.renderStudentsView();
      });
      btnTable.addEventListener('click', () => {
        this.viewMode = 'table';
        btnTable.classList.add('active');
        btnGrid.classList.remove('active');
        this.renderStudentsView();
      });
    }

    // Add Student Form submission
    const addForm = document.getElementById('form-add-student');
    if (addForm) {
      addForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleCreateStudent(e.target);
      });
    }

    // Edit Student Form submission
    const editForm = document.getElementById('form-edit-student');
    if (editForm) {
      editForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleUpdateStudent(e.target);
      });
    }

    // Database Import/Export triggers
    const btnExportJson = document.getElementById('btn-export-json');
    if (btnExportJson) {
      btnExportJson.addEventListener('click', () => window.EduStore.exportToJson());
    }

    const fileInputImport = document.getElementById('file-input-import');
    if (fileInputImport) {
      fileInputImport.addEventListener('change', (e) => this.handleFileImport(e));
    }

    const btnExportCsv = document.getElementById('btn-export-csv');
    if (btnExportCsv) {
      btnExportCsv.addEventListener('click', () => {
        const filtered = this.getFilteredStudents();
        window.EduStore.exportToCsv(filtered);
        this.showToast(`Exported ${filtered.length} students to CSV.`);
      });
    }

    // Window resize chart re-render
    window.addEventListener('resize', () => {
      if (this.activeView === 'dashboard') {
        this.renderCharts();
      }
    });
  },

  handleRoleChange(role) {
    const roleBadge = document.getElementById('current-role-label');
    if (roleBadge) {
      if (role === 'admin') roleBadge.innerText = 'Dean & Super Admin';
      else if (role === 'faculty') roleBadge.innerText = 'Faculty Advisor';
      else roleBadge.innerText = 'Student Self-Service';
    }

    if (role === 'student') {
      this.switchView('student-portal');
    } else if (this.activeView === 'student-portal') {
      this.switchView('dashboard');
    }

    this.showToast(`Switched active view role to: ${role.toUpperCase()}`);
    this.render();
  },

  switchView(viewName) {
    this.activeView = viewName;
    document.querySelectorAll('.view-section').forEach(sec => {
      sec.classList.remove('active');
    });

    const targetSec = document.getElementById(`view-${viewName}`);
    if (targetSec) targetSec.classList.add('active');

    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.toggle('active', link.dataset.view === viewName);
    });

    this.render();
  },

  render() {
    this.updateKpiCounters();
    if (this.activeView === 'dashboard') {
      this.renderCharts();
      this.renderTopPerformers();
      this.renderAuditLogs();
    } else if (this.activeView === 'students') {
      this.renderStudentsView();
    } else if (this.activeView === 'attendance') {
      this.renderAttendanceCenter();
    } else if (this.activeView === 'courses') {
      this.renderCoursesView();
    } else if (this.activeView === 'fees') {
      this.renderFeesView();
    } else if (this.activeView === 'student-portal') {
      this.renderStudentPortalView();
    }
  },

  // KPI Metrics Counter
  updateKpiCounters() {
    const analytics = window.EduStore.getAnalytics();

    const countTotal = document.getElementById('kpi-total-students');
    const avgCgpa = document.getElementById('kpi-avg-cgpa');
    const avgAtt = document.getElementById('kpi-avg-attendance');
    const feeRate = document.getElementById('kpi-fee-rate');
    const atRisk = document.getElementById('kpi-at-risk');

    if (countTotal) countTotal.innerText = analytics.total;
    if (avgCgpa) avgCgpa.innerText = analytics.avgCgpa;
    if (avgAtt) avgAtt.innerText = `${analytics.avgAttendance}%`;
    if (feeRate) feeRate.innerText = `${analytics.feeCollectionRate}%`;
    if (atRisk) atRisk.innerText = analytics.atRiskCount;
  },

  // Analytics Charts
  renderCharts() {
    const analytics = window.EduStore.getAnalytics();
    setTimeout(() => {
      window.ChartEngine.renderDeptDonut('canvas-dept-donut', analytics.departmentDistribution, 'donut-legend-container');
      window.ChartEngine.renderGradeBar('canvas-grade-bars', analytics.gradeDistribution);
    }, 50);
  },

  // Dean's Honor Roll Top Performers
  renderTopPerformers() {
    const container = document.getElementById('top-performers-list');
    if (!container) return;

    const top5 = [...window.EduStore.getStudents()]
      .sort((a, b) => b.cgpa - a.cgpa)
      .slice(0, 5);

    if (top5.length === 0) {
      container.innerHTML = `<p class="text-muted text-center py-4">No student records registered.</p>`;
      return;
    }

    container.innerHTML = top5.map((s, idx) => `
      <div class="performer-row" onclick="App.openStudentProfile('${s.id}')">
        <div class="performer-rank">#${idx + 1}</div>
        <div class="performer-avatar" style="background:${s.avatarBg}">${s.name[0]}</div>
        <div class="performer-info">
          <strong>${s.name}</strong>
          <small class="text-muted mono">${s.rollNo} • ${s.department}</small>
        </div>
        <div class="performer-score mono">
          <span class="cgpa-highlight">${s.cgpa.toFixed(2)}</span>
          <small>CGPA</small>
        </div>
      </div>
    `).join('');
  },

  // System Audit Activity Log
  renderAuditLogs() {
    const container = document.getElementById('audit-log-stream');
    if (!container) return;

    const logs = window.EduStore.state.auditLogs.slice(0, 5);
    container.innerHTML = logs.map(l => `
      <div class="audit-item">
        <div class="audit-dot"></div>
        <div class="audit-content">
          <div class="audit-header">
            <strong>${l.action}</strong>
            <span class="audit-time">${l.time}</span>
          </div>
          <p class="audit-details">${l.details}</p>
          <small class="audit-user mono">${l.user}</small>
        </div>
      </div>
    `).join('');
  },

  // Filter students based on current filter state
  getFilteredStudents() {
    const { search, department, semester, standing, feeStatus, sortBy } = this.filters;
    let list = [...window.EduStore.getStudents()];

    if (search) {
      list = list.filter(s => 
        s.name.toLowerCase().includes(search) ||
        s.rollNo.toLowerCase().includes(search) ||
        s.email.toLowerCase().includes(search) ||
        s.department.toLowerCase().includes(search)
      );
    }

    if (department !== 'ALL') {
      list = list.filter(s => s.department === department);
    }

    if (semester !== 'ALL') {
      list = list.filter(s => s.semester === parseInt(semester));
    }

    if (standing !== 'ALL') {
      list = list.filter(s => s.academicStanding === standing);
    }

    if (feeStatus !== 'ALL') {
      list = list.filter(s => s.feeStatus === feeStatus);
    }

    // Sorting
    list.sort((a, b) => {
      if (sortBy === 'cgpa_desc') return b.cgpa - a.cgpa;
      if (sortBy === 'cgpa_asc') return a.cgpa - b.cgpa;
      if (sortBy === 'name_asc') return a.name.localeCompare(b.name);
      if (sortBy === 'attendance_asc') return a.attendance - b.attendance;
      if (sortBy === 'attendance_desc') return b.attendance - a.attendance;
      if (sortBy === 'roll_asc') return a.rollNo.localeCompare(b.rollNo);
      return 0;
    });

    return list;
  },

  // Render Students Roster View (Grid or Table)
  renderStudentsView() {
    const list = this.getFilteredStudents();
    const countLabel = document.getElementById('student-count-badge');
    if (countLabel) countLabel.innerText = `${list.length} Students`;

    const container = document.getElementById('student-roster-container');
    if (!container) return;

    if (list.length === 0) {
      container.innerHTML = `
        <div class="empty-state-box">
          <div class="empty-icon">🔍</div>
          <h3>No students match your criteria</h3>
          <p class="text-muted">Try clearing the filters or click "Reset to Standard Dataset" in the Reviewer Deck.</p>
          <button class="btn btn-outline" onclick="App.clearFilters()">Clear Filters</button>
        </div>
      `;
      return;
    }

    if (this.viewMode === 'grid') {
      container.innerHTML = `
        <div class="students-grid">
          ${list.map(s => this.renderStudentCard(s)).join('')}
        </div>
      `;
    } else {
      container.innerHTML = `
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Roll No</th>
                <th>Department</th>
                <th>Sem</th>
                <th>CGPA</th>
                <th>Attendance</th>
                <th>Fee Status</th>
                <th>Standing</th>
                <th class="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              ${list.map(s => this.renderStudentTableRow(s)).join('')}
            </tbody>
          </table>
        </div>
      `;
    }
  },

  renderStudentCard(s) {
    const attClass = s.attendance < 75 ? 'danger' : (s.attendance < 85 ? 'warning' : 'success');
    const isProbation = s.cgpa < 5.0 || s.attendance < 75;

    return `
      <div class="student-card ${isProbation ? 'card-risk' : ''}">
        <div class="card-top">
          <div class="student-avatar" style="background:${s.avatarBg}">
            ${s.name.split(' ').map(n=>n[0]).join('')}
          </div>
          <div class="card-identity">
            <h4 class="student-name" onclick="App.openStudentProfile('${s.id}')">${s.name}</h4>
            <span class="student-roll mono">${s.rollNo}</span>
          </div>
          <span class="dept-tag dept-${s.department.toLowerCase()}">${s.department}</span>
        </div>

        <div class="card-metrics-grid">
          <div class="metric-cell">
            <span class="lbl">CGPA</span>
            <strong class="val mono text-primary">${s.cgpa.toFixed(2)}</strong>
          </div>
          <div class="metric-cell">
            <span class="lbl">Attendance</span>
            <strong class="val mono text-${attClass}">${s.attendance}%</strong>
          </div>
          <div class="metric-cell">
            <span class="lbl">Semester</span>
            <strong class="val">Sem ${s.semester}</strong>
          </div>
        </div>

        <div class="card-status-row">
          <span class="badge badge-${s.feeStatus.toLowerCase()}">${s.feeStatus === 'Paid' ? '✓ Fees Paid' : (s.feeStatus === 'Partial' ? '⚠ Partial Fee' : '✖ Fee Due')}</span>
          <span class="badge badge-${s.academicStanding.toLowerCase().replace(/[^a-z]/g, '')}">${s.academicStanding}</span>
        </div>

        <div class="card-actions">
          <button class="btn btn-sm btn-ghost" onclick="App.openStudentProfile('${s.id}')">View 360°</button>
          <button class="btn btn-sm btn-ghost" title="Print Transcript" onclick="window.AcademicDocumentEngine.openTranscript('${s.id}')">Transcript</button>
          ${window.EduStore.state.currentRole === 'admin' ? `
            <button class="btn btn-sm btn-icon" title="Edit Student" onclick="App.openEditModal('${s.id}')">✏</button>
            <button class="btn btn-sm btn-icon btn-danger-icon" title="Delete Student" onclick="App.confirmDelete('${s.id}')">🗑</button>
          ` : ''}
        </div>
      </div>
    `;
  },

  renderStudentTableRow(s) {
    const attClass = s.attendance < 75 ? 'text-danger font-bold' : 'text-success';
    return `
      <tr>
        <td>
          <div class="table-user-cell" onclick="App.openStudentProfile('${s.id}')">
            <div class="table-avatar" style="background:${s.avatarBg}">${s.name[0]}</div>
            <div>
              <strong>${s.name}</strong>
              <small class="text-muted block">${s.email}</small>
            </div>
          </div>
        </td>
        <td class="mono font-semibold">${s.rollNo}</td>
        <td><span class="dept-tag dept-${s.department.toLowerCase()}">${s.department}</span></td>
        <td class="text-center font-semibold">Sem ${s.semester}</td>
        <td><strong class="mono text-primary">${s.cgpa.toFixed(2)}</strong></td>
        <td><span class="mono ${attClass}">${s.attendance}% ${s.attendance < 75 ? '⚠️' : ''}</span></td>
        <td><span class="badge badge-${s.feeStatus.toLowerCase()}">${s.feeStatus}</span></td>
        <td><span class="badge badge-${s.academicStanding.toLowerCase().replace(/[^a-z]/g, '')}">${s.academicStanding}</span></td>
        <td class="text-right">
          <button class="btn btn-sm btn-ghost" onclick="App.openStudentProfile('${s.id}')">Profile</button>
          <button class="btn btn-sm btn-ghost" onclick="window.AcademicDocumentEngine.openTranscript('${s.id}')">Grade Card</button>
          ${window.EduStore.state.currentRole === 'admin' ? `
            <button class="btn btn-sm btn-icon" onclick="App.openEditModal('${s.id}')">✏</button>
            <button class="btn btn-sm btn-icon btn-danger-icon" onclick="App.confirmDelete('${s.id}')">🗑</button>
          ` : ''}
        </td>
      </tr>
    `;
  },

  clearFilters() {
    this.filters = {
      search: '',
      department: 'ALL',
      semester: 'ALL',
      standing: 'ALL',
      feeStatus: 'ALL',
      sortBy: 'cgpa_desc'
    };

    const searchInput = document.getElementById('search-students');
    const deptFilter = document.getElementById('filter-dept');
    const semFilter = document.getElementById('filter-sem');
    const standingFilter = document.getElementById('filter-standing');
    const sortFilter = document.getElementById('filter-sort');

    if (searchInput) searchInput.value = '';
    if (deptFilter) deptFilter.value = 'ALL';
    if (semFilter) semFilter.value = 'ALL';
    if (standingFilter) standingFilter.value = 'ALL';
    if (sortFilter) sortFilter.value = 'cgpa_desc';

    this.renderStudentsView();
    this.showToast('All filters cleared');
  },

  // Student 360° Profile Drawer / Modal
  openStudentProfile(studentId) {
    const student = window.EduStore.getStudentById(studentId);
    if (!student) return;

    this.selectedStudent = student;
    const modal = document.getElementById('student-profile-modal');
    const content = document.getElementById('profile-modal-content');
    if (!modal || !content) return;

    content.innerHTML = `
      <div class="profile-header-banner">
        <div class="profile-avatar-large" style="background:${student.avatarBg}">
          ${student.name.split(' ').map(n=>n[0]).join('')}
        </div>
        <div class="profile-main-meta">
          <div class="profile-title-row">
            <h2>${student.name}</h2>
            <span class="badge badge-${student.academicStanding.toLowerCase().replace(/[^a-z]/g, '')}">${student.academicStanding}</span>
          </div>
          <p class="profile-subtitle mono text-primary">${student.rollNo} • ${student.department} • Semester ${student.semester} (${student.academicYear})</p>
          <div class="profile-contact-chips">
            <span>✉ ${student.email}</span>
            <span>📞 ${student.phone}</span>
            <span>🩸 Blood: ${student.bloodGroup || 'O+'}</span>
            <span>👤 Mentor: ${student.mentor}</span>
          </div>
        </div>
        <div class="profile-quick-actions">
          <button class="btn btn-primary" onclick="window.AcademicDocumentEngine.openTranscript('${student.id}')">📄 Official Transcript</button>
          <button class="btn btn-outline" onclick="window.AcademicDocumentEngine.openIdCard('${student.id}')">🪪 ID Badge</button>
          ${student.attendance < 75 ? `
            <button class="btn btn-warning" onclick="App.triggerWarningNotice('${student.id}')">⚠️ Issue Warning</button>
          ` : ''}
        </div>
      </div>

      <div class="profile-tabs-nav">
        <button class="profile-tab-btn active" data-ptab="academic" onclick="App.switchProfileTab(this, 'academic')">Academic Trajectory</button>
        <button class="profile-tab-btn" data-ptab="courses" onclick="App.switchProfileTab(this, 'courses')">Enrolled Courses & Grades</button>
        <button class="profile-tab-btn" data-ptab="attendance" onclick="App.switchProfileTab(this, 'attendance')">Attendance & Compliance</button>
        <button class="profile-tab-btn" data-ptab="financial" onclick="App.switchProfileTab(this, 'financial')">Financial Ledger</button>
      </div>

      <div class="profile-tab-content-area" id="profile-tab-body">
        <!-- Default Academic Tab -->
        ${this.getProfileAcademicTabHtml(student)}
      </div>
    `;

    modal.classList.add('active');
    setTimeout(() => {
      window.ChartEngine.renderSgpaLine('canvas-student-sgpa', student.semesterHistory || []);
    }, 100);
  },

  switchProfileTab(buttonEl, tabName) {
    document.querySelectorAll('.profile-tab-btn').forEach(btn => btn.classList.remove('active'));
    buttonEl.classList.add('active');

    const container = document.getElementById('profile-tab-body');
    if (!container || !this.selectedStudent) return;

    if (tabName === 'academic') {
      container.innerHTML = this.getProfileAcademicTabHtml(this.selectedStudent);
      setTimeout(() => {
        window.ChartEngine.renderSgpaLine('canvas-student-sgpa', this.selectedStudent.semesterHistory || []);
      }, 50);
    } else if (tabName === 'courses') {
      container.innerHTML = this.getProfileCoursesTabHtml(this.selectedStudent);
    } else if (tabName === 'attendance') {
      container.innerHTML = this.getProfileAttendanceTabHtml(this.selectedStudent);
    } else if (tabName === 'financial') {
      container.innerHTML = this.getProfileFinancialTabHtml(this.selectedStudent);
    }
  },

  getProfileAcademicTabHtml(student) {
    return `
      <div class="ptab-pane animate-fade">
        <div class="ptab-grid-stats">
          <div class="metric-card">
            <span class="lbl">Cumulative GPA</span>
            <strong class="val text-primary mono">${student.cgpa.toFixed(2)}</strong>
            <small class="text-muted">Out of 10.0 scale</small>
          </div>
          <div class="metric-card">
            <span class="lbl">Overall Attendance</span>
            <strong class="val mono ${student.attendance < 75 ? 'text-danger' : 'text-success'}">${student.attendance}%</strong>
            <small class="${student.attendance < 75 ? 'text-danger font-semibold' : 'text-muted'}">${student.attendance < 75 ? '⚠️ Below 75% Cutoff' : '✓ Compliant'}</small>
          </div>
          <div class="metric-card">
            <span class="lbl">Total Earned Credits</span>
            <strong class="val mono">86 / 160</strong>
            <small class="text-muted">Degree Progress: 54%</small>
          </div>
        </div>

        <div class="chart-card mt-4">
          <div class="card-header">
            <h4>Semester SGPA Progression Trendline</h4>
            <span class="badge">UGC 10-Point Scale</span>
          </div>
          <div class="chart-canvas-container" style="height: 180px;">
            <canvas id="canvas-student-sgpa"></canvas>
          </div>
        </div>

        <div class="mentor-notes-card mt-4">
          <h4>Advisor Observations & Honors</h4>
          <p class="mentor-note-text">"${student.remarks || 'Student is maintaining satisfactory academic progress.'}"</p>
          <div class="achieve-tags">
            ${(student.achievements || []).map(a => `<span class="achieve-pill">🏆 ${a}</span>`).join('')}
          </div>
        </div>
      </div>
    `;
  },

  getProfileCoursesTabHtml(student) {
    const rows = (student.courses || []).map(c => `
      <tr>
        <td class="mono font-semibold">${c.code}</td>
        <td>${c.title}</td>
        <td class="text-center font-bold">${c.credits}</td>
        <td class="text-center mono">${c.internal || 45}/50</td>
        <td class="text-center mono">${c.final || 48}/50</td>
        <td class="text-center"><span class="grade-pill grade-${(c.grade || 'A').toLowerCase()}">${c.grade}</span></td>
        <td class="text-center mono">${c.gradePoint} pts</td>
        <td class="text-center mono ${c.attendance < 75 ? 'text-danger' : 'text-success'}">${c.attendance || 85}%</td>
      </tr>
    `).join('');

    return `
      <div class="ptab-pane animate-fade">
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Course Name</th>
                <th class="text-center">Credits</th>
                <th class="text-center">Internal</th>
                <th class="text-center">Final</th>
                <th class="text-center">Grade</th>
                <th class="text-center">Points</th>
                <th class="text-center">Attendance</th>
              </tr>
            </thead>
            <tbody>
              ${rows}
            </tbody>
          </table>
        </div>
      </div>
    `;
  },

  getProfileAttendanceTabHtml(student) {
    const isRisk = student.attendance < 75;
    return `
      <div class="ptab-pane animate-fade">
        <div class="compliance-banner ${isRisk ? 'alert-danger' : 'alert-success'}">
          <div class="compliance-icon">${isRisk ? '🚨' : '✅'}</div>
          <div>
            <h4>${isRisk ? 'CRITICAL ATTENDANCE ALERT: 75% CUTOFF VIOLATION' : 'ATTENDANCE SATISFACTORY & COMPLIANT'}</h4>
            <p>${isRisk ? 'Student has recorded attendance below statutory minimum (75%). At risk of exam debarment without condonation.' : 'Student satisfies university attendance eligibility criteria for end-semester examinations.'}</p>
          </div>
        </div>

        <div class="attendance-actions-grid mt-4">
          <div class="att-card">
            <h4>Quick Attendance Adjustment (Demonstration)</h4>
            <p class="text-muted">Simulate daily roll call logging for this student:</p>
            <div class="btn-group">
              <button class="btn btn-success" onclick="App.markAttendance('${student.id}', true)">+ Mark Present (+1.2%)</button>
              <button class="btn btn-danger-outline" onclick="App.markAttendance('${student.id}', false)">- Mark Absent (-2.5%)</button>
            </div>
          </div>

          <div class="att-card">
            <h4>Guardian & Student Communication</h4>
            <p><strong>Registered Guardian:</strong> ${student.guardian.name} (${student.guardian.relation})</p>
            <p><strong>Contact Phone:</strong> <span class="mono">${student.guardian.phone}</span></p>
            <button class="btn btn-warning mt-2" onclick="App.triggerWarningNotice('${student.id}')">📧 Send Formal Warning SMS/Email</button>
          </div>
        </div>
      </div>
    `;
  },

  getProfileFinancialTabHtml(student) {
    return `
      <div class="ptab-pane animate-fade">
        <div class="fee-overview-box">
          <div class="fee-col">
            <span class="lbl">Tuition Fee Status</span>
            <span class="badge badge-${student.feeStatus.toLowerCase()}">${student.feeStatus.toUpperCase()}</span>
          </div>
          <div class="fee-col">
            <span class="lbl">Outstanding Balance</span>
            <strong class="val mono ${student.feeDue > 0 ? 'text-danger' : 'text-success'}">INR ₹${(student.feeDue || 0).toLocaleString()}</strong>
          </div>
          <div class="fee-col text-right">
            ${student.feeDue > 0 ? `
              <button class="btn btn-primary" onclick="App.payFees('${student.id}')">Pay Outstanding Dues</button>
            ` : `
              <span class="text-success font-semibold">✓ Account Fully Settled</span>
            `}
          </div>
        </div>

        <div class="receipt-breakdown mt-4">
          <h4>Fee Structure & Ledger (Academic Year 2026-27)</h4>
          <table class="data-table">
            <thead>
              <tr><th>Fee Component</th><th>Billed Amount</th><th>Paid Amount</th><th>Due</th></tr>
            </thead>
            <tbody>
              <tr><td>Academic Tuition Fee</td><td>₹85,000</td><td>${student.feeStatus === 'Paid' ? '₹85,000' : (student.feeStatus === 'Partial' ? '₹60,000' : '₹25,000')}</td><td>₹${student.feeDue || 0}</td></tr>
              <tr><td>Laboratory & Computational Infra Fee</td><td>₹15,000</td><td>₹15,000</td><td>₹0</td></tr>
              <tr><td>Library & Digital Journals</td><td>₹5,000</td><td>₹5,000</td><td>₹0</td></tr>
              <tr><td>University Exam Fee</td><td>₹5,000</td><td>₹5,000</td><td>₹0</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    `;
  },

  markAttendance(studentId, isPresent) {
    window.EduStore.markQuickAttendance(studentId, isPresent);
    this.selectedStudent = window.EduStore.getStudentById(studentId);
    this.openStudentProfile(studentId);
    this.showToast(`Updated attendance for ${this.selectedStudent.name}: ${this.selectedStudent.attendance}%`);
  },

  triggerWarningNotice(studentId) {
    const res = window.EduStore.dispatchWarningNotice(studentId);
    this.showToast(res);
  },

  payFees(studentId) {
    window.EduStore.updateStudent(studentId, { feeStatus: 'Paid', feeDue: 0 });
    this.selectedStudent = window.EduStore.getStudentById(studentId);
    this.openStudentProfile(studentId);
    this.showToast('Payment successful! Account marked as PAID.');
  },

  // Modal Controls
  openAddModal() {
    const modal = document.getElementById('add-student-modal');
    if (modal) modal.classList.add('active');
  },

  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.remove('active');
  },

  handleCreateStudent(form) {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    // Validation
    if (!data.name || !data.rollNo || !data.email) {
      this.showToast('Please fill in Name, Roll Number, and Email');
      return;
    }

    // Check duplicate roll number
    const existing = window.EduStore.getStudents().find(s => s.rollNo.toUpperCase() === data.rollNo.trim().toUpperCase());
    if (existing) {
      this.showToast(`Roll number "${data.rollNo}" already registered!`);
      return;
    }

    const created = window.EduStore.addStudent(data);
    form.reset();
    this.closeModal('add-student-modal');
    this.showToast(`Registered new student: ${created.name} (${created.rollNo})`);
    this.switchView('students');
  },

  openEditModal(studentId) {
    const s = window.EduStore.getStudentById(studentId);
    if (!s) return;

    const modal = document.getElementById('edit-student-modal');
    if (!modal) return;

    document.getElementById('edit-student-id').value = s.id;
    document.getElementById('edit-rollNo').value = s.rollNo;
    document.getElementById('edit-name').value = s.name;
    document.getElementById('edit-email').value = s.email;
    document.getElementById('edit-phone').value = s.phone;
    document.getElementById('edit-dept').value = s.department;
    document.getElementById('edit-semester').value = s.semester;
    document.getElementById('edit-cgpa').value = s.cgpa;
    document.getElementById('edit-attendance').value = s.attendance;
    document.getElementById('edit-feeStatus').value = s.feeStatus;
    document.getElementById('edit-mentor').value = s.mentor;

    modal.classList.add('active');
  },

  handleUpdateStudent(form) {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    const id = data.id;

    window.EduStore.updateStudent(id, {
      name: data.name.trim(),
      email: data.email.trim(),
      phone: data.phone.trim(),
      department: data.department,
      semester: parseInt(data.semester),
      cgpa: parseFloat(data.cgpa),
      attendance: parseFloat(data.attendance),
      feeStatus: data.feeStatus,
      mentor: data.mentor.trim()
    });

    this.closeModal('edit-student-modal');
    this.showToast('Student record updated successfully.');
  },

  confirmDelete(studentId) {
    const s = window.EduStore.getStudentById(studentId);
    if (!s) return;

    if (confirm(`Are you sure you want to delete student "${s.name}" (${s.rollNo})?\n\nThis will remove their academic records.`)) {
      window.EduStore.deleteStudent(studentId);
      this.showToast(`Deleted ${s.name} from records.`);
    }
  },

  // Attendance Compliance Early-Warning Center View
  renderAttendanceCenter() {
    const container = document.getElementById('attendance-defaulters-list');
    if (!container) return;

    const students = window.EduStore.getStudents();
    const defaulters = students.filter(s => s.attendance < 75);

    const countDef = document.getElementById('att-defaulter-count');
    if (countDef) countDef.innerText = `${defaulters.length} Students At Risk`;

    if (defaulters.length === 0) {
      container.innerHTML = `
        <div class="empty-state-box">
          <div class="empty-icon">🎉</div>
          <h3>100% Attendance Compliance!</h3>
          <p class="text-muted">All enrolled students currently meet or exceed the statutory 75% attendance threshold.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = defaulters.map(s => `
      <div class="defaulter-row">
        <div class="defaulter-avatar" style="background:${s.avatarBg}">${s.name[0]}</div>
        <div class="defaulter-info">
          <h4>${s.name}</h4>
          <span class="mono">${s.rollNo} • ${s.department} • Sem ${s.semester}</span>
        </div>
        <div class="defaulter-stat">
          <span class="val text-danger mono font-bold">${s.attendance}%</span>
          <small class="text-danger">Deficit: ${(75 - s.attendance).toFixed(1)}%</small>
        </div>
        <div class="defaulter-actions">
          <button class="btn btn-sm btn-ghost" onclick="App.openStudentProfile('${s.id}')">Profile</button>
          <button class="btn btn-sm btn-warning" onclick="App.triggerWarningNotice('${s.id}')">Send Notice</button>
        </div>
      </div>
    `).join('');
  },

  dispatchBulkAttendanceWarnings() {
    const defaulters = window.EduStore.getStudents().filter(s => s.attendance < 75);
    if (defaulters.length === 0) {
      this.showToast('No defaulters found to notify.');
      return;
    }

    defaulters.forEach(s => window.EduStore.dispatchWarningNotice(s.id));
    this.showToast(`Dispatched official warning notifications to ${defaulters.length} student portals & registered guardians.`);
  },

  // Courses Catalog View
  renderCoursesView() {
    const container = document.getElementById('courses-catalog-grid');
    if (!container) return;

    const courses = window.EduStore.state.courses;
    const students = window.EduStore.getStudents();

    container.innerHTML = courses.map(c => {
      // Find students taking this course
      const enrolled = students.filter(s => (s.courses || []).some(sc => sc.code === c.code));
      return `
        <div class="course-card">
          <div class="course-header">
            <span class="course-code mono">${c.code}</span>
            <span class="course-credits">${c.credits} Credits</span>
          </div>
          <h3 class="course-title">${c.title}</h3>
          <p class="course-instructor">👨‍🏫 ${c.instructor}</p>
          <div class="course-meta">
            <span>Branch: <strong>${c.dept}</strong></span>
            <span>Semester: <strong>${c.semester}</strong></span>
          </div>
          <div class="course-footer">
            <span class="enrolled-badge mono">👥 ${enrolled.length} Enrolled</span>
            <button class="btn btn-sm btn-outline" onclick="App.filterByCourse('${c.code}')">View Roster</button>
          </div>
        </div>
      `;
    }).join('');
  },

  filterByCourse(code) {
    this.switchView('students');
    this.filters.search = code.toLowerCase();
    const searchInput = document.getElementById('search-students');
    if (searchInput) searchInput.value = code;
    this.renderStudentsView();
  },

  // Fees & Financial View
  renderFeesView() {
    const students = window.EduStore.getStudents();
    const totalDues = students.reduce((acc, s) => acc + (s.feeDue || 0), 0);
    const paidCount = students.filter(s => s.feeStatus === 'Paid').length;
    const pendingCount = students.filter(s => s.feeStatus !== 'Paid').length;

    const totalDueEl = document.getElementById('fee-total-dues');
    const paidCountEl = document.getElementById('fee-paid-count');
    const pendingCountEl = document.getElementById('fee-pending-count');

    if (totalDueEl) totalDueEl.innerText = `₹${totalDues.toLocaleString()}`;
    if (paidCountEl) paidCountEl.innerText = paidCount;
    if (pendingCountEl) pendingCountEl.innerText = pendingCount;

    const container = document.getElementById('fee-students-table-body');
    if (!container) return;

    container.innerHTML = students.map(s => `
      <tr>
        <td class="mono font-semibold">${s.rollNo}</td>
        <td><strong>${s.name}</strong></td>
        <td>${s.department}</td>
        <td><span class="badge badge-${s.feeStatus.toLowerCase()}">${s.feeStatus}</span></td>
        <td class="mono font-bold ${s.feeDue > 0 ? 'text-danger' : 'text-success'}">₹${(s.feeDue || 0).toLocaleString()}</td>
        <td class="text-right">
          ${s.feeDue > 0 ? `
            <button class="btn btn-sm btn-primary" onclick="App.payFees('${s.id}')">Collect Fee</button>
          ` : `
            <span class="text-success mono font-semibold">Cleared</span>
          `}
        </td>
      </tr>
    `).join('');
  },

  // Student Self-Service Portal View
  renderStudentPortalView() {
    const student = window.EduStore.getStudents()[0] || null;
    const container = document.getElementById('student-portal-content');
    if (!container || !student) return;

    container.innerHTML = `
      <div class="portal-card animate-fade">
        <div class="portal-welcome-banner">
          <div class="portal-avatar" style="background:${student.avatarBg}">${student.name[0]}</div>
          <div>
            <h2>Welcome back, ${student.name}!</h2>
            <p class="mono">${student.rollNo} | ${student.department} | Term: Fall 2026-27</p>
          </div>
          <div class="portal-top-actions">
            <button class="btn btn-primary" onclick="window.AcademicDocumentEngine.openTranscript('${student.id}')">📄 Download Grade Sheet</button>
            <button class="btn btn-outline" onclick="window.AcademicDocumentEngine.openIdCard('${student.id}')">🪪 Digital Student ID</button>
          </div>
        </div>

        <div class="portal-stats-grid mt-4">
          <div class="metric-card">
            <span class="lbl">Cumulative GPA (CGPA)</span>
            <strong class="val mono text-primary">${student.cgpa.toFixed(2)}</strong>
            <small>Dean's Honor Scale</small>
          </div>
          <div class="metric-card">
            <span class="lbl">Semester Attendance</span>
            <strong class="val mono ${student.attendance < 75 ? 'text-danger' : 'text-success'}">${student.attendance}%</strong>
            <small>${student.attendance >= 75 ? '✓ Exam Eligible' : '⚠️ Debarment Warning'}</small>
          </div>
          <div class="metric-card">
            <span class="lbl">Fee Clearance</span>
            <strong class="val mono ${student.feeDue > 0 ? 'text-danger' : 'text-success'}">${student.feeStatus.toUpperCase()}</strong>
            <small>Dues: ₹${student.feeDue || 0}</small>
          </div>
        </div>

        <div class="portal-courses-box mt-4">
          <h3>Registered Courses for Current Term</h3>
          <table class="data-table">
            <thead>
              <tr><th>Course Code</th><th>Title</th><th>Credits</th><th>Midterm</th><th>Grade</th><th>Attendance</th></tr>
            </thead>
            <tbody>
              ${(student.courses || []).map(c => `
                <tr>
                  <td class="mono font-semibold">${c.code}</td>
                  <td>${c.title}</td>
                  <td>${c.credits}</td>
                  <td>${c.internal || 45}/50</td>
                  <td><span class="grade-pill grade-${(c.grade || 'A').toLowerCase()}">${c.grade}</span></td>
                  <td class="mono ${c.attendance < 75 ? 'text-danger' : 'text-success'}">${c.attendance || 85}%</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  },

  // Toast notifications
  showToast(message) {
    let toast = document.getElementById('app-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'app-toast';
      toast.className = 'app-toast';
      document.body.appendChild(toast);
    }

    toast.innerText = message;
    toast.classList.add('show');
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 3800);
  },

  handleFileImport(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = window.EduStore.importFromJson(event.target.result);
      if (result.success) {
        this.showToast(`Imported ${result.count} students from backup!`);
      } else {
        alert('Import Error: ' + result.error);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  }
};

window.App = App;

// Bootstrap on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
