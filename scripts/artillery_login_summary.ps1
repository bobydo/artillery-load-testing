# PowerShell Script to Summarize Artillery Login Test Results
# Usage: powershell -ExecutionPolicy Bypass -File scripts/artillery_login_summary.ps1

Write-Host "🚀 Artillery Login Test Summary" -ForegroundColor Cyan
Write-Host "===============================" -ForegroundColor Cyan

# Check if reports directory exists
if (-not (Test-Path "reports")) {
    Write-Host "No reports directory found. Run a login test first:" -ForegroundColor Red
    Write-Host " yarn run test:artillery:login:json" -ForegroundColor Yellow
    exit 1
}

# Find the latest login test JSON report
$latestJson = Get-ChildItem -Path "reports" -Filter "login-test-*.json" | Sort-Object LastWriteTime -Descending | Select-Object -First 1

if (-not $latestJson) {
    Write-Host "No login test JSON reports found. Generate one with:" -ForegroundColor Red
    Write-Host " yarn run test:artillery:login:json" -ForegroundColor Yellow
    exit 1
}

Write-Host "📊 Analyzing: $($latestJson.Name)" -ForegroundColor Green

try {
    # Read and parse JSON
    $jsonContent = Get-Content $latestJson.FullName -Raw | ConvertFrom-Json
    
    # Extract key metrics
    $aggregate = $jsonContent.aggregate
    $counters = $aggregate.counters
    $summaries = $aggregate.summaries
    
    # Basic stats
    $requestsCompleted = $counters."http.requests"
    $requestsTotal = $counters."http.requests" + $counters."http.request_rate"
    $errors = $counters."errors.ECONNREFUSED" + $counters."errors.timeout" + $counters."http.codes.404" + $counters."http.codes.500"
    if (-not $errors) { $errors = 0 }
    
    $successRate = if ($requestsCompleted -gt 0) { [math]::Round((($requestsCompleted - $errors) / $requestsCompleted) * 100, 2) } else { 0 }
    
    # Response times
    $p95 = [math]::Round($summaries."http.response_time".p95, 1)
    $p99 = [math]::Round($summaries."http.response_time".p99, 1)
    $median = [math]::Round($summaries."http.response_time".median, 1)
    $mean = [math]::Round($summaries."http.response_time".mean, 1)
    
    # Request rate
    $requestRate = [math]::Round($summaries."http.request_rate".mean, 1)
    
    Write-Host ""
    Write-Host "📈 LOGIN TEST RESULTS:" -ForegroundColor White
    Write-Host "  • Total Requests: $requestsCompleted" -ForegroundColor White
    Write-Host "  • Success Rate: $successRate%" -ForegroundColor $(if ($successRate -ge 95) { "Green" } elseif ($successRate -ge 90) { "Yellow" } else { "Red" })
    Write-Host "  • Errors: $errors" -ForegroundColor $(if ($errors -eq 0) { "Green" } else { "Red" })
    Write-Host "  • Request Rate: $requestRate req/sec" -ForegroundColor White
    
    Write-Host ""
    Write-Host "⏱️  RESPONSE TIMES:" -ForegroundColor White
    Write-Host "  • Median: ${median}ms" -ForegroundColor White
    Write-Host "  • Mean: ${mean}ms" -ForegroundColor White
    Write-Host "  • P95: ${p95}ms" -ForegroundColor $(if ($p95 -le 500) { "Green" } elseif ($p95 -le 1000) { "Yellow" } else { "Red" })
    Write-Host "  • P99: ${p99}ms" -ForegroundColor $(if ($p99 -le 1000) { "Green" } elseif ($p99 -le 2000) { "Yellow" } else { "Red" })
    
    Write-Host ""
    
    # Performance assessment
    $testPassed = $true
    $issues = @()
    
    if ($successRate -lt 95) {
        $testPassed = $false
        $issues += "Low success rate ($successRate%)"
    }
    
    if ($p95 -gt 1000) {
        $testPassed = $false
        $issues += "High P95 response time (${p95}ms)"
    }
    
    if ($p99 -gt 2000) {
        $testPassed = $false
        $issues += "High P99 response time (${p99}ms)"
    }
    
    if ($errors -gt 0) {
        $testPassed = $false
        $issues += "$errors errors detected"
    }
    
    if ($testPassed) {
        Write-Host "LOGIN TEST PASSED - Performance is within acceptable limits!" -ForegroundColor Green
    } else {
        Write-Host "LOGIN TEST FAILED - Performance issues detected:" -ForegroundColor Red
        foreach ($issue in $issues) {
            Write-Host "   • $issue" -ForegroundColor Red
        }
    }
    
    Write-Host ""
    Write-Host "📄 Full report: $($latestJson.FullName)" -ForegroundColor Cyan
    
} catch {
    Write-Host "Error parsing JSON report: $_" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Summary complete!" -ForegroundColor Green
