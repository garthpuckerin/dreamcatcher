Write-Host "=== Dreamcatcher Git Setup ===" -ForegroundColor Cyan
Write-Host ""

Write-Host "Step 1: Initializing Git repository..." -ForegroundColor Yellow
git init
Write-Host "✓ Git initialized" -ForegroundColor Green
Write-Host ""

Write-Host "Step 2: Adding all files..." -ForegroundColor Yellow
git add .
Write-Host "✓ Files staged" -ForegroundColor Green
Write-Host ""

Write-Host "Step 3: Creating initial commit..." -ForegroundColor Yellow
git commit -m "feat: Initial commit - Dreamcatcher v2.1.0 with PM features"
Write-Host "✓ Initial commit created" -ForegroundColor Green
Write-Host ""

Write-Host "Step 4: Renaming branch to main..." -ForegroundColor Yellow
git branch -M main
Write-Host "✓ Branch renamed to main" -ForegroundColor Green
Write-Host ""

Write-Host "Step 5: Creating develop branch..." -ForegroundColor Yellow
git branch develop
Write-Host "✓ Develop branch created" -ForegroundColor Green
Write-Host ""

Write-Host "Step 6: Creating feature-2.2 branch from develop..." -ForegroundColor Yellow
git checkout -b feature-2.2 develop
Write-Host "✓ Feature-2.2 branch created and checked out" -ForegroundColor Green
Write-Host ""

Write-Host "Step 7: Adding remote origin..." -ForegroundColor Yellow
git remote add origin https://github.com/garthpuckerin/dreamcatcher.git
Write-Host "✓ Remote origin added" -ForegroundColor Green
Write-Host ""

Write-Host "Current branches:" -ForegroundColor Cyan
git branch -a
Write-Host ""

Write-Host "=== Setup Complete! ===" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "  1. git push -u origin main"
Write-Host "  2. git push -u origin develop"
Write-Host "  3. git push -u origin feature-2.2"
Write-Host ""
Write-Host "Current branch:" -ForegroundColor Cyan
git branch --show-current

