"use client";

import { useForm } from "react-hook-form";
import { Assignment, Reminder } from "@/lib/types";

type ReminderFormValues = {
  title: string;
  dueDate?: string;
  relatedId?: string;
  notes?: string;
};

type ReminderFormProps = {
  initial?: Reminder;
  assignments: Assignment[];
  onSubmit: (values: ReminderFormValues) => void;
  onCancel?: () => void;
};

export function ReminderForm({
  initial,
  assignments,
  onSubmit,
  onCancel
}: ReminderFormProps) {
  const { register, handleSubmit } = useForm<ReminderFormValues>({
    defaultValues: initial
      ? {
          title: initial.title,
          dueDate: initial.dueDate ? initial.dueDate.slice(0, 16) : "",
          relatedId: initial.relatedId ?? "",
          notes: initial.notes ?? ""
        }
      : {
          title: "",
          dueDate: "",
          relatedId: "",
          notes: ""
        }
  });

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-700" htmlFor="reminder-title">
          Reminder
        </label>
        <input
          id="reminder-title"
          type="text"
          {...register("title", { required: true })}
          className="w-full rounded-xl border border-slate-300 px-3 py-2 focus:border-brand-500 focus:outline-none focus:ring focus:ring-brand-100"
          placeholder="Check Canvas discussions, send update..."
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700" htmlFor="reminder-due">
            When
          </label>
          <input
            id="reminder-due"
            type="datetime-local"
            {...register("dueDate")}
            className="w-full rounded-xl border border-slate-300 px-3 py-2 focus:border-brand-500 focus:outline-none focus:ring focus:ring-brand-100"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700" htmlFor="reminder-related">
            Link to assignment
          </label>
          <select
            id="reminder-related"
            {...register("relatedId")}
            className="w-full rounded-xl border border-slate-300 px-3 py-2 focus:border-brand-500 focus:outline-none focus:ring focus:ring-brand-100"
          >
            <option value="">None</option>
            {assignments.map((assignment) => (
              <option key={assignment.id} value={assignment.id}>
                {assignment.title}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-700" htmlFor="reminder-notes">
          Notes
        </label>
        <textarea
          id="reminder-notes"
          rows={3}
          {...register("notes")}
          className="w-full rounded-xl border border-slate-300 px-3 py-2 focus:border-brand-500 focus:outline-none focus:ring focus:ring-brand-100"
        />
      </div>
      <div className="flex justify-end gap-3">
        {onCancel ? (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
          >
            Cancel
          </button>
        ) : null}
        <button
          type="submit"
          className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-brand-500"
        >
          {initial ? "Update reminder" : "Save reminder"}
        </button>
      </div>
    </form>
  );
}
