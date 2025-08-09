# Git Pre-commit Hook
# Place this file in .git/hooks/pre-commit (no extension)
# Make it executable: chmod +x .git/hooks/pre-commit

#!/bin/sh

echo "🔄 Checking for HTML changes that need config sync..."

# Check if login.html has been modified
if git diff --cached --name-only | grep -q "public/login.html"; then
    echo "📝 Login HTML file has changes - syncing configuration..."
    
    # Run the sync script
    node scripts/sync-html-to-config.js
    
    if [ $? -eq 0 ]; then
        echo "✅ Configuration synced successfully!"
        
        # Add the updated config file to the commit
        git add config/login-config.yaml
        
        echo "💡 Updated login-config.yaml has been added to this commit"
    else
        echo "❌ Configuration sync failed!"
        echo "Please fix the issues and try committing again."
        exit 1
    fi
fi

echo "✅ Pre-commit checks passed!"
