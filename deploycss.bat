@ECHO OFF
TITLE=build

SET bootpath=C:\node\work\personal\cellvia.github.io\app

echo deploying
start "bootstrap deploy-css" /min cmd /k "cd %bootpath% && npm run deploy-css"



exit