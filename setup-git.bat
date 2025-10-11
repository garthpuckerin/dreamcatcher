@echo off
echo Initializing Git repository...
git init
git add .
git commit -m "feat: Initial commit - Dreamcatcher v2.1.0 with PM features"
git branch -M main
git branch develop
git checkout develop
git checkout -b feature-2.2
git remote add origin https://github.com/garthpuckerin/dreamcatcher.git
echo.
echo Git setup complete!
echo.
echo Branches created:
git branch -a
echo.
echo Ready to push to GitHub with:
echo   git push -u origin main
echo   git push -u origin develop
echo   git push -u origin feature-2.2

