#!/bin/bash

# Punjabi E-commerce Store Product Manager Launcher
echo "🚀 Starting Punjabi E-commerce Store Product Manager..."

# Check if Python 3 is available
if command -v python3 &> /dev/null; then
    echo "✅ Python 3 found"
    python3 product_manager.py
elif command -v python &> /dev/null; then
    echo "✅ Python found"
    python product_manager.py
else
    echo "❌ Error: Python not found. Please install Python 3."
    echo "   On macOS: brew install python3"
    echo "   On Ubuntu/Debian: sudo apt-get install python3"
    echo "   On Windows: Download from https://python.org"
    exit 1
fi
