#!/bin/bash

echo "🔍 Finding Context Usage in Pages"
echo "================================="

echo "Looking for useFirebaseAuth usage:"
grep -r "useFirebaseAuth" app/ --include="*.tsx" --include="*.ts" || echo "No useFirebaseAuth found"

echo ""
echo "Looking for useCart usage:"
grep -r "useCart" app/ --include="*.tsx" --include="*.ts" || echo "No useCart found"

echo ""
echo "Looking for pages that might need 'use client':"
find app/ -name "page.tsx" -exec grep -L "'use client'" {} \; | while read file; do
    if grep -q "use\(Cart\|FirebaseAuth\)" "$file"; then
        echo "⚠️ $file might need 'use client' directive"
    fi
done

echo ""
echo "✅ Context usage scan complete"
