@ECHO OFF
TITLE=servers

SET bootpath=C:\node\work\personal\cellvia.github.io\app

echo closing all previous node processes
taskkill /F /IM node.exe > nul
taskkill /F /IM cmd.exe /FI "windowtitle eq bootstrap*" > nul

echo 1
ping 1.1.1.1 -n 1 -w 1000 > nul

echo starting watchify
start "bootstrap watch-desktop" /min cmd /k "cd %bootpath% && npm run watch-desktop"

echo starting watchify
start "bootstrap watch-mobile" /min cmd /k "cd %bootpath% && npm run watch-mobile"

echo 2
ping 1.1.1.1 -n 1 -w 1000 > nul
echo 3
ping 1.1.1.1 -n 1 -w 1000 > nul
echo 4
ping 1.1.1.1 -n 1 -w 1000 > nul
echo 5
ping 1.1.1.1 -n 1 -w 1000 > nul
echo 6
ping 1.1.1.1 -n 1 -w 1000 > nul

echo starting bootstrap
start "bootstrap app" /min cmd /k "cd %bootpath% && nodemon -w server -w node_modules"


exit