"use client";

import { Assignment } from "@/lib/types";
import dayjs from "dayjs";
import { clsx } from "clsx";

type AssignmentTableProps = {
  assignments: Assignment[];
  onEdit: (assignment: Assignment) => void;
  onDelete: (id: string) => void;
  onAdvanceStatus: (id: string) => void;
};

const STATUS_STYLES: Record<Assignment["status"], string> = {
  planned: "bg-slate-100 text-slate-600",
  started: "bg-amber-100 text-amber-700",
  submitted: "bg-sky-100 text-sky-700",
  graded: "bg-emerald-100 text-emerald-700"
};

const PRIORITY_STYLES: Record<Assignment["priority"], string> = {
  high: "bg-rose-100 text-rose-600",
  medium: "bg-brand-100 text-brand-700",
  low: "bg-slate-100 text-slate-600"
};

export function AssignmentTable({
  assignments,
  onEdit,
  onDelete,
  onAdvanceStatus
}: AssignmentTableProps) {
  if (!assignments.length) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-12 text-center text-sm text-slate-500">
        Capture assignments manually or import them from Canvas.
      </div>
    );
  }

  const sorted = [...assignments].sort((a, b) => {
    const aDate = a.dueDate ? dayjs(a.dueDate).valueOf() : Number.POSITIVE_INFINITY;
    const bDate = b.dueDate ? dayjs(b.dueDate).valueOf() : Number.POSITIVE_INFINITY;
    return aDate - bDate;
  });

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white/80 shadow-sm">
      <table className="min-w-full divide-y divide-slate-200 text-sm">
        <thead className="bg-slate-50/80 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
          <tr>
            <th className="px-4 py-3">Assignment</th>
            <th className="px-4 py-3">Course</th>
            <th className="px-4 py-3">Due</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Priority</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {sorted.map((assignment) => (
            <tr key={assignment.id} className="text-slate-700">
              <td className="px-4 py-3">
                <div className="flex flex-col">
                  <span className="font-semibold text-slate-900">{assignment.title}</span>
                  {assignment.description ? (
                    <span className="text-xs text-slate-500">{assignment.description}</span>
                  ) : null}
                  {assignment.link ? (
                    <a
                      href={assignment.link}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-medium text-brand-600 hover:underline"
                    >
                      Open link
                    </a>
                  ) : null}
                  {assignment.source === "canvas" ? (
                    <span className="mt-1 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                      Imported from Canvas
                    </span>
                  ) : null}
                </div>
              </td>
              <td className="px-4 py-3">
                {assignment.course ? (
                  <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">
                    {assignment.course}
                  </span>
                ) : (
                  <span className="text-xs text-slate-400">—</span>
                )}
              </td>
              <td className="px-4 py-3">
                {assignment.dueDate ? (
                  <div className="flex flex-col text-xs">
                    <span className="font-semibold">
                      {dayjs(assignment.dueDate).format("MMM D")}
                    </span>
                    <span className="text-slate-500">
                      {dayjs(assignment.dueDate).format("h:mm A")}
                    </span>
                  </div>
                ) : (
                  <span className="text-xs text-slate-400">—</span>
                )}
              </td>
              <td className="px-4 py-3">
                <button
                  onClick={() => onAdvanceStatus(assignment.id)}
                  className={clsx(
                    "rounded-full px-3 py-1 text-xs font-semibold",
                    STATUS_STYLES[assignment.status]
                  )}
                >
                  {assignment.status}
                </button>
              </td>
              <td className="px-4 py-3">
                <span
                  className={clsx(
                    "rounded-full px-3 py-1 text-xs font-semibold capitalize",
                    PRIORITY_STYLES[assignment.priority]
                  )}
                >
                  {assignment.priority}
                </span>
              </td>
              <td className="px-4 py-3">
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => onEdit(assignment)}
                    className="rounded-xl border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(assignment.id)}
                    className="rounded-xl border border-rose-200 px-3 py-1 text-xs font-medium text-rose-600 hover:bg-rose-50"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
