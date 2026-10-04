@echo off
title Oven ^& Artisan Backend
cd /d "%~dp0"
echo.
echo   Oven ^& Artisan backend starting...
echo   API will be live at http://localhost:4000
echo   Health check: http://localhost:4000/api/health
echo   Press Ctrl+C in this window to stop it.
echo.
if not exist node_modules (
  echo   First run: installing dependencies...
  call npm install
)
call npm start
pause
