#!/bin/bash

echo "🧪 Testing ICP Reminder System..."

# Test backend canister directly
echo "📡 Testing backend canister..."
CANISTER_ID=$(dfx canister id reminder-backend)

echo "Creating test reminder..."
dfx canister call reminder-backend createReminder '(record { 
    title="Test Meeting"; 
    description="Important team meeting"; 
    reminderTime=1640995200000000000; 
    isCompleted=false; 
    createdAt=0 
})'

echo "Getting all reminders..."
dfx canister call reminder-backend getAllReminders

echo "Getting pending reminders..."
dfx canister call reminder-backend getPendingReminders

echo "✅ Backend tests completed!"

# Test agent (if running)
echo ""
echo "🤖 Testing agent endpoint..."
if curl -s http://localhost:8000/health > /dev/null; then
    echo "Agent is running, sending test request..."
    curl -X POST http://localhost:8000/submit \
        -H "Content-Type: application/json" \
        -d '{"message": "remind me to call mom at 3pm tomorrow"}'
else
    echo "⚠️  Agent not running. Start it with: ./scripts/start-agent.sh"
fi

echo ""
echo "✅ System tests completed!"
