@echo off
setlocal
set "ROOT=%~dp0"
set "NODE_DIR=C:\Users\gerri\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin"
set "PATH=%NODE_DIR%;%PATH%"
set "XDG_CONFIG_HOME=%ROOT%.wrangler"
set "WRANGLER_HOME=%ROOT%.wrangler"
cd /d "%ROOT%"
"%NODE_DIR%\node.exe" "%ROOT%node_modules\vinext\dist\cli.js" dev > "%ROOT%server.out.log" 2> "%ROOT%server.err.log"
