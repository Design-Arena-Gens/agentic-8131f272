"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { ScheduleItem } from "@/lib/types";
import dayjs from "dayjs";

type ScheduleFormValues = {
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  location?: string;
  notes?: string;
};

type ScheduleFormProps = {
  initial?: ScheduleItem;
  onSubmit: (values: ScheduleFormValues) => void;
  onCancel?: () => void;
};

const today = dayjs().format("YYYY-MM-DD");

export function ScheduleForm({ initial, onSubmit, onCancel }: ScheduleFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm<ScheduleFormValues>({
    defaultValues: initial
      ? hydrateInitial(initial)
      : {
          title: "",
          date: today,
          startTime: "",
          endTime: "",
          location: "",
          notes: ""
        }
  });

  const startTime = watch("startTime");

  useEffect(() => {
    if (!startTime) return;
    const end = watch("endTime");
    if (end && end < startTime) {
      setValue("endTime", startTime);
    }
  }, [startTime, setValue, watch]);

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-700" htmlFor="title">
          Title
        </label>
        <input
          id="title"
          type="text"
          {...register("title", { required: true })}
          className="w-full rounded-xl border border-slate-300 px-3 py-2 focus:border-brand-500 focus:outline-none focus:ring focus:ring-brand-100"
          placeholder="Deep work block, meeting, workout..."
        />
        {errors.title ? (
          <p className="text-xs text-rose-500">A title keeps your schedule organized.</p>
        ) : null}
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700" htmlFor="date">
            Date
          </label>
          <input
            id="date"
            type="date"
            {...register("date", { required: true })}
            className="w-full rounded-xl border border-slate-300 px-3 py-2 focus:border-brand-500 focus:outline-none focus:ring focus:ring-brand-100"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700" htmlFor="startTime">
            Start
          </label>
          <input
            id="startTime"
            type="time"
            step={300}
            {...register("startTime", { required: true })}
            className="w-full rounded-xl border border-slate-300 px-3 py-2 focus:border-brand-500 focus:outline-none focus:ring focus:ring-brand-100"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700" htmlFor="endTime">
            End
          </label>
          <input
            id="endTime"
            type="time"
            step={300}
            {...register("endTime")}
            className="w-full rounded-xl border border-slate-300 px-3 py-2 focus:border-brand-500 focus:outline-none focus:ring focus:ring-brand-100"
          />
        </div>
      </div>
      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-700" htmlFor="location">
          Location
        </label>
        <input
          id="location"
          type="text"
          {...register("location")}
          className="w-full rounded-xl border border-slate-300 px-3 py-2 focus:border-brand-500 focus:outline-none focus:ring focus:ring-brand-100"
          placeholder="Library, Zoom link, gym..."
        />
      </div>
      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-700" htmlFor="notes">
          Notes
        </label>
        <textarea
          id="notes"
          rows={3}
          {...register("notes")}
          className="w-full rounded-xl border border-slate-300 px-3 py-2 focus:border-brand-500 focus:outline-none focus:ring focus:ring-brand-100"
          placeholder="Prep tasks, attachments, focus cues..."
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
          {initial ? "Update block" : "Add to plan"}
        </button>
      </div>
    </form>
  );
}

function hydrateInitial(item: ScheduleItem): ScheduleFormValues {
  const start = dayjs(item.start);
  const end = dayjs(item.end);
  return {
    title: item.title,
    date: start.format("YYYY-MM-DD"),
    startTime: start.format("HH:mm"),
    endTime: end.isValid() ? end.format("HH:mm") : "",
    location: item.location ?? "",
    notes: item.notes ?? ""
  };
}
