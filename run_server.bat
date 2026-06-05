@echo off
echo Starting GARDIN Local Web Server...
echo -----------------------------------
echo Opening your browser to http://localhost:8080...
start "" "http://localhost:8080/index.html"
npx http-server -p 8080
pause
