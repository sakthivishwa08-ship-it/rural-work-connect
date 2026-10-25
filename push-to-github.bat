@echo off
title Push Rural Work Connect to GitHub
echo ========================================================
echo Pushing Rural Work Connect files to your GitHub repo...
echo ========================================================
echo.

"C:\Program Files\Git\cmd\git.exe" push -u origin main

echo.
if %errorlevel% neq 0 (
    echo.
    echo If prompted to log in, please sign in through your browser.
) else (
    echo.
    echo ========================================================
    echo SUCCESS! All files have been uploaded to GitHub!
    echo Open Bolt.new using this link:
    echo https://bolt.new/github.com/sakthivishwa08-ship-it/rural-work-connect
    echo ========================================================
)
echo.
pause
