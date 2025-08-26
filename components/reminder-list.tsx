"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Reminder {
  id: string;
  title: string;
  date: string;
  time: string;
  description?: string;
}

export function ReminderList() {
  const [reminders, setReminders] = useState<Reminder[]>([]);

  useEffect(() => {
    const handleNewReminder = (event: CustomEvent) => {
      const newReminderData = event.detail;
      const newReminder: Reminder = {
        id: Date.now().toString(),
        title: newReminderData.title,
        date: newReminderData.date,
        time: newReminderData.time,
        description: `Created via chat at ${new Date().toLocaleTimeString(
          "en-US"
        )}`,
      };

      setReminders((prev) => [newReminder, ...prev]);
    };

    window.addEventListener("newReminder", handleNewReminder as EventListener);

    return () => {
      window.removeEventListener(
        "newReminder",
        handleNewReminder as EventListener
      );
    };
  }, []);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    return `${days[date.getDay()]}, ${date.getDate()} ${
      months[date.getMonth()]
    } ${date.getFullYear()}`;
  };

  const deleteReminder = async (id: string) => {
    setReminders((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <div className="space-y-4">
      {reminders.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No reminders have been created yet.</p>
          <p className="text-sm mt-1">
            Use the chat on the left to create new reminders.
          </p>
        </div>
      ) : (
        reminders.map((reminder) => (
          <Card
            key={reminder.id}
            className="p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">
                  {reminder.title}
                </h3>
                {reminder.description && (
                  <p className="text-sm text-gray-600 mb-2">
                    {reminder.description}
                  </p>
                )}
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-gray-500">
                    {formatDate(reminder.date)}
                  </span>
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
                    {reminder.time}
                  </span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => deleteReminder(reminder.id)}
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
              >
                🗑️
              </Button>
            </div>
          </Card>
        ))
      )}
    </div>
  );
}
