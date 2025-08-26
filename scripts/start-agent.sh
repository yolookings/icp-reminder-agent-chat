#!/bin/bash

echo "🤖 Starting uAgent Reminder System..."

cd agent

# Activate virtual environment
source venv/bin/activate

# Start the agent
echo "🚀 Starting reminder agent..."
python main.py
