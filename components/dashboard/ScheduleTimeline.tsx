"use client";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import localizedFormat from "dayjs/plugin/localizedFormat";
import { ScheduleItem } from "@/lib/types";
import { clsx } from "clsx";

dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);

type ScheduleTimelineProps = {
  items: ScheduleItem[];
  onEdit: (item: ScheduleItem) => void;
  onDelete: (id: string) => void;
};

export function ScheduleTimeline({ items, onEdit, onDelete }: ScheduleTimelineProps) {
  if (!items.length) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-12 text-center text-sm text-slate-500">
        Plan your focus blocks, workouts, and commitments for today.
      </div>
    );
  }

  const sorted = [...items].sort((a, b) => Number(dayjs(a.start)) - Number(dayjs(b.start)));
  const now = dayjs();

  return (
    <ol className="space-y-4">
      {sorted.map((item) => {
        const start = dayjs(item.start);
        const end = item.end ? dayjs(item.end) : null;
        const isPast = start.isBefore(now) && (!end || end.isBefore(now));
        const isCurrent =
          start.isBefore(now) && end ? now.isBefore(end) : start.isSame(now, "minute");
        return (
          <li
            key={item.id}
            className={clsx(
              "flex items-start gap-4 rounded-2xl border border-transparent bg-white/70 px-4 py-4 shadow-sm transition",
              isCurrent && "border-brand-300 shadow-card",
              !isCurrent && !isPast && "hover:border-brand-200 hover:shadow-card",
              isPast && "opacity-80"
            )}
          >
            <div className="relative mt-1 flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-xs font-semibold text-slate-600">
              {start.format("h:mm")}
              <span className="absolute -bottom-4 text-[10px] uppercase tracking-wide text-slate-400">
                {start.format("A")}
              </span>
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-base font-semibold text-slate-900">{item.title}</h3>
                  <p className="text-xs text-slate-500">
                    {start.format("dddd, MMM D")} · {start.format("h:mm A")}
                    {end ? ` – ${end.format("h:mm A")}` : ""} · {start.from(now)}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(item)}
                    className="rounded-xl border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(item.id)}
                    className="rounded-xl border border-rose-200 px-3 py-1 text-xs font-medium text-rose-600 hover:bg-rose-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
              {item.location ? (
                <div className="inline-flex items-center gap-2 rounded-xl bg-brand-50 px-3 py-1 text-xs font-medium text-brand-600">
                  {item.location}
                </div>
              ) : null}
              {item.notes ? (
                <p className="text-sm text-slate-600">{item.notes}</p>
              ) : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
