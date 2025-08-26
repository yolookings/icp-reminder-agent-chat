#!/bin/bash

echo "🧪 Testing ICP Reminder Canister"
echo "================================"

CANISTER_ID=$(dfx canister id reminder_backend)
echo "📝 Testing canister: $CANISTER_ID"

echo ""
echo "1️⃣ Creating test reminder..."
dfx canister call reminder_backend createReminder '(record {
  title = "Test Reminder";
  description = "This is a test reminder";
  reminderTime = 1735689600
})'

echo ""
echo "2️⃣ Getting all reminders..."
dfx canister call reminder_backend getAllReminders

echo ""
echo "3️⃣ Getting system stats..."
dfx canister call reminder_backend getStats

echo ""
echo "4️⃣ Getting pending reminders..."
dfx canister call reminder_backend getPendingReminders

echo ""
echo "✅ Canister testing completed!"
