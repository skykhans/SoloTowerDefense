@echo off
setlocal

set "ROOT=%~dp0"
cd /d "%ROOT%"

set "PORT=8000"
set "URL=http://localhost:%PORT%"

where py >nul 2>nul
if %errorlevel%==0 (
  set "PY_CMD=py -m http.server %PORT%"
) else (
  where python >nul 2>nul
  if %errorlevel%==0 (
    set "PY_CMD=python -m http.server %PORT%"
  ) else (
    echo Python not found. Please install Python 3 first.
    pause
    exit /b 1
  )
)

echo Starting SoloTowerDefense at %URL%
start "SoloTowerDefense Server" cmd /k "cd /d ""%ROOT%"" && %PY_CMD%"
timeout /t 2 /nobreak >nul
start "" "%URL%"
