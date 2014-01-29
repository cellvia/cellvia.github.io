@ECHO OFF
TITLE=servers

SET bootpath=C:\node\work\personal\cellvia.github.io

echo closing all previous node processes
taskkill /F /IM node.exe > nul
taskkill /F /IM cmd.exe /FI "windowtitle eq bootstrap*" > nul

echo starting bootstrap
start "bootstrap app" /min cmd /k "cd %bootpath% && npm install && nodemon %bootpath%\server\app.js --watch %bootpath%\server --watch %bootpath%\node_modules"

echo starting grunt watch
start "bootstrap grunt watch" /min cmd /k "cd %bootpath%\ && grunt && grunt watch"

echo exit in... 5
ping 1.1.1.1 -n 1 -w 1000 > nul
echo 4
ping 1.1.1.1 -n 1 -w 1000 > nul
echo 3
ping 1.1.1.1 -n 1 -w 1000 > nul
echo 2
ping 1.1.1.1 -n 1 -w 1000 > nul
echo 1
ping 1.1.1.1 -n 1 -w 1000 > nul
exit