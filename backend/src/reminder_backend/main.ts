import { query, update, StableBTreeMap, ic, Canister } from "azle"

// Types
interface Reminder {
  id: string
  title: string
  description: string
  date: string // YYYY-MM-DD format
  time: string // HH:MM format
  created: bigint
  userId?: string // Optional for multi-user support
}

interface CreateReminderRequest {
  title: string
  description: string
  date: string
  time: string
  userId?: string
}

interface UpdateReminderRequest {
  id: string
  title?: string
  description?: string
  date?: string
  time?: string
}

// Stable storage for reminders
const reminders = StableBTreeMap<string, Reminder>(0)
const reminderCounter = StableBTreeMap<string, bigint>(1)

export default Canister({
  // Initialize counter if not exists
  init: (): void => {
    if (reminderCounter.get("counter") === null) {
      reminderCounter.insert("counter", 0n)
    }
  },

  // Add new reminder
  addReminder: update([CreateReminderRequest], Reminder, (request) => {
    // Generate unique ID
    const currentCounter = reminderCounter.get("counter") || 0n
    const newCounter = currentCounter + 1n
    reminderCounter.insert("counter", newCounter)

    const id = `reminder_${newCounter}`

    // Validate date format (basic validation)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/
    const timeRegex = /^\d{2}:\d{2}$/

    if (!dateRegex.test(request.date)) {
      throw new Error("Invalid date format. Use YYYY-MM-DD")
    }

    if (!timeRegex.test(request.time)) {
      throw new Error("Invalid time format. Use HH:MM")
    }

    const reminder: Reminder = {
      id,
      title: request.title,
      description: request.description,
      date: request.date,
      time: request.time,
      created: ic.time(),
      userId: request.userId,
    }

    reminders.insert(id, reminder)
    return reminder
  }),

  // Get all reminders
  getReminders: query([], [Reminder], () => {
    return reminders.values()
  }),

  // Get reminders by date
  getRemindersByDate: query([String], [Reminder], (date) => {
    return reminders.values().filter((reminder) => reminder.date === date)
  }),

  // Get reminders by user ID
  getRemindersByUser: query([String], [Reminder], (userId) => {
    return reminders.values().filter((reminder) => reminder.userId === userId)
  }),

  // Get reminder by ID
  getReminder: query([String], Reminder, (id) => {
    const reminder = reminders.get(id)
    if (!reminder) {
      throw new Error(`Reminder with id ${id} not found`)
    }
    return reminder
  }),

  // Update reminder
  updateReminder: update([UpdateReminderRequest], Reminder, (request) => {
    const existingReminder = reminders.get(request.id)
    if (!existingReminder) {
      throw new Error(`Reminder with id ${request.id} not found`)
    }

    // Validate date and time if provided
    if (request.date) {
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/
      if (!dateRegex.test(request.date)) {
        throw new Error("Invalid date format. Use YYYY-MM-DD")
      }
    }

    if (request.time) {
      const timeRegex = /^\d{2}:\d{2}$/
      if (!timeRegex.test(request.time)) {
        throw new Error("Invalid time format. Use HH:MM")
      }
    }

    const updatedReminder: Reminder = {
      ...existingReminder,
      title: request.title || existingReminder.title,
      description: request.description || existingReminder.description,
      date: request.date || existingReminder.date,
      time: request.time || existingReminder.time,
    }

    reminders.insert(request.id, updatedReminder)
    return updatedReminder
  }),

  // Delete reminder
  deleteReminder: update([String], Boolean, (id) => {
    const reminder = reminders.get(id)
    if (!reminder) {
      return false
    }

    reminders.remove(id)
    return true
  }),

  // Get reminders count
  getRemindersCount: query([], Number, () => {
    return reminders.len()
  }),

  // Get upcoming reminders (today and future)
  getUpcomingReminders: query([], [Reminder], () => {
    const today = new Date().toISOString().split("T")[0] // YYYY-MM-DD
    return reminders.values().filter((reminder) => reminder.date >= today)
  }),

  // Search reminders by title
  searchReminders: query([String], [Reminder], (searchTerm) => {
    const term = searchTerm.toLowerCase()
    return reminders
      .values()
      .filter(
        (reminder) => reminder.title.toLowerCase().includes(term) || reminder.description.toLowerCase().includes(term),
      )
  }),

  // Clear all reminders (for testing purposes)
  clearAllReminders: update([], Boolean, () => {
    const keys = reminders.keys()
    keys.forEach((key) => reminders.remove(key))
    reminderCounter.insert("counter", 0n)
    return true
  }),
})
