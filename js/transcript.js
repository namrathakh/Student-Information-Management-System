/**
 * EduPulse SIMS - Academic Transcript & Identity Card Generator
 * Formats official printable university transcripts, student ID badges, and fee receipts
 */

const AcademicDocumentEngine = {
  // 1. Generate & Open Official Transcript Modal
  openTranscript(studentId) {
    const student = window.EduStore.getStudentById(studentId);
    if (!student) return;

    const modal = document.getElementById('transcript-modal');
    const content = document.getElementById('transcript-modal-body');
    if (!modal || !content) return;

    const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const totalCredits = (student.courses || []).reduce((acc, c) => acc + (c.credits || 0), 0);
    const weightedPoints = (student.courses || []).reduce((acc, c) => acc + (c.credits * (c.gradePoint || 0)), 0);
    const semGpa = totalCredits > 0 ? (weightedPoints / totalCredits).toFixed(2) : student.cgpa;

    const courseRows = (student.courses || []).map((c, i) => `
      <tr>
        <td class="text-center">${i + 1}</td>
        <td class="mono font-semibold">${c.code}</td>
        <td>${c.title}</td>
        <td class="text-center">${c.credits}</td>
        <td class="text-center">${c.internal || 45}/50</td>
        <td class="text-center">${c.final || 48}/50</td>
        <td class="text-center font-bold">${(c.internal || 45) + (c.final || 48)}/100</td>
        <td class="text-center"><span class="grade-pill grade-${(c.grade || 'A').toLowerCase()}">${c.grade}</span></td>
        <td class="text-center mono">${c.gradePoint}</td>
      </tr>
    `).join('');

    content.innerHTML = `
      <div class="transcript-paper" id="printable-transcript">
        <!-- University Official Header -->
        <div class="transcript-header">
          <div class="transcript-logo">
            <img src="assets/crest.jpg" alt="University Crest" class="seal-img" onerror="this.src='https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=100&auto=format&fit=crop&q=80'">
          </div>
          <div class="transcript-univ-info">
            <h2 class="univ-name">AURA INSTITUTE OF TECHNOLOGY & SCIENCES</h2>
            <p class="univ-sub">Autonomous Institution Accredited with 'A++' Grade by NAAC | Approved by AICTE & UGC</p>
            <p class="univ-address">University Campus, Knowledge City Expressway, Bengaluru - 560100</p>
            <div class="transcript-title-band">OFFICIAL ACADEMIC TRANSCRIPT & GRADE REPORT</div>
          </div>
          <div class="transcript-doc-meta">
            <div class="qr-box">
              <div class="qr-mock"></div>
              <small class="mono">VERIFIED SECURE</small>
            </div>
            <div class="doc-serial mono">SERIAL: TR-2026-${student.id.replace('STU-', '')}</div>
          </div>
        </div>

        <!-- Student Particulars Card -->
        <div class="transcript-student-meta">
          <div class="meta-row">
            <div class="meta-item"><span class="meta-lbl">Candidate Name:</span> <strong class="meta-val">${student.name}</strong></div>
            <div class="meta-item"><span class="meta-lbl">University Reg / Roll No:</span> <strong class="meta-val mono text-primary">${student.rollNo}</strong></div>
          </div>
          <div class="meta-row">
            <div class="meta-item"><span class="meta-lbl">Department / Degree:</span> <span class="meta-val">${student.department} - Bachelor of Technology</span></div>
            <div class="meta-item"><span class="meta-lbl">Current Academic Term:</span> <span class="meta-val">Semester ${student.semester} (${student.academicYear})</span></div>
          </div>
          <div class="meta-row">
            <div class="meta-item"><span class="meta-lbl">Date of Birth:</span> <span class="meta-val">${student.dob || 'N/A'} (Blood: ${student.bloodGroup || 'N/A'})</span></div>
            <div class="meta-item"><span class="meta-lbl">Issue Date:</span> <span class="meta-val">${today}</span></div>
          </div>
        </div>

        <!-- Course Table -->
        <div class="transcript-table-wrapper">
          <table class="transcript-table">
            <thead>
              <tr>
                <th width="5%">#</th>
                <th width="12%">Course Code</th>
                <th width="35%">Course Description / Title</th>
                <th width="8%">Credits</th>
                <th width="10%">Internal (50)</th>
                <th width="10%">End Sem (50)</th>
                <th width="10%">Total (100)</th>
                <th width="5%">Grade</th>
                <th width="5%">Points</th>
              </tr>
            </thead>
            <tbody>
              ${courseRows}
            </tbody>
          </table>
        </div>

        <!-- Cumulative Assessment Summary -->
        <div class="transcript-summary-box">
          <div class="summary-metric">
            <span class="lbl">Semester GPA (SGPA)</span>
            <span class="val mono">${semGpa}</span>
          </div>
          <div class="summary-metric highlight">
            <span class="lbl">Cumulative GPA (CGPA)</span>
            <span class="val mono">${student.cgpa.toFixed(2)} / 10.0</span>
          </div>
          <div class="summary-metric">
            <span class="lbl">Semester Attendance</span>
            <span class="val mono ${student.attendance < 75 ? 'text-danger' : 'text-success'}">${student.attendance}%</span>
          </div>
          <div class="summary-metric">
            <span class="lbl">Standing Status</span>
            <span class="val standing-badge">${student.academicStanding}</span>
          </div>
        </div>

        <!-- Grading Legend -->
        <div class="grading-scale-legend">
          <small><strong>Grading Scale:</strong> O (Outstanding: 10 pts) | A+ (Excellent: 9 pts) | A (Very Good: 8 pts) | B+ (Good: 7 pts) | B (Above Avg: 6 pts) | C (Pass: 5 pts) | F (Fail: 0 pts)</small>
        </div>

        <!-- Official Signatures & Seal -->
        <div class="transcript-signatures">
          <div class="sig-block">
            <div class="sig-line"></div>
            <div class="sig-name">Prepared By</div>
            <div class="sig-role">Academic Section Officer</div>
          </div>
          <div class="sig-block">
            <div class="sig-stamp">
              <span>INSTITUTIONAL</span>
              <strong>SEAL</strong>
              <span>AUTHENTIC</span>
            </div>
          </div>
          <div class="sig-block">
            <div class="sig-line cursive">Arthur Vance</div>
            <div class="sig-name">Dr. Arthur Vance, Ph.D.</div>
            <div class="sig-role">Controller of Examinations</div>
          </div>
        </div>
      </div>
    `;

    modal.classList.add('active');
  },

  // 2. Generate Student ID Badge Modal
  openIdCard(studentId) {
    const student = window.EduStore.getStudentById(studentId);
    if (!student) return;

    const modal = document.getElementById('idcard-modal');
    const content = document.getElementById('idcard-modal-body');
    if (!modal || !content) return;

    content.innerHTML = `
      <div class="id-card-display" id="printable-id-card">
        <!-- Front of Badge -->
        <div class="id-card front">
          <div class="id-header">
            <img src="assets/crest.jpg" alt="Crest" class="id-crest" onerror="this.style.display='none'">
            <div class="id-inst-name">
              <span>AURA INSTITUTE OF TECHNOLOGY</span>
              <small>STUDENT IDENTITY PASS</small>
            </div>
          </div>
          <div class="id-body">
            <div class="id-photo-frame" style="background:${student.avatarBg};">
              <span class="id-avatar-initials">${student.name.split(' ').map(n=>n[0]).join('')}</span>
            </div>
            <h3 class="id-student-name">${student.name}</h3>
            <div class="id-roll-badge mono">${student.rollNo}</div>
            
            <div class="id-info-grid">
              <div class="id-row"><span class="k">Major:</span> <span class="v">${student.department}</span></div>
              <div class="id-row"><span class="k">Semester:</span> <span class="v">${student.semester}</span></div>
              <div class="id-row"><span class="k">Blood Grp:</span> <span class="v">${student.bloodGroup || 'O+'}</span></div>
              <div class="id-row"><span class="k">Emergency:</span> <span class="v mono">${student.guardian.phone || student.phone}</span></div>
            </div>
          </div>
          <div class="id-footer">
            <div class="barcode-mock"></div>
            <small class="validity">VALID THRU: JULY 2028</small>
          </div>
        </div>
      </div>
    `;

    modal.classList.add('active');
  },

  // 3. Print helper
  printElement(elementId) {
    window.print();
  }
};

window.AcademicDocumentEngine = AcademicDocumentEngine;
