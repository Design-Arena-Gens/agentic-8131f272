"use client";

import type { Assignment, Goal, Reminder, ScheduleItem } from "@/lib/types";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import { clsx } from "clsx";

dayjs.extend(isBetween);

type OverviewSummaryProps = {
  schedule: ScheduleItem[];
  goals: Goal[];
  assignments: Assignment[];
  reminders: Reminder[];
};

const SUMMARY_CARDS = [
  { key: "focus", label: "Focus blocks", color: "bg-brand-100 text-brand-700" },
  { key: "canvas", label: "Canvas deadlines", color: "bg-sky-100 text-sky-700" },
  { key: "wins", label: "Goals on track", color: "bg-emerald-100 text-emerald-700" },
  { key: "nudges", label: "Reminders today", color: "bg-amber-100 text-amber-700" }
] as const;

export function OverviewSummary({ schedule, goals, assignments, reminders }: OverviewSummaryProps) {
  const now = dayjs();
  const todayStart = now.startOf("day");
  const todayEnd = now.endOf("day");

  const blocksToday = schedule.filter((item) => dayjs(item.start).isBetween(todayStart, todayEnd, null, "[]")).length;
  const deadlinesToday = assignments.filter((assignment) =>
    assignment.dueDate ? dayjs(assignment.dueDate).isBetween(todayStart, todayEnd, null, "[]") : false
  ).length;
  const goalsOnTrack = goals.filter((goal) => goal.progress >= 50 && goal.status !== "complete").length;
  const remindersToday = reminders.filter((reminder) =>
    reminder.dueDate ? dayjs(reminder.dueDate).isBetween(todayStart, todayEnd, null, "[]") : false
  ).length;

  const values: Record<(typeof SUMMARY_CARDS)[number]["key"], number> = {
    focus: blocksToday,
    canvas: deadlinesToday,
    wins: goalsOnTrack,
    nudges: remindersToday
  };

  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
      {SUMMARY_CARDS.map((card) => (
        <div
          key={card.key}
          className={clsx(
            "rounded-3xl border border-slate-200 bg-white/80 p-5 shadow-sm transition hover:shadow-card",
            card.color
          )}
        >
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">
            {card.label}
          </p>
          <p className="mt-2 text-3xl font-bold">{values[card.key]}</p>
        </div>
      ))}
    </div>
  );
}
