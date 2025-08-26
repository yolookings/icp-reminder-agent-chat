import Debug "mo:base/Debug";
import Time "mo:base/Time";
import Array "mo:base/Array";
import Iter "mo:base/Iter";
import HashMap "mo:base/HashMap";
import Text "mo:base/Text";
import Nat "mo:base/Nat";
import Int "mo:base/Int";
import Result "mo:base/Result";
import Option "mo:base/Option";

actor ReminderBackend {
    // Data types
    public type ReminderId = Nat;
    
    public type Reminder = {
        id: ReminderId;
        title: Text;
        description: Text;
        reminderTime: Int; // Unix timestamp
        isCompleted: Bool;
        createdAt: Int;
        updatedAt: ?Int;
    };
    
    public type CreateReminderRequest = {
        title: Text;
        description: Text;
        reminderTime: Int;
    };
    
    public type UpdateReminderRequest = {
        title: ?Text;
        description: ?Text;
        reminderTime: ?Int;
        isCompleted: ?Bool;
    };
    
    public type ApiResponse<T> = {
        success: Bool;
        message: Text;
        data: ?T;
    };

    // State management
    private stable var nextId: Nat = 1;
    private stable var reminderEntries: [(ReminderId, Reminder)] = [];
    private var reminders = HashMap.HashMap<ReminderId, Reminder>(10, Nat.equal, func(n: Nat) : Nat32 { Nat32.fromNat(n) });

    // Initialize from stable storage
    system func preupgrade() {
        reminderEntries := Iter.toArray(reminders.entries());
    };

    system func postupgrade() {
        reminderEntries := [];
    };

    // Restore state after upgrade
    for ((id, reminder) in reminderEntries.vals()) {
        reminders.put(id, reminder);
    };

    // Helper functions
    private func getCurrentTime(): Int {
        Time.now()
    };

    private func validateReminderTime(time: Int): Bool {
        time > getCurrentTime()
    };

    // CRUD Operations

    // Create a new reminder
    public func createReminder(request: CreateReminderRequest): async ApiResponse<Reminder> {
        // Validation
        if (Text.size(request.title) == 0) {
            return {
                success = false;
                message = "Title cannot be empty";
                data = null;
            };
        };

        if (not validateReminderTime(request.reminderTime)) {
            return {
                success = false;
                message = "Reminder time must be in the future";
                data = null;
            };
        };

        let reminder: Reminder = {
            id = nextId;
            title = request.title;
            description = request.description;
            reminderTime = request.reminderTime;
            isCompleted = false;
            createdAt = getCurrentTime();
            updatedAt = null;
        };

        reminders.put(nextId, reminder);
        nextId += 1;

        {
            success = true;
            message = "Reminder created successfully";
            data = ?reminder;
        }
    };

    // Get all reminders
    public query func getAllReminders(): async ApiResponse<[Reminder]> {
        let allReminders = Iter.toArray(reminders.vals());
        {
            success = true;
            message = "Reminders retrieved successfully";
            data = ?allReminders;
        }
    };

    // Get reminder by ID
    public query func getReminder(id: ReminderId): async ApiResponse<Reminder> {
        switch (reminders.get(id)) {
            case (?reminder) {
                {
                    success = true;
                    message = "Reminder found";
                    data = ?reminder;
                }
            };
            case null {
                {
                    success = false;
                    message = "Reminder not found";
                    data = null;
                }
            };
        }
    };

    // Update reminder
    public func updateReminder(id: ReminderId, request: UpdateReminderRequest): async ApiResponse<Reminder> {
        switch (reminders.get(id)) {
            case (?existingReminder) {
                // Validate reminder time if provided
                switch (request.reminderTime) {
                    case (?time) {
                        if (not validateReminderTime(time)) {
                            return {
                                success = false;
                                message = "Reminder time must be in the future";
                                data = null;
                            };
                        };
                    };
                    case null {};
                };

                let updatedReminder: Reminder = {
                    id = existingReminder.id;
                    title = Option.get(request.title, existingReminder.title);
                    description = Option.get(request.description, existingReminder.description);
                    reminderTime = Option.get(request.reminderTime, existingReminder.reminderTime);
                    isCompleted = Option.get(request.isCompleted, existingReminder.isCompleted);
                    createdAt = existingReminder.createdAt;
                    updatedAt = ?getCurrentTime();
                };

                reminders.put(id, updatedReminder);
                {
                    success = true;
                    message = "Reminder updated successfully";
                    data = ?updatedReminder;
                }
            };
            case null {
                {
                    success = false;
                    message = "Reminder not found";
                    data = null;
                }
            };
        }
    };

    // Delete reminder
    public func deleteReminder(id: ReminderId): async ApiResponse<Text> {
        switch (reminders.remove(id)) {
            case (?_) {
                {
                    success = true;
                    message = "Reminder deleted successfully";
                    data = ?"Deleted";
                }
            };
            case null {
                {
                    success = false;
                    message = "Reminder not found";
                    data = null;
                }
            };
        }
    };

    // Get pending reminders (not completed and time has passed)
    public query func getPendingReminders(): async ApiResponse<[Reminder]> {
        let currentTime = getCurrentTime();
        let allReminders = Iter.toArray(reminders.vals());
        let pendingReminders = Array.filter<Reminder>(allReminders, func(reminder) {
            not reminder.isCompleted and reminder.reminderTime <= currentTime
        });

        {
            success = true;
            message = "Pending reminders retrieved successfully";
            data = ?pendingReminders;
        }
    };

    // Mark reminder as completed
    public func markAsCompleted(id: ReminderId): async ApiResponse<Reminder> {
        let updateRequest: UpdateReminderRequest = {
            title = null;
            description = null;
            reminderTime = null;
            isCompleted = ?true;
        };
        await updateReminder(id, updateRequest)
    };

    // Get system stats
    public query func getStats(): async ApiResponse<{totalReminders: Nat; completedReminders: Nat; pendingReminders: Nat}> {
        let allReminders = Iter.toArray(reminders.vals());
        let totalReminders = allReminders.size();
        let completedReminders = Array.filter<Reminder>(allReminders, func(r) { r.isCompleted }).size();
        let currentTime = getCurrentTime();
        let pendingReminders = Array.filter<Reminder>(allReminders, func(r) { 
            not r.isCompleted and r.reminderTime <= currentTime 
        }).size();

        {
            success = true;
            message = "Stats retrieved successfully";
            data = ?{
                totalReminders = totalReminders;
                completedReminders = completedReminders;
                pendingReminders = pendingReminders;
            };
        }
    };
}
