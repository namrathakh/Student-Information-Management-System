@echo off
title Push EduPulse to GitHub
color 0A
echo ======================================================================
echo    Pushing EduPulse SIMS to GitHub:
echo    https://github.com/namrathakh/Student-Information-Management-System
echo ======================================================================
echo.
echo Running git push -u origin main...
echo (If prompted, please sign in via your browser or GitHub credentials)
echo.
"C:\Program Files\Git\cmd\git.exe" push -u origin main
echo.
echo ======================================================================
echo Done! If you see 'Branch main set up to track remote branch', 
echo your code has been successfully pushed to GitHub!
echo ======================================================================
pause
