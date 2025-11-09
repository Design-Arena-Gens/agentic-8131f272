"use client";

import { useForm } from "react-hook-form";
import { Assignment } from "@/lib/types";

type AssignmentFormValues = {
  title: string;
  course?: string;
  dueDate?: string;
  description?: string;
  status: Assignment["status"];
  priority: Assignment["priority"];
  link?: string;
};

type AssignmentFormProps = {
  initial?: Assignment;
  onSubmit: (values: AssignmentFormValues) => void;
  onCancel?: () => void;
};

export function AssignmentForm({ initial, onSubmit, onCancel }: AssignmentFormProps) {
  const { register, handleSubmit } = useForm<AssignmentFormValues>({
    defaultValues: initial
      ? {
          title: initial.title,
          course: initial.course ?? "",
          dueDate: initial.dueDate ? initial.dueDate.slice(0, 16) : "",
          description: initial.description ?? "",
          status: initial.status,
          priority: initial.priority,
          link: initial.link ?? ""
        }
      : {
          title: "",
          course: "",
          dueDate: "",
          description: "",
          status: "planned",
          priority: "medium",
          link: ""
        }
  });

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-700" htmlFor="assignment-title">
          Assignment
        </label>
        <input
          id="assignment-title"
          type="text"
          {...register("title", { required: true })}
          className="w-full rounded-xl border border-slate-300 px-3 py-2 focus:border-brand-500 focus:outline-none focus:ring focus:ring-brand-100"
          placeholder="Essay draft, quiz, group project..."
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700" htmlFor="assignment-course">
            Course
          </label>
          <input
            id="assignment-course"
            type="text"
            {...register("course")}
            className="w-full rounded-xl border border-slate-300 px-3 py-2 focus:border-brand-500 focus:outline-none focus:ring focus:ring-brand-100"
            placeholder="ENG 101"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700" htmlFor="assignment-due">
            Due
          </label>
          <input
            id="assignment-due"
            type="datetime-local"
            {...register("dueDate")}
            className="w-full rounded-xl border border-slate-300 px-3 py-2 focus:border-brand-500 focus:outline-none focus:ring focus:ring-brand-100"
          />
        </div>
      </div>
      <div className="space-y-2">
        <label
          className="block text-sm font-medium text-slate-700"
          htmlFor="assignment-description"
        >
          Details
        </label>
        <textarea
          id="assignment-description"
          rows={3}
          {...register("description")}
          className="w-full rounded-xl border border-slate-300 px-3 py-2 focus:border-brand-500 focus:outline-none focus:ring focus:ring-brand-100"
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700" htmlFor="assignment-status">
            Status
          </label>
          <select
            id="assignment-status"
            {...register("status")}
            className="w-full rounded-xl border border-slate-300 px-3 py-2 focus:border-brand-500 focus:outline-none focus:ring focus:ring-brand-100"
          >
            <option value="planned">Planned</option>
            <option value="started">In progress</option>
            <option value="submitted">Submitted</option>
            <option value="graded">Graded</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700" htmlFor="assignment-priority">
            Priority
          </label>
          <select
            id="assignment-priority"
            {...register("priority")}
            className="w-full rounded-xl border border-slate-300 px-3 py-2 focus:border-brand-500 focus:outline-none focus:ring focus:ring-brand-100"
          >
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>
      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-700" htmlFor="assignment-link">
          Link
        </label>
        <input
          id="assignment-link"
          type="url"
          {...register("link")}
          className="w-full rounded-xl border border-slate-300 px-3 py-2 focus:border-brand-500 focus:outline-none focus:ring focus:ring-brand-100"
          placeholder="https://..."
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
          {initial ? "Update assignment" : "Add assignment"}
        </button>
      </div>
    </form>
  );
}
