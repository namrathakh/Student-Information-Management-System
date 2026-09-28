@echo off
title EduPulse SIMS - Python Flask & SQLite Reviewer Presentation Launcher
color 0B
echo ======================================================================
echo    EduPulse: Next-Gen Student Information & Academic System
echo       Tech Stack: Python Flask + SQLite + HTML5 + CSS3 + JS
echo              Reviewer Presentation & Defense Showcase
echo ======================================================================
echo.
echo [1/2] Initializing SQLite database and starting Python Flask server...
echo [2/2] Opening application in your default browser at http://127.0.0.1:5000...
echo.

where python >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    start http://127.0.0.1:5000
    python app.py
) else (
    echo Python not found in PATH. Opening index.html directly in browser...
    start index.html
)
pause
