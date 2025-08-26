#!/bin/bash

echo "🚀 Starting ICP Local Development Environment..."

# Start DFX local replica
echo "📡 Starting DFX replica..."
dfx start --background --clean

# Deploy canisters
echo "🏗️  Deploying canisters..."
dfx deploy

# Get canister ID
CANISTER_ID=$(dfx canister id reminder-backend)
echo "✅ Reminder Backend Canister ID: $CANISTER_ID"

# Update .env file with canister ID
cd agent
sed -i.bak "s/CANISTER_ID=.*/CANISTER_ID=$CANISTER_ID/" .env
rm .env.bak
cd ..

echo "✅ Local environment started successfully!"
echo ""
echo "🎯 Canister URLs:"
echo "Backend: http://localhost:4943/?canisterId=$CANISTER_ID"
echo "Candid UI: http://localhost:4943/?canisterId=$(dfx canister id __Candid_UI)&id=$CANISTER_ID"
echo ""
echo "📝 To test the backend directly:"
echo "dfx canister call reminder-backend createReminder '(record { title=\"Test\"; description=\"Test reminder\"; reminderTime=1640995200000000000; isCompleted=false; createdAt=0 })'"
