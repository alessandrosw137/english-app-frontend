@echo off
title English App - Backend Server (Port 3000)
cd /d "%~dp0"
echo ========================================================
echo   Iniciando English App Backend & PostgreSQL Sync
echo ========================================================
node scripts\start-server.js
pause
