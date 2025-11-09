"use client";

import { Fragment, useMemo, useState } from "react";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import { nanoid } from "nanoid";
import { Transition, Dialog } from "@headlessui/react";
import {
  CalendarDaysIcon,
  AcademicCapIcon,
  BellAlertIcon,
  ArrowPathIcon,
  PlusIcon
} from "@heroicons/react/24/outline";
import { SectionCard } from "@/components/layout/SectionCard";
import { ScheduleForm } from "@/components/forms/ScheduleForm";
import { GoalForm } from "@/components/forms/GoalForm";
import { AssignmentForm } from "@/components/forms/AssignmentForm";
import { ReminderForm } from "@/components/forms/ReminderForm";
import { OverviewSummary } from "@/components/dashboard/OverviewSummary";
import { ScheduleTimeline } from "@/components/dashboard/ScheduleTimeline";
import { GoalList } from "@/components/dashboard/GoalList";
import { AssignmentTable } from "@/components/dashboard/AssignmentTable";
import { ReminderList } from "@/components/dashboard/ReminderList";
import { CanvasImportDialog } from "@/components/canvas/CanvasImportDialog";
import { usePersistentState } from "@/lib/storage";
import type {
  Assignment,
  DashboardState,
  Goal,
  Reminder,
  ScheduleItem
} from "@/lib/types";

dayjs.extend(advancedFormat);

type ModalState =
  | { type: "schedule"; item?: ScheduleItem }
  | { type: "goal"; item?: Goal }
  | { type: "assignment"; item?: Assignment }
  | { type: "reminder"; item?: Reminder }
  | null;

const STORAGE_KEY = "agentic-dashboard-v1";

const initialState: DashboardState = {
  schedule: [],
  goals: [],
  assignments: [],
  reminders: []
};

