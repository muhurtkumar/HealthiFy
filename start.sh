#!/bin/bash

# Colors for better readability
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}Starting HealthiFy Application...${NC}"

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check if npm is installed
if ! command_exists npm; then
    echo -e "${RED}Error: npm is not installed. Please install Node.js and npm first.${NC}"
    exit 1
fi

# Check if the required directories exist
if [ ! -d "./Backend" ] || [ ! -d "./Frontend" ]; then
    echo -e "${RED}Error: Backend or Frontend directory not found. Make sure you're in the root directory.${NC}"
    exit 1
fi

# Run both servers concurrently
echo -e "${BLUE}Starting Backend server...${NC}"
cd Backend && npm start &
BACKEND_PID=$!

echo -e "${BLUE}Starting Frontend server...${NC}"
cd ../Frontend && npm run dev &
FRONTEND_PID=$!

# Function to handle script termination
cleanup() {
    echo -e "\n${GREEN}Shutting down servers...${NC}"
    kill $BACKEND_PID $FRONTEND_PID
    exit 0
}

# Trap SIGINT (Ctrl+C) and call cleanup
trap cleanup SIGINT

echo -e "${GREEN}Both servers are running!${NC}"
echo -e "${BLUE}Backend:${NC} http://localhost:8000"
echo -e "${BLUE}Frontend:${NC} http://localhost:5173"
echo -e "${RED}Press Ctrl+C to stop both servers${NC}"

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID 