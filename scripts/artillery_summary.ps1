# Artillery JSON Summary Script (updated for Artillery v2+ JSON structure)
# Usage: powershell -ExecutionPolicy Bypass -File scripts/artillery_summary.ps1

dir reports\*.json | Sort-Object LastWriteTime -Descending | Select-Object -First 1 | ForEach-Object {
    $json = Get-Content $_.FullName | ConvertFrom-Json
    $agg = $json.aggregate
    $counters = $agg.counters
    $rates = $agg.rates
    $summaries = $agg.summaries

    $totalReq = $counters.'http.requests'
    $reqRate = $rates.'http.request_rate'
    $p95 = $summaries.'http.response_time'.p95
    $p99 = $summaries.'http.response_time'.p99
    $apdex_satisfied = $counters.'apdex.satisfied'
    $apdex_tolerated = $counters.'apdex.tolerated'
    $apdex_frustrated = $counters.'apdex.frustrated'
    $apdex_total = $apdex_satisfied + $apdex_tolerated + $apdex_frustrated
    if ($apdex_total -gt 0) {
        $apdex = [math]::Round(($apdex_satisfied + 0.5 * $apdex_tolerated) / $apdex_total, 3)
    } else {
        $apdex = 'N/A'
    }
    $errors = $counters.'vusers.failed'

    $okChecks = $true
    $failReasons = @()
    if ($p95 -gt 75) {
        $okChecks = $false
        $failReasons += "P95 response time ($p95 ms) is above 75ms"
    }
    if ($p99 -gt 100) {
        $okChecks = $false
        $failReasons += "P99 response time ($p99 ms) is above 100ms"
    }
    if ($apdex -ne 'N/A' -and $apdex -lt 0.94) {
        $okChecks = $false
        $failReasons += "Application Performance Index score ($apdex) is below 0.94 (Excellent)"
    }
    if ($errors -gt 0) {
        $okChecks = $false
        $failReasons += "Errors detected: $errors failed users"
    }

    Write-Host "\n==================== Artillery Test Summary ====================" -ForegroundColor Cyan
    Write-Host "Report: $($_.Name)"
    Write-Host "Total Requests: $totalReq"
    Write-Host "Request Rate: $reqRate/sec"
    Write-Host "P95 Response Time: $p95 ms"
    Write-Host "P99 Response Time: $p99 ms"
    Write-Host "Application Performance Index Score: $apdex"
    if ($okChecks) {
        Write-Host "Result: GOOD. All performance thresholds met!" -ForegroundColor Green
    } else {
        Write-Host "Result: NOT GOOD. Some thresholds failed:" -ForegroundColor Red
        $failReasons | ForEach-Object { Write-Host "- $_" -ForegroundColor Yellow }
        Write-Host "\nReference:"
        Write-Host "- P95 < 75ms, P99 < 100ms, Apdex >= 0.94 (Excellent)"
        Write-Host "- See https://artillery.io/docs/guides/guides/performance-testing.html#interpreting-results"
    }
    Write-Host "===============================================================\n" -ForegroundColor Cyan
}
