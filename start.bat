@echo off
title Portfolio Local Dev Server
echo ===================================================
echo   Portfolio Local Launcher
echo ===================================================
echo.
echo [1/2] Opening http://localhost:5173 in default browser...
start http://localhost:5173

echo [2/2] Launching Vite development server...
npm run dev
pause
