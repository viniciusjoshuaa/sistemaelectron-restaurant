@echo off
cd /d "%~dp0"

echo Installing dependencies...
call npm install
if errorlevel 1 (
  echo.
  echo Failed to install dependencies.
  pause
  exit /b 1
)

echo.
echo Starting application...
call npm start
pause