export default function HomePage() {
  const [dashboard, setDashboard, resetDashboard] = usePersistentState<DashboardState>(
    STORAGE_KEY,
    initialState
  );
  const [modal, setModal] = useState<ModalState>(null);
  const [selectedDate, setSelectedDate] = useState(dayjs().format("YYYY-MM-DD"));

  const scheduleForDay = useMemo(() => {
    return dashboard.schedule.filter((item) =>
      dayjs(item.start).isSame(selectedDate, "day")
    );
  }, [dashboard.schedule, selectedDate]);

  const openModal = (modalState: Exclude<ModalState, null>) => setModal(modalState);
  const closeModal = () => setModal(null);

  return (
    <main className="mx-auto max-w-7xl px-6 pb-24 pt-12">
      <header className="flex flex-col gap-6 rounded-3xl bg-gradient-to-br from-brand-500 via-brand-600 to-slate-900 px-8 py-10 text-white shadow-lg">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-wide text-brand-100">
              {dayjs().format("dddd, MMMM Do")}
            </p>
            <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
              Personal Command Center
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-brand-100">
              Align your day with your goals, assignments, and Canvas reminders in one
              place. Everything you add stays on this device.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => openModal({ type: "schedule" })}
              className="inline-flex items-center gap-2 rounded-2xl bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20"
            >
              <CalendarDaysIcon className="h-4 w-4" />
              Plan focus block
            </button>
            <button
              type="button"
              onClick={() => openModal({ type: "goal" })}
              className="inline-flex items-center gap-2 rounded-2xl bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20"
            >
              <AcademicCapIcon className="h-4 w-4" />
              Add goal
            </button>
            <button
              type="button"
              onClick={() => openModal({ type: "assignment" })}
              className="inline-flex items-center gap-2 rounded-2xl bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20"
            >
              <PlusIcon className="h-4 w-4" />
              Assignment
            </button>
            <button
              type="button"
              onClick={() => openModal({ type: "reminder" })}
              className="inline-flex items-center gap-2 rounded-2xl bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20"
            >
              <BellAlertIcon className="h-4 w-4" />
              Reminder
            </button>
            <button
              type="button"
              onClick={resetDashboard}
              className="inline-flex items-center gap-2 rounded-2xl bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20"
            >
              <ArrowPathIcon className="h-4 w-4" />
              Reset
            </button>
          </div>
        </div>
        <OverviewSummary
          schedule={dashboard.schedule}
          goals={dashboard.goals}
          assignments={dashboard.assignments}
          reminders={dashboard.reminders}
        />
      </header>

      <div className="mt-10 grid gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          <SectionCard
            title="Today's Schedule"
            action={
              <div className="flex items-center gap-3">
                <input
                  type="date"
                  className="rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-600 focus:border-brand-500 focus:outline-none focus:ring focus:ring-brand-100"
                  value={selectedDate}
                  onChange={(event) => setSelectedDate(event.target.value)}
                />
                <button
                  type="button"
                  onClick={() => openModal({ type: "schedule" })}
                  className="rounded-xl bg-brand-600 px-3 py-2 text-xs font-semibold text-white shadow hover:bg-brand-500"
                >
                  Add block
                </button>
              </div>
            }
          >
            <ScheduleTimeline
              items={scheduleForDay}
              onEdit={(item) => openModal({ type: "schedule", item })}
              onDelete={(id) =>
                setDashboard((prev) => ({
                  ...prev,
                  schedule: prev.schedule.filter((block) => block.id !== id)
                }))
              }
            />
          </SectionCard>

          <SectionCard
            title="Assignments & Deadlines"
            action={
              <div className="flex items-center gap-3">
                <CanvasImportDialog
                  onImport={(events) => {
                    if (!events.length) return;
                    const mapped = events.map((event) => ({
                      id: nanoid(),
                      title: event.title,
                      course: event.course,
                      dueDate: event.dueDate,
                      description: event.description,
                      link: event.link,
                      status: "planned" as const,
                      priority: "medium" as const,
                      source: "canvas" as const
                    }));
                    setDashboard((prev) => ({
                      ...prev,
                      assignments: dedupeAssignments(prev.assignments, mapped)
                    }));
                  }}
                />
                <button
                  type="button"
                  onClick={() => openModal({ type: "assignment" })}
                  className="rounded-xl bg-brand-600 px-3 py-2 text-xs font-semibold text-white shadow hover:bg-brand-500"
                >
                  Add assignment
                </button>
              </div>
            }
          >
            <AssignmentTable
              assignments={dashboard.assignments}
              onEdit={(assignment) => openModal({ type: "assignment", item: assignment })}
              onDelete={(id) =>
                setDashboard((prev) => ({
                  ...prev,
                  assignments: prev.assignments.filter((item) => item.id !== id)
                }))
              }
              onAdvanceStatus={(id) =>
                setDashboard((prev) => ({
                  ...prev,
                  assignments: prev.assignments.map((assignment) =>
                    assignment.id === id
                      ? { ...assignment, status: nextStatus(assignment.status) }
                      : assignment
                  )
                }))
              }
            />
          </SectionCard>
        </div>

        <div className="space-y-6">
          <SectionCard
            title="Goals"
            action={
              <button
                type="button"
                onClick={() => openModal({ type: "goal" })}
                className="rounded-xl bg-brand-600 px-3 py-2 text-xs font-semibold text-white shadow hover:bg-brand-500"
              >
                Add goal
              </button>
            }
          >
            <GoalList
              goals={dashboard.goals}
              onEdit={(goal) => openModal({ type: "goal", item: goal })}
              onDelete={(id) =>
                setDashboard((prev) => ({
                  ...prev,
                  goals: prev.goals.filter((goal) => goal.id !== id)
                }))
              }
              onToggleComplete={(id) =>
                setDashboard((prev) => ({
                  ...prev,
                  goals: prev.goals.map((goal) =>
                    goal.id === id
                      ? goal.status === "complete"
                        ? { ...goal, status: "in-progress" }
                        : { ...goal, status: "complete", progress: 100 }
                      : goal
                  )
                }))
              }
            />
          </SectionCard>

          <SectionCard
            title="Reminders"
            action={
              <button
                type="button"
                onClick={() => openModal({ type: "reminder" })}
                className="rounded-xl bg-brand-600 px-3 py-2 text-xs font-semibold text-white shadow hover:bg-brand-500"
              >
                Add reminder
              </button>
            }
          >
            <ReminderList
              reminders={dashboard.reminders}
              assignments={dashboard.assignments}
              onToggle={(id) =>
                setDashboard((prev) => ({
                  ...prev,
                  reminders: prev.reminders.map((reminder) =>
                    reminder.id === id
                      ? { ...reminder, completed: !reminder.completed }
                      : reminder
                  )
                }))
              }
              onEdit={(reminder) => openModal({ type: "reminder", item: reminder })}
              onDelete={(id) =>
                setDashboard((prev) => ({
                  ...prev,
                  reminders: prev.reminders.filter((reminder) => reminder.id !== id)
                }))
              }
            />
          </SectionCard>
        </div>
      </div>

      <footer className="mt-12 rounded-3xl border border-slate-200 bg-white/60 px-8 py-6 text-sm text-slate-500 shadow-sm">
        <h2 className="text-base font-semibold text-slate-800">
          Canvas quick tips
        </h2>
        <ol className="mt-3 list-decimal space-y-2 pl-5">
          <li>In Canvas, open Account → Settings → Approved Integrations.</li>
          <li>Enable &quot;Calendar Feed&quot; and copy your personal .ics URL.</li>
          <li>Import it here to sync due dates with your assignments and reminders.</li>
          <li>
            Re-import anytime; we attempt to merge existing items without duplicates.
          </li>
        </ol>
      </footer>

      <FormModal open={modal !== null} onClose={closeModal}>
        {modal?.type === "schedule" ? (
          <ScheduleForm
            initial={modal.item}
            onSubmit={(values) => {
              const scheduleItem = normalizeSchedule(values, modal.item?.id ?? nanoid());
              setDashboard((prev) => ({
                ...prev,
                schedule: upsert(prev.schedule, scheduleItem)
              }));
              setSelectedDate(dayjs(scheduleItem.start).format("YYYY-MM-DD"));
              closeModal();
            }}
            onCancel={closeModal}
          />
        ) : null}
        {modal?.type === "goal" ? (
          <GoalForm
            initial={modal.item}
            onSubmit={(values) => {
              const goal = normalizeGoal(values, modal.item?.id ?? nanoid());
              setDashboard((prev) => ({
                ...prev,
                goals: upsert(prev.goals, goal)
              }));
              closeModal();
            }}
            onCancel={closeModal}
          />
        ) : null}
        {modal?.type === "assignment" ? (
          <AssignmentForm
            initial={modal.item}
            onSubmit={(values) => {
              const assignment = normalizeAssignment(values, modal.item?.id ?? nanoid(), modal.item?.source ?? "manual");
              setDashboard((prev) => ({
                ...prev,
                assignments: upsert(prev.assignments, assignment)
              }));
              closeModal();
            }}
            onCancel={closeModal}
          />
        ) : null}
        {modal?.type === "reminder" ? (
          <ReminderForm
            initial={modal.item}
            assignments={dashboard.assignments}
            onSubmit={(values) => {
              const reminder = normalizeReminder(
                values,
                modal.item?.id ?? nanoid(),
                modal.item?.completed ?? false
              );
              setDashboard((prev) => ({
                ...prev,
                reminders: upsert(prev.reminders, reminder)
              }));
              closeModal();
            }}
            onCancel={closeModal}
          />
        ) : null}
      </FormModal>
    </main>
  );
}

