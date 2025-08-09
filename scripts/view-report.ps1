# Artillery Report Viewer (PowerShell)
# This script helps you open the latest HTML report

Write-Host "Artillery Load Test Reports" -ForegroundColor Cyan
Write-Host "============================" -ForegroundColor Cyan

# Check if reports directory exists
if (-not (Test-Path "reports")) {
    Write-Host "No reports directory found. Run a load test first:" -ForegroundColor Red
    Write-Host "   yarn run test:artillery:html" -ForegroundColor Yellow
    exit 1
}

# Find the latest HTML report
$latestHtml = Get-ChildItem "reports\*.html" | Sort-Object LastWriteTime -Descending | Select-Object -First 1

if (-not $latestHtml) {
    Write-Host "No HTML reports found. Generate one with:" -ForegroundColor Red
    Write-Host "   yarn run test:artillery:html" -ForegroundColor Yellow
    exit 1
}

Write-Host "Latest HTML report: $($latestHtml.Name)" -ForegroundColor Green
Write-Host "Opening in default browser..." -ForegroundColor Blue

# Open the HTML report in default browser
Start-Process $latestHtml.FullName

Write-Host "Done!" -ForegroundColor Green
