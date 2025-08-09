#!/bin/bash
# Artillery Report Viewer
# This script helps you open the latest HTML report

echo "🚀 Artillery Load Test Reports"
echo "=============================="

# Check if reports directory exists
if [ ! -d "reports" ]; then
    echo "❌ No reports directory found. Run a load test first:"
    echo "   yarn run test:artillery:html"
    exit 1
fi

# Find the latest HTML report
latest_html=$(ls -t reports/*.html 2>/dev/null | head -n1)

if [ -z "$latest_html" ]; then
    echo "❌ No HTML reports found. Generate one with:"
    echo "   yarn run test:artillery:html"
    exit 1
fi

echo "📊 Latest HTML report: $latest_html"
echo "🌐 Opening in default browser..."

# Open the HTML report in default browser
if command -v start &> /dev/null; then
    # Windows
    start "$latest_html"
elif command -v open &> /dev/null; then
    # macOS
    open "$latest_html"
elif command -v xdg-open &> /dev/null; then
    # Linux
    xdg-open "$latest_html"
else
    echo "ℹ️  Please open this file manually: $latest_html"
fi

echo "✅ Done!"