type ScheduleFormInput = Parameters<typeof ScheduleForm>[0]["onSubmit"] extends (
  value: infer V
) => void
  ? V
  : never;
type GoalFormInput = Parameters<typeof GoalForm>[0]["onSubmit"] extends (
  value: infer V
) => void
  ? V
  : never;
type AssignmentFormInput = Parameters<typeof AssignmentForm>[0]["onSubmit"] extends (
  value: infer V
) => void
  ? V
  : never;
type ReminderFormInput = Parameters<typeof ReminderForm>[0]["onSubmit"] extends (
  value: infer V
) => void
  ? V
  : never;

function normalizeSchedule(values: ScheduleFormInput, id: string): ScheduleItem {
  const start = combineDateTime(values.date, values.startTime);
  const end = values.endTime ? combineDateTime(values.date, values.endTime) : start;
  return {
    id,
    title: values.title,
    start,
    end,
    location: trimToUndefined(values.location),
    notes: trimToUndefined(values.notes)
  };
}

function normalizeGoal(values: GoalFormInput, id: string): Goal {
  const tags = values.tags
    ? values.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean)
    : [];
  return {
    id,
    title: values.title,
    description: trimToUndefined(values.description),
    deadline: values.deadline ? dayjs(values.deadline).toISOString() : undefined,
    status: values.status,
    progress: values.progress,
    tags
  };
}

