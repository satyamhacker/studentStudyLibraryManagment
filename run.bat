:: filepath: c:\Users\satyam singh\Desktop\vite-project\studentStudyLibraryManagment\start-servers.bat
@echo off
echo Starting backend server...
start "" /b cmd /c "cd backEnd && cd Controller && node Route.mjs"

echo Starting frontend server...
start "" /b cmd /c "cd frontEnd && npm run preview"

echo Both servers are running.
pause