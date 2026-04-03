#!/bin/bash

# Build script for Vercel - injects API URL into index.html
API_URL="${REACT_APP_API_URL:-https://blinkit-backend-xxxx.onrender.com}"

# Replace placeholder with actual URL
sed -i.bak "s|https://blinkit-backend-xxxx.onrender.com|$API_URL|g" index.html

echo "Build complete! API URL set to: $API_URL"
