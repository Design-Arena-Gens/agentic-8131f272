"use client";

import { Goal } from "@/lib/types";
import dayjs from "dayjs";
import { clsx } from "clsx";

type GoalListProps = {
  goals: Goal[];
  onEdit: (goal: Goal) => void;
  onDelete: (id: string) => void;
  onToggleComplete: (id: string) => void;
};

const STATUS_LABEL: Record<Goal["status"], string> = {
  "not-started": "Not started",
  "in-progress": "In progress",
  complete: "Complete"
};

export function GoalList({ goals, onEdit, onDelete, onToggleComplete }: GoalListProps) {
  if (!goals.length) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-12 text-center text-sm text-slate-500">
        Track your long-term goals and connect them to today&apos;s actions.
      </div>
    );
  }

  return (
    <ul className="space-y-4">
      {goals.map((goal) => (
        <li
          key={goal.id}
          className="rounded-2xl border border-slate-200 bg-white/70 p-4 shadow-sm transition hover:border-brand-200 hover:shadow-card"
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex-1 space-y-2">
              <div className="flex items-start gap-3">
                <button
                  onClick={() => onToggleComplete(goal.id)}
                  className={clsx(
                    "mt-1 h-5 w-5 rounded-full border-2",
                    goal.status === "complete"
                      ? "border-brand-600 bg-brand-500"
                      : "border-slate-300 hover:border-brand-400"
                  )}
                  aria-label="Toggle goal completion"
                />
                <div>
                  <h3
                    className={clsx(
                      "text-base font-semibold",
                      goal.status === "complete"
                        ? "text-slate-500 line-through"
                        : "text-slate-900"
                    )}
                  >
                    {goal.title}
                  </h3>
                  {goal.deadline ? (
                    <p className="text-xs text-slate-500">
                      Target: {dayjs(goal.deadline).format("MMM D, YYYY")}
                    </p>
                  ) : null}
                </div>
              </div>
              {goal.description ? (
                <p className="pl-8 text-sm text-slate-600">{goal.description}</p>
              ) : null}
              <div className="flex flex-wrap items-center gap-2 pl-8">
                <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-600">
                  {STATUS_LABEL[goal.status]}
                </span>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-24 overflow-hidden rounded-full bg-slate-200">
                    <div
                      className={clsx(
                        "h-full rounded-full",
                        goal.progress === 100 ? "bg-emerald-500" : "bg-brand-500"
                      )}
                      style={{ width: `${goal.progress}%` }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-slate-600">
                    {goal.progress}%
                  </span>
                </div>
                {goal.tags.length
                  ? goal.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500"
                      >
                        {tag}
                      </span>
                    ))
                  : null}
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => onEdit(goal)}
                className="rounded-xl border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(goal.id)}
                className="rounded-xl border border-rose-200 px-3 py-1 text-xs font-medium text-rose-600 hover:bg-rose-50"
              >
                Delete
              </button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
