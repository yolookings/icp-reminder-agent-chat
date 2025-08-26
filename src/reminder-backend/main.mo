import Nat32 "mo:base/Nat32";
import Text "mo:base/Text";
import Trie "mo:base/Trie";
import Iter "mo:base/Iter";
import Bool "mo:base/Bool";
import Option "mo:base/Option";
import Time "mo:base/Time";
import Int "mo:base/Int";
import Array "mo:base/Array";

actor ReminderSystem {
    
    public type ReminderId = Nat32;
    
    public type Reminder = {
        title: Text;
        description: Text;
        reminderTime: Int; // Unix timestamp
        isCompleted: Bool;
        createdAt: Int;
    };
    
    private stable var nextId: ReminderId = 0;
    private stable var reminders: Trie.Trie<ReminderId, Reminder> = Trie.empty();
    
    // Create a new reminder
    public func createReminder(reminder: Reminder): async ReminderId {
        let reminderId = nextId;
        nextId += 1;
        
        let newReminder = {
            title = reminder.title;
            description = reminder.description;
            reminderTime = reminder.reminderTime;
            isCompleted = false;
            createdAt = Time.now();
        };
        
        reminders := Trie.replace(
            reminders,
            key(reminderId),
            Nat32.equal,
            ?newReminder,
        ).0;
        
        return reminderId;
    };
    
    // Get a specific reminder
    public query func getReminder(reminderId: ReminderId): async ?Reminder {
        let result = Trie.find(reminders, key(reminderId), Nat32.equal);
        return result;
    };
    
    // Get all reminders
    public query func getAllReminders(): async [(ReminderId, Reminder)] {
        let allReminders = Iter.toArray(Trie.iter(reminders));
        return allReminders;
    };
    
    // Get pending reminders (not completed)
    public query func getPendingReminders(): async [(ReminderId, Reminder)] {
        let allReminders = Iter.toArray(Trie.iter(reminders));
        let pendingReminders = Array.filter<(ReminderId, Reminder)>(
            allReminders, 
            func(item) = not item.1.isCompleted
        );
        return pendingReminders;
    };
    
    // Update a reminder
    public func updateReminder(reminderId: ReminderId, updatedReminder: Reminder): async Bool {
        let existingReminder = Trie.find(reminders, key(reminderId), Nat32.equal);
        let exists = Option.isSome(existingReminder);
        
        if (exists) {
            reminders := Trie.replace(
                reminders,
                key(reminderId),
                Nat32.equal,
                ?updatedReminder,
            ).0;
        };
        
        return exists;
    };
    
    // Mark reminder as completed
    public func completeReminder(reminderId: ReminderId): async Bool {
        let existingReminder = Trie.find(reminders, key(reminderId), Nat32.equal);
        
        switch (existingReminder) {
            case (?reminder) {
                let completedReminder = {
                    title = reminder.title;
                    description = reminder.description;
                    reminderTime = reminder.reminderTime;
                    isCompleted = true;
                    createdAt = reminder.createdAt;
                };
                
                reminders := Trie.replace(
                    reminders,
                    key(reminderId),
                    Nat32.equal,
                    ?completedReminder,
                ).0;
                
                return true;
            };
            case null { return false; };
        };
    };
    
    // Delete a reminder
    public func deleteReminder(reminderId: ReminderId): async Bool {
        let existingReminder = Trie.find(reminders, key(reminderId), Nat32.equal);
        let exists = Option.isSome(existingReminder);
        
        if (exists) {
            reminders := Trie.replace(
                reminders,
                key(reminderId),
                Nat32.equal,
                null,
            ).0;
        };
        
        return exists;
    };
    
    // Get reminders due soon (within next hour)
    public query func getDueReminders(): async [(ReminderId, Reminder)] {
        let currentTime = Time.now();
        let oneHourFromNow = currentTime + (60 * 60 * 1000000000); // 1 hour in nanoseconds
        
        let allReminders = Iter.toArray(Trie.iter(reminders));
        let dueReminders = Array.filter<(ReminderId, Reminder)>(
            allReminders,
            func(item) = 
                not item.1.isCompleted and 
                item.1.reminderTime <= oneHourFromNow and 
                item.1.reminderTime >= currentTime
        );
        
        return dueReminders;
    };
    
    private func key(x: ReminderId): Trie.Key<ReminderId> {
        return { hash = x; key = x };
    };
}
