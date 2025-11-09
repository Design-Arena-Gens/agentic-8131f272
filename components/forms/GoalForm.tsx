"use client";

import { useForm } from "react-hook-form";
import { Goal } from "@/lib/types";

type GoalFormValues = {
  title: string;
  description?: string;
  deadline?: string;
  status: Goal["status"];
  progress: number;
  tags: string;
};

type GoalFormProps = {
  initial?: Goal;
  onSubmit: (values: GoalFormValues) => void;
  onCancel?: () => void;
};

export function GoalForm({ initial, onSubmit, onCancel }: GoalFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<GoalFormValues>({
    defaultValues: initial
      ? {
          title: initial.title,
          description: initial.description ?? "",
          deadline: initial.deadline
            ? initial.deadline.slice(0, 10)
            : "",
          status: initial.status,
          progress: initial.progress,
          tags: initial.tags.join(", ")
        }
      : {
          title: "",
          description: "",
          deadline: "",
          status: "not-started",
          progress: 0,
          tags: ""
        }
  });

  const progress = watch("progress");

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-700" htmlFor="goal-title">
          Goal
        </label>
        <input
          id="goal-title"
          type="text"
          {...register("title", { required: true })}
          className="w-full rounded-xl border border-slate-300 px-3 py-2 focus:border-brand-500 focus:outline-none focus:ring focus:ring-brand-100"
          placeholder="Finish research outline, run 10k, practice piano..."
        />
        {errors.title ? (
          <p className="text-xs text-rose-500">Give your goal a name.</p>
        ) : null}
      </div>
      <div className="space-y-2">
        <label
          className="block text-sm font-medium text-slate-700"
          htmlFor="goal-description"
        >
          Why it matters
        </label>
        <textarea
          id="goal-description"
          rows={3}
          {...register("description")}
          className="w-full rounded-xl border border-slate-300 px-3 py-2 focus:border-brand-500 focus:outline-none focus:ring focus:ring-brand-100"
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700" htmlFor="goal-deadline">
            Target date
          </label>
          <input
            id="goal-deadline"
            type="date"
            {...register("deadline")}
            className="w-full rounded-xl border border-slate-300 px-3 py-2 focus:border-brand-500 focus:outline-none focus:ring focus:ring-brand-100"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700" htmlFor="goal-status">
            Status
          </label>
          <select
            id="goal-status"
            {...register("status")}
            className="w-full rounded-xl border border-slate-300 px-3 py-2 focus:border-brand-500 focus:outline-none focus:ring focus:ring-brand-100"
          >
            <option value="not-started">Not started</option>
            <option value="in-progress">In progress</option>
            <option value="complete">Complete</option>
          </select>
        </div>
      </div>
      <div className="space-y-2">
        <label className="flex justify-between text-sm font-medium text-slate-700">
          <span>Progress</span>
          <span className="text-brand-600">{progress}%</span>
        </label>
        <input
          type="range"
          min={0}
          max={100}
          step={5}
          {...register("progress", { valueAsNumber: true })}
          className="w-full accent-brand-500"
        />
      </div>
      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-700" htmlFor="goal-tags">
          Tags
        </label>
        <input
          id="goal-tags"
          type="text"
          {...register("tags")}
          className="w-full rounded-xl border border-slate-300 px-3 py-2 focus:border-brand-500 focus:outline-none focus:ring focus:ring-brand-100"
          placeholder="health, career, school"
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
          {initial ? "Update goal" : "Save goal"}
        </button>
      </div>
    </form>
  );
}