function normalizeAssignment(
  values: AssignmentFormInput,
  id: string,
  source: Assignment["source"]
): Assignment {
  return {
    id,
    title: values.title,
    course: trimToUndefined(values.course),
    dueDate: values.dueDate ? dayjs(values.dueDate).toISOString() : undefined,
    description: trimToUndefined(values.description),
    status: values.status,
    priority: values.priority,
    link: trimToUndefined(values.link),
    source
  };
}

function normalizeReminder(
  values: ReminderFormInput,
  id: string,
  completed: boolean
): Reminder {
  return {
    id,
    title: values.title,
    dueDate: values.dueDate ? dayjs(values.dueDate).toISOString() : undefined,
    relatedId: trimToUndefined(values.relatedId),
    notes: trimToUndefined(values.notes),
    completed
  };
}

function combineDateTime(date: string, time: string) {
  return dayjs(`${date}T${time}`).toISOString();
}

function trimToUndefined(value?: string | null) {
  if (!value) return undefined;
  const trimmed = value.trim();
  return trimmed ? trimmed : undefined;
}

function upsert<T extends { id: string }>(collection: T[], item: T) {
  const exists = collection.some((entry) => entry.id === item.id);
  if (exists) {
    return collection.map((entry) => (entry.id === item.id ? item : entry));
  }
  return [...collection, item];
}

function nextStatus(status: Assignment["status"]): Assignment["status"] {
  const order: Assignment["status"][] = ["planned", "started", "submitted", "graded"];
  const idx = order.indexOf(status);
  const nextIndex = idx === -1 ? 0 : (idx + 1) % order.length;
  return order[nextIndex];
}

function dedupeAssignments(existing: Assignment[], incoming: Assignment[]) {
  const seen = new Set(existing.map((item) => signature(item)));
  const merged = [...existing];
  for (const item of incoming) {
    const key = signature(item);
    if (seen.has(key)) continue;
    merged.push(item);
    seen.add(key);
  }
  return merged;
}

function signature(assignment: Assignment) {
  return [
    assignment.title.toLowerCase(),
    assignment.course?.toLowerCase() ?? "",
    assignment.dueDate ? dayjs(assignment.dueDate).format("YYYY-MM-DDTHH:mm") : "",
    assignment.source ?? "manual"
  ].join("|");
}

type FormModalProps = {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

function FormModal({ open, onClose, children }: FormModalProps) {
  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center px-4 py-8">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 translate-y-4"
              enterTo="opacity-100 translate-y-0"
              leave="ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-4"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-3xl bg-white p-8 shadow-2xl transition-all">
                {children}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
