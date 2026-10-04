@echo off
title Oven ^& Artisan
cd /d "%~dp0Content"
echo.
echo   Oven ^& Artisan — starting the bakery...
echo   The site will open in your browser in a few seconds.
echo   Press Ctrl+C in this window to stop it.
echo.
start /min cmd /c "timeout /t 8 /nobreak >nul & start http://localhost:3000"
call npm run dev
pause
