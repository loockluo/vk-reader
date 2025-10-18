@echo off
echo %CD%
set NODE_SKIP_PLATFORM_CHECK=1
"./node-v14.9.0-win-x86/npm" "i" "node-windows" "--registry=https://registry.npmmirror.com" 
pause