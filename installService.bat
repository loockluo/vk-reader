@echo off
echo %CD%
cd %~dp0
echo %CD%
set NODE_SKIP_PLATFORM_CHECK=1
"./node-v14.9.0-win-x86/node.exe" "install.js" 

set SERVICE_NAME=vkreader.exe

sc query %SERVICE_NAME% | find "RUNNING"
if %errorlevel% neq 0 (
    echo %SERVICE_NAME% is not running. Starting the service...
    sc start %SERVICE_NAME%
) else (
    echo %SERVICE_NAME% is already running.
)
