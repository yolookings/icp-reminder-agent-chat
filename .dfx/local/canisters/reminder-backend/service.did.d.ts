import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Reminder {
  'title' : string,
  'isCompleted' : boolean,
  'createdAt' : bigint,
  'description' : string,
  'reminderTime' : bigint,
}
export type ReminderId = number;
export interface _SERVICE {
  'completeReminder' : ActorMethod<[ReminderId], boolean>,
  'createReminder' : ActorMethod<[Reminder], ReminderId>,
  'deleteReminder' : ActorMethod<[ReminderId], boolean>,
  'getAllReminders' : ActorMethod<[], Array<[ReminderId, Reminder]>>,
  'getDueReminders' : ActorMethod<[], Array<[ReminderId, Reminder]>>,
  'getPendingReminders' : ActorMethod<[], Array<[ReminderId, Reminder]>>,
  'getReminder' : ActorMethod<[ReminderId], [] | [Reminder]>,
  'updateReminder' : ActorMethod<[ReminderId, Reminder], boolean>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
