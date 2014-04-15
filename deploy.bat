@ECHO OFF
TITLE=build

SET bootpath=C:\node\work\personal\cellvia.github.io\app

echo closing all previous node processes
taskkill /F /IM node.exe > nul
taskkill /F /IM cmd.exe /FI "windowtitle eq bootstrap*" > nul

echo deploying
start "bootstrap deploy" /min cmd /k "cd %bootpath% && npm run deploy && cd .. && local_windows_devservers.bat"



exit