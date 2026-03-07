@echo off
echo Starting JSON Server...
start cmd /k "json-server --watch db.json --port 3000"
timeout /t 3
echo Starting Angular App...
start cmd /k "ng serve"
echo.
echo ========================================
echo JSON Server: http://localhost:3000
echo Angular App: http://localhost:4200
echo ========================================
