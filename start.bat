start "chrome.exe *32" "http://localhost:8000/app/index.html"
call "C:\Program Files\nodejs\node.exe" scripts\web-server.js %*

