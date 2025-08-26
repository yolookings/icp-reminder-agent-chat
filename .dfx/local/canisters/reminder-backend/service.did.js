export const idlFactory = ({ IDL }) => {
  const ReminderId = IDL.Nat32;
  const Reminder = IDL.Record({
    'title' : IDL.Text,
    'isCompleted' : IDL.Bool,
    'createdAt' : IDL.Int,
    'description' : IDL.Text,
    'reminderTime' : IDL.Int,
  });
  return IDL.Service({
    'completeReminder' : IDL.Func([ReminderId], [IDL.Bool], []),
    'createReminder' : IDL.Func([Reminder], [ReminderId], []),
    'deleteReminder' : IDL.Func([ReminderId], [IDL.Bool], []),
    'getAllReminders' : IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(ReminderId, Reminder))],
        ['query'],
      ),
    'getDueReminders' : IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(ReminderId, Reminder))],
        ['query'],
      ),
    'getPendingReminders' : IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(ReminderId, Reminder))],
        ['query'],
      ),
    'getReminder' : IDL.Func([ReminderId], [IDL.Opt(Reminder)], ['query']),
    'updateReminder' : IDL.Func([ReminderId, Reminder], [IDL.Bool], []),
  });
};
export const init = ({ IDL }) => { return []; };
