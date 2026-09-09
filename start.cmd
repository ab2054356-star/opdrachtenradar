@echo off
REM Start de Opdrachtenradar-server. Dubbelklik dit bestand.
REM %~dp0 is de map waar dit bestand zelf staat, dus het werkt overal.
cd /d "%~dp0"
title Opdrachtenradar
node backend\server.js
REM pause houdt het venster open als de server stopt, zodat je de fout kunt lezen.
pause
