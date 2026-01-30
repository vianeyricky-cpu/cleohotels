# Clean Build Script for Cleo Hotels
# This script performs a complete clean and rebuild of the Next.js project

Write-Host "🧹 Starting Clean Build Process..." -ForegroundColor Cyan
Write-Host ""

# Step 1: Stop any running dev servers
Write-Host "1. Stopping all Node processes..." -ForegroundColor Yellow
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2
Write-Host "   ✓ Node processes stopped" -ForegroundColor Green
Write-Host ""

# Step 2: Remove .next folder
Write-Host "2. Removing .next build cache..." -ForegroundColor Yellow
if (Test-Path ".next") {
    Remove-Item -Recurse -Force ".next"
    Write-Host "   ✓ .next folder removed" -ForegroundColor Green
} else {
    Write-Host "   ℹ .next folder not found (already clean)" -ForegroundColor Gray
}
Write-Host ""

# Step 3: Remove node_modules cache
Write-Host "3. Removing node_modules cache..." -ForegroundColor Yellow
if (Test-Path "node_modules\.cache") {
    Remove-Item -Recurse -Force "node_modules\.cache"
    Write-Host "   ✓ node_modules\.cache removed" -ForegroundColor Green
} else {
    Write-Host "   ℹ node_modules\.cache not found (already clean)" -ForegroundColor Gray
}
Write-Host ""

# Step 4: Optional - Remove node_modules entirely (uncomment if needed)
# Write-Host "4. Removing node_modules..." -ForegroundColor Yellow
# if (Test-Path "node_modules") {
#     Remove-Item -Recurse -Force "node_modules"
#     Write-Host "   ✓ node_modules removed" -ForegroundColor Green
# }
# Write-Host ""

# Step 5: Reinstall dependencies (uncomment if Step 4 is uncommented)
# Write-Host "5. Reinstalling dependencies..." -ForegroundColor Yellow
# npm install
# Write-Host "   ✓ Dependencies installed" -ForegroundColor Green
# Write-Host ""

Write-Host "✅ Clean build preparation complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "  1. Run: npm run dev" -ForegroundColor White
Write-Host "  2. Wait for compilation to complete" -ForegroundColor White
Write-Host "  3. Open browser and hard refresh (Ctrl+Shift+R)" -ForegroundColor White
Write-Host ""
