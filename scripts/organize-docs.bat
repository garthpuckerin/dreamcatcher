@echo off
REM ============================================
REM Organize Documentation Script (Windows)
REM Moves documentation files to proper structure
REM ============================================

echo.
echo ================================================
echo   Organizing Dreamcatcher Documentation
echo ================================================
echo.

echo Creating documentation directories...
if not exist "docs\planning" mkdir "docs\planning"
if not exist "docs\setup" mkdir "docs\setup"
if not exist "docs\architecture" mkdir "docs\architecture"
if not exist "docs\marketing" mkdir "docs\marketing"
if not exist "docs\sessions" mkdir "docs\sessions"
echo   [OK] Directories created
echo.

echo Moving planning documents...
if exist "PROJECT_PLAN.md" move /Y "PROJECT_PLAN.md" "docs\planning\" >nul && echo   [OK] PROJECT_PLAN.md
if exist "MOBILE_APP_PLAN.md" move /Y "MOBILE_APP_PLAN.md" "docs\planning\" >nul && echo   [OK] MOBILE_APP_PLAN.md
if exist "PHASE_6_SUMMARY.md" move /Y "PHASE_6_SUMMARY.md" "docs\planning\" >nul && echo   [OK] PHASE_6_SUMMARY.md
if exist "SUPABASE_MIGRATION_PLAN.md" move /Y "SUPABASE_MIGRATION_PLAN.md" "docs\planning\" >nul && echo   [OK] SUPABASE_MIGRATION_PLAN.md
echo.

echo Moving setup documents...
if exist "QUICK_SETUP.md" move /Y "QUICK_SETUP.md" "docs\setup\" >nul && echo   [OK] QUICK_SETUP.md
if exist "SETUP_COMPLETE.md" move /Y "SETUP_COMPLETE.md" "docs\setup\" >nul && echo   [OK] SETUP_COMPLETE.md
if exist "REPO_SETUP_COMPLETE.md" move /Y "REPO_SETUP_COMPLETE.md" "docs\setup\" >nul && echo   [OK] REPO_SETUP_COMPLETE.md
if exist "GITHUB_SETUP_COMPLETE.md" move /Y "GITHUB_SETUP_COMPLETE.md" "docs\setup\" >nul && echo   [OK] GITHUB_SETUP_COMPLETE.md
if exist "SETUP_GIT_FLOW.md" move /Y "SETUP_GIT_FLOW.md" "docs\setup\" >nul && echo   [OK] SETUP_GIT_FLOW.md
if exist "FIX_VITE_ERROR.md" move /Y "FIX_VITE_ERROR.md" "docs\setup\" >nul && echo   [OK] FIX_VITE_ERROR.md
echo.

echo Moving architecture documents...
if exist "ECOSYSTEM_VISION.md" move /Y "ECOSYSTEM_VISION.md" "docs\architecture\" >nul && echo   [OK] ECOSYSTEM_VISION.md
if exist "UI_UPDATE_SUMMARY.md" move /Y "UI_UPDATE_SUMMARY.md" "docs\architecture\" >nul && echo   [OK] UI_UPDATE_SUMMARY.md
if exist "IMPLEMENTATION_COMPLETE.md" move /Y "IMPLEMENTATION_COMPLETE.md" "docs\architecture\" >nul && echo   [OK] IMPLEMENTATION_COMPLETE.md
echo.

echo Moving marketing documents...
if exist "BRAND_STRUCTURE.md" move /Y "BRAND_STRUCTURE.md" "docs\marketing\" >nul && echo   [OK] BRAND_STRUCTURE.md
if exist "LAUNCH_CHECKLIST.md" move /Y "LAUNCH_CHECKLIST.md" "docs\marketing\" >nul && echo   [OK] LAUNCH_CHECKLIST.md
if exist "THE_REAL_STORY.md" move /Y "THE_REAL_STORY.md" "docs\marketing\" >nul && echo   [OK] THE_REAL_STORY.md
if exist "TEASER_SITE_UPDATE.md" move /Y "TEASER_SITE_UPDATE.md" "docs\marketing\" >nul && echo   [OK] TEASER_SITE_UPDATE.md
if exist "REAL_DREAMS_DEMO.json" move /Y "REAL_DREAMS_DEMO.json" "docs\marketing\" >nul && echo   [OK] REAL_DREAMS_DEMO.json
echo.

echo Moving session documents...
if exist "SESSION_SUMMARY.md" move /Y "SESSION_SUMMARY.md" "docs\sessions\" >nul && echo   [OK] SESSION_SUMMARY.md
echo.

echo Moving scripts...
if exist "setup.bat" move /Y "setup.bat" "scripts\" >nul && echo   [OK] setup.bat
if exist "setup-git.bat" move /Y "setup-git.bat" "scripts\" >nul && echo   [OK] setup-git.bat
if exist "setup-git.ps1" move /Y "setup-git.ps1" "scripts\" >nul && echo   [OK] setup-git.ps1
if exist "start-dev.bat" move /Y "start-dev.bat" "scripts\" >nul && echo   [OK] start-dev.bat
echo.

echo ================================================
echo   Documentation Organization Complete!
echo ================================================
echo.
echo Documentation structure:
echo   * docs/planning/     - Project plans and roadmaps
echo   * docs/setup/        - Installation and setup guides
echo   * docs/architecture/ - Technical design and ecosystem
echo   * docs/marketing/    - Brand strategy and launch plans
echo   * docs/sessions/     - Development logs
echo   * scripts/           - All utility scripts
echo.
echo View the documentation hub: docs\README.md
echo.
pause

