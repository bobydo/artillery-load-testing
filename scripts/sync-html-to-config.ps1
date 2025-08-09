# PowerShell script to sync HTML changes to YAML config
# Usage: powershell -ExecutionPolicy Bypass -File scripts/sync-html-to-config.ps1

Write-Host "🔄 Syncing HTML selectors to YAML configuration..." -ForegroundColor Cyan

try {
    # Run the Node.js sync script
    $result = node scripts/sync-html-to-config.js
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ HTML to YAML sync completed successfully!" -ForegroundColor Green
        
        # Check if there's a change report
        if (Test-Path "reports/config-changes.md") {
            Write-Host "📊 Change report available at: reports/config-changes.md" -ForegroundColor Cyan
        }
        
        Write-Host "`n💡 Next steps:" -ForegroundColor Yellow
        Write-Host "   • Review the changes in login-config.yaml" -ForegroundColor White
        Write-Host "   • Run Cypress tests to verify: yarn run test:cypress:login" -ForegroundColor White
        Write-Host "   • Commit the updated configuration if everything looks good" -ForegroundColor White
        
    } else {
        Write-Host "❌ HTML to YAML sync failed!" -ForegroundColor Red
        exit 1
    }
    
} catch {
    Write-Host "❌ Error running HTML sync: $_" -ForegroundColor Red
    exit 1
}
