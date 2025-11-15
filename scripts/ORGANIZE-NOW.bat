@echo off
echo.
echo ===================================
echo  DREAMCATCHER DOCUMENTATION
echo  ORGANIZATION SCRIPT
echo ===================================
echo.
echo This will move 19 documentation files
echo to organized folders.
echo.
pause
echo.

REM Create directories
echo Creating folders...
mkdir docs\planning 2>nul
mkdir docs\setup 2>nul
mkdir docs\architecture 2>nul
mkdir docs\marketing 2>nul
mkdir docs\sessions 2>nul

REM Planning
echo Moving planning docs...
if exist PROJECT_PLAN.md move PROJECT_PLAN.md docs\planning\
if exist MOBILE_APP_PLAN.md move MOBILE_APP_PLAN.md docs\planning\
if exist PHASE_6_SUMMARY.md move PHASE_6_SUMMARY.md docs\planning\
if exist SUPABASE_MIGRATION_PLAN.md move SUPABASE_MIGRATION_PLAN.md docs\planning\

REM Setup
echo Moving setup docs...
if exist QUICK_SETUP.md move QUICK_SETUP.md docs\setup\
if exist SETUP_COMPLETE.md move SETUP_COMPLETE.md docs\setup\
if exist REPO_SETUP_COMPLETE.md move REPO_SETUP_COMPLETE.md docs\setup\
if exist GITHUB_SETUP_COMPLETE.md move GITHUB_SETUP_COMPLETE.md docs\setup\
if exist SETUP_GIT_FLOW.md move SETUP_GIT_FLOW.md docs\setup\
if exist FIX_VITE_ERROR.md move FIX_VITE_ERROR.md docs\setup\

REM Architecture
echo Moving architecture docs...
if exist ECOSYSTEM_VISION.md move ECOSYSTEM_VISION.md docs\architecture\
if exist UI_UPDATE_SUMMARY.md move UI_UPDATE_SUMMARY.md docs\architecture\
if exist IMPLEMENTATION_COMPLETE.md move IMPLEMENTATION_COMPLETE.md docs\architecture\

REM Marketing
echo Moving marketing docs...
if exist BRAND_STRUCTURE.md move BRAND_STRUCTURE.md docs\marketing\
if exist LAUNCH_CHECKLIST.md move LAUNCH_CHECKLIST.md docs\marketing\
if exist THE_REAL_STORY.md move THE_REAL_STORY.md docs\marketing\
if exist TEASER_SITE_UPDATE.md move TEASER_SITE_UPDATE.md docs\marketing\
if exist REAL_DREAMS_DEMO.json move REAL_DREAMS_DEMO.json docs\marketing\

REM Sessions
echo Moving session docs...
if exist SESSION_SUMMARY.md move SESSION_SUMMARY.md docs\sessions\

REM Scripts
echo Moving scripts...
if exist setup.bat move setup.bat scripts\
if exist setup-git.bat move setup-git.bat scripts\
if exist setup-git.ps1 move setup-git.ps1 scripts\
if exist start-dev.bat move start-dev.bat scripts\

echo.
echo ===================================
echo  ORGANIZATION COMPLETE!
echo ===================================
echo.
echo Your documentation is now organized:
echo   docs\planning\     - 4 files
echo   docs\setup\        - 6 files  
echo   docs\architecture\ - 3 files
echo   docs\marketing\    - 5 files
echo   docs\sessions\     - 1 file
echo   scripts\           - All scripts
echo.
echo View the docs hub: docs\README.md
echo.
pause

