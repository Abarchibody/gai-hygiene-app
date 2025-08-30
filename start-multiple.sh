#!/bin/bash

# Script to start multiple instances of GAI app on ports 5173-5177

echo "🚀 Starting GAI Hygiene App on multiple ports..."

# Function to start app on specific port
start_port() {
    local port=$1
    echo "Starting on port $port..."
    npm run dev:$port &
}

# Start instances on ports 5174-5177 (5173 is default)
start_port 5174
start_port 5175  
start_port 5176
start_port 5177

# Start default instance on 5173
echo "Starting default instance on port 5173..."
npm run dev &

echo "✅ All instances started!"
echo "Access URLs:"
echo "  - http://localhost:5173"
echo "  - http://localhost:5174" 
echo "  - http://localhost:5175"
echo "  - http://localhost:5176"
echo "  - http://localhost:5177"
echo ""
echo "Press Ctrl+C to stop all instances"

# Wait for all background processes
wait