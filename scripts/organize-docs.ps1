# ============================================
# Organize Documentation Script
# Moves documentation files to proper structure
# ============================================

Write-Host "📁 Organizing Dreamcatcher Documentation..." -ForegroundColor Cyan
Write-Host ""

# Create directory structure
Write-Host "Creating documentation directories..." -ForegroundColor Yellow
$directories = @(
    "docs\planning",
    "docs\setup",
    "docs\architecture",
    "docs\marketing",
    "docs\sessions"
)

foreach ($dir in $directories) {
    if (!(Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
        Write-Host "  ✓ Created $dir" -ForegroundColor Green
    } else {
        Write-Host "  ✓ $dir exists" -ForegroundColor Gray
    }
}

Write-Host ""
Write-Host "Moving files to organized structure..." -ForegroundColor Yellow

# Planning documents
$planningFiles = @(
    "PROJECT_PLAN.md",
    "MOBILE_APP_PLAN.md",
    "PHASE_6_SUMMARY.md",
    "SUPABASE_MIGRATION_PLAN.md"
)

foreach ($file in $planningFiles) {
    if (Test-Path $file) {
        Move-Item -Path $file -Destination "docs\planning\" -Force
        Write-Host "  ✓ Moved $file → docs\planning\" -ForegroundColor Green
    }
}

# Setup documents
$setupFiles = @(
    "QUICK_SETUP.md",
    "SETUP_COMPLETE.md",
    "REPO_SETUP_COMPLETE.md",
    "GITHUB_SETUP_COMPLETE.md",
    "SETUP_GIT_FLOW.md",
    "FIX_VITE_ERROR.md"
)

foreach ($file in $setupFiles) {
    if (Test-Path $file) {
        Move-Item -Path $file -Destination "docs\setup\" -Force
        Write-Host "  ✓ Moved $file → docs\setup\" -ForegroundColor Green
    }
}

# Architecture documents
$archFiles = @(
    "ECOSYSTEM_VISION.md",
    "UI_UPDATE_SUMMARY.md",
    "IMPLEMENTATION_COMPLETE.md"
)

foreach ($file in $archFiles) {
    if (Test-Path $file) {
        Move-Item -Path $file -Destination "docs\architecture\" -Force
        Write-Host "  ✓ Moved $file → docs\architecture\" -ForegroundColor Green
    }
}

# Marketing documents
$marketingFiles = @(
    "BRAND_STRUCTURE.md",
    "LAUNCH_CHECKLIST.md",
    "THE_REAL_STORY.md",
    "TEASER_SITE_UPDATE.md",
    "REAL_DREAMS_DEMO.json"
)

foreach ($file in $marketingFiles) {
    if (Test-Path $file) {
        Move-Item -Path $file -Destination "docs\marketing\" -Force
        Write-Host "  ✓ Moved $file → docs\marketing\" -ForegroundColor Green
    }
}

# Session documents
$sessionFiles = @(
    "SESSION_SUMMARY.md"
)

foreach ($file in $sessionFiles) {
    if (Test-Path $file) {
        Move-Item -Path $file -Destination "docs\sessions\" -Force
        Write-Host "  ✓ Moved $file → docs\sessions\" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "✅ Documentation organization complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Documentation structure:" -ForegroundColor Cyan
Write-Host "  • docs/planning/     - Project plans and roadmaps"
Write-Host "  • docs/setup/        - Installation and setup guides"
Write-Host "  • docs/architecture/ - Technical design and ecosystem"
Write-Host "  • docs/marketing/    - Brand strategy and launch plans"
Write-Host "  • docs/sessions/     - Development logs"
Write-Host ""
Write-Host "📖 View the documentation hub: docs\README.md" -ForegroundColor Cyan
Write-Host ""

