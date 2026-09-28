# 🎓 EduPulse SIMS - Enterprise Student Information Management System
> **Full-Stack Academic ERP & Academic Intelligence Platform**  
> **Tech Stack:** Python Flask (REST API) • SQLite 3 • Semantic HTML5 • Vanilla CSS3 Glassmorphism • ES6+ JavaScript

[![Backend](https://img.shields.io/badge/Backend-Python%20Flask%203.x-blue.svg)](#)
[![Database](https://img.shields.io/badge/Database-SQLite%203%20Relational-green.svg)](#)
[![Frontend](https://img.shields.io/badge/Frontend-HTML5%20%7C%20CSS3%20%7C%20Vanilla%20JS-orange.svg)](#)
[![Accreditation](https://img.shields.io/badge/Compliance-AICTE%20%7C%20UGC%20CBCS%20%7C%20NAAC-purple.svg)](#)

---

## 📌 Project Overview

**EduPulse SIMS** is a production-grade full-stack Student Information Management System designed for university accreditation, academic record governance, and examiner/reviewer evaluations.

It integrates a **Python Flask REST API backend** with a **relational SQLite database**, coupled to a **modern Glassmorphism frontend** built with semantic HTML5, Vanilla CSS, and JavaScript.

---

## 🛠️ Complete Technology Stack

| Layer | Technology | Purpose & Implementation |
|:---|:---|:---|
| **Backend Framework** | **Python Flask 3.x** (`app.py`) | RESTful API endpoints for student CRUD, attendance, fees, and analytics. |
| **Relational Database** | **SQLite 3** (`database.py` & `edupulse.db`) | Normalized tables for `students`, `courses`, `departments`, and `audit_logs`. |
| **Frontend Structure** | **Semantic HTML5** (`index.html`) | Accessible layout, modular view sections, modals, and print containers. |
| **Frontend Styling** | **Vanilla CSS3** (`css/`) | Glassmorphism, Obsidian Dark & Crisp Light modes, responsive layouts. |
| **Frontend Logic** | **Modern ES6+ JavaScript** (`js/`) | Reactive store (`store.js`), API sync, Retina Canvas charts (`charts.js`). |

---

## 🚀 How to Run the Project

### Option A: One-Click Windows Launcher (Recommended)
Double-click:
```batch
start_presentation.bat
```
*This starts the Python Flask server and automatically opens `http://127.0.0.1:5000` in your default browser.*

### Option B: Command Line (Python Flask)
```powershell
python app.py
```
Then visit: **[http://127.0.0.1:5000](http://127.0.0.1:5000)**

---

## 📡 RESTful API Endpoints (Python Flask)

| Method | Endpoint | Description |
|:---|:---|:---|
| `GET` | `/` | Serves the main HTML5 dashboard application |
| `GET` | `/api/health` | System health check (Flask version, SQLite status) |
| `GET` | `/api/students` | List students with query filters (`department`, `semester`, `search`) |
| `GET` | `/api/students/<id>` | Fetch student 360° record by ID |
| `POST` | `/api/students` | Register new student (validates roll number uniqueness & GPA) |
| `PUT` | `/api/students/<id>` | Update student profile and records in SQLite |
| `DELETE` | `/api/students/<id>` | Delete student with governance audit logging |
| `POST` | `/api/students/<id>/attendance` | Quick attendance marker (Present/Absent delta) |
| `POST` | `/api/students/<id>/pay-fees` | Settle outstanding fee dues |
| `GET` | `/api/analytics` | High-level aggregated KPIs computed in SQLite |
| `GET` | `/api/courses` | Choice Based Credit System (CBCS) course catalog |
| `GET` | `/api/audit-logs` | Governance and activity audit trail |

---

## 🏛️ System Architecture

```
┌────────────────────────────────────────────────────────┐
│           CLIENT PRESENTATION (HTML5 / CSS3 / JS)       │
│  Glassmorphism UI • Canvas Charts • Print Templates   │
└──────────────────────────┬─────────────────────────────┘
                           │ HTTP REST API (fetch JSON)
┌──────────────────────────▼─────────────────────────────┐
│              FLASK BACKEND CONTROLLER (app.py)          │
│  Routing • Input Validation • Business Logic • Logging │
└──────────────────────────┬─────────────────────────────┘
                           │ SQL Queries (Cursor / Connection)
┌──────────────────────────▼─────────────────────────────┐
│             RELATIONAL DATABASE (edupulse.db)           │
│  students • courses • departments • audit_logs         │
└────────────────────────────────────────────────────────┘
```

---

## 🎙️ Viva Voce Defense Cheat Sheet (For Your Reviewer)

### Q1: What tech stack was used and why?
> **Answer:** We used **Python Flask** for a clean, lightweight REST API backend, **SQLite** for relational data persistence with foreign keys and ACID compliance, and **HTML5, CSS3, and JavaScript** for a responsive, zero-dependency client with high-DPI Canvas charts and printable NAAC grade sheets.

### Q2: How does the frontend interact with the Flask backend?
> **Answer:** The frontend's reactive store (`store.js`) asynchronously communicates with Flask endpoints (`/api/students`, `/api/analytics`) using `fetch()` with JSON payloads. Changes are atomically saved to SQLite, and cached locally for fault tolerance.

### Q3: How is the CGPA computed?
> **Answer:** It uses the UGC Choice Based Credit System (CBCS):
> $$\text{CGPA} = \frac{\sum (\text{Credits}_i \times \text{GradePoint}_i)}{\sum \text{Credits}_i}$$
> Letter grades map to: O = 10, A+ = 9, A = 8, B+ = 7, B = 6, C = 5, F = 0.

### Q4: How is attendance compliance enforced?
> **Answer:** An automated compliance heuristic checks each student against the statutory 75% cutoff (AICTE/UGC rule). Defaulters are dynamically flagged with danger badges and isolated in the Attendance Early-Warning Center for intervention.

---

## 📂 Source Code Layout

```
crt/
├── app.py                      # Flask Application & REST API Endpoints
├── database.py                 # SQLite Schema Definition, Seeds & Connection
├── edupulse.db                 # SQLite Relational Database File
├── index.html                  # Main HTML5 Single Page Application
├── start_presentation.bat      # 1-Click Windows Launcher (Flask + Browser)
├── README.md                   # Complete Documentation & Viva Defense Guide
├── assets/
│   └── crest.jpg               # University Crest Emblem
├── css/
│   ├── style.css               # Design System, Themes (Dark/Light), Layouts
│   ├── components.css          # KPI Cards, Charts, Tables, Modals, Badges
│   ├── reviewer.css            # Reviewer Deck, Architecture Visualizer & ERD
│   └── print.css               # Print Formatting for Transcripts & ID Cards
└── js/
    ├── app.js                  # Main Application Controller & View Routing
    ├── store.js                # Data Store & Flask REST API Sync Engine
    ├── charts.js               # Pure Canvas Chart Rendering Engine
    ├── transcript.js           # Transcript & ID Badge Generator
    ├── reviewer.js             # Reviewer Presentation Deck & Guided Tour
    └── data.js                 # Fallback Client Mock Dataset
```
