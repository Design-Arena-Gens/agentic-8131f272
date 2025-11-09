"use client";

import { Assignment, Reminder } from "@/lib/types";
import dayjs from "dayjs";
import { clsx } from "clsx";

type ReminderListProps = {
  reminders: Reminder[];
  assignments: Assignment[];
  onToggle: (id: string) => void;
  onEdit: (reminder: Reminder) => void;
  onDelete: (id: string) => void;
};

export function ReminderList({
  reminders,
  assignments,
  onToggle,
  onEdit,
  onDelete
}: ReminderListProps) {
  if (!reminders.length) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-12 text-center text-sm text-slate-500">
        Set nudges for follow ups, study reps, or Canvas check-ins.
      </div>
    );
  }

  const sorted = [...reminders].sort((a, b) => {
    const aDate = a.dueDate ? dayjs(a.dueDate).valueOf() : Number.POSITIVE_INFINITY;
    const bDate = b.dueDate ? dayjs(b.dueDate).valueOf() : Number.POSITIVE_INFINITY;
    return aDate - bDate;
  });

  const assignmentById = new Map(assignments.map((a) => [a.id, a]));

  return (
    <ul className="space-y-3">
      {sorted.map((reminder) => {
        const related = reminder.relatedId
          ? assignmentById.get(reminder.relatedId)
          : undefined;
        return (
          <li
            key={reminder.id}
            className={clsx(
              "flex items-start gap-3 rounded-2xl border border-slate-200 bg-white/70 p-4 shadow-sm transition",
              reminder.completed && "border-emerald-200 bg-emerald-50/40"
            )}
          >
            <button
              onClick={() => onToggle(reminder.id)}
              className={clsx(
                "mt-1 h-5 w-5 rounded-lg border-2",
                reminder.completed
                  ? "border-emerald-500 bg-emerald-500"
                  : "border-slate-300 hover:border-brand-400"
              )}
              aria-label="Toggle reminder completion"
            />
            <div className="flex-1 space-y-2">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3
                    className={clsx(
                      "text-sm font-semibold",
                      reminder.completed ? "text-slate-500 line-through" : "text-slate-900"
                    )}
                  >
                    {reminder.title}
                  </h3>
                  {reminder.dueDate ? (
                    <p className="text-xs text-slate-500">
                      {dayjs(reminder.dueDate).format("MMM D, h:mm A")}
                    </p>
                  ) : null}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(reminder)}
                    className="rounded-xl border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(reminder.id)}
                    className="rounded-xl border border-rose-200 px-3 py-1 text-xs font-medium text-rose-600 hover:bg-rose-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
              {reminder.notes ? (
                <p className="text-xs text-slate-600">{reminder.notes}</p>
              ) : null}
              {related ? (
                <div className="inline-flex items-center gap-2 rounded-xl bg-slate-100 px-3 py-1 text-xs text-slate-600">
                  Linked to: <span className="font-semibold">{related.title}</span>
                </div>
              ) : null}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
