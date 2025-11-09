"use client";

import { Fragment, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { ArrowDownTrayIcon, LinkIcon } from "@heroicons/react/24/outline";
import { parseCanvasICS } from "@/lib/ics";

type CanvasImportDialogProps = {
  onImport: (events: ReturnType<typeof parseCanvasICS>) => void;
};

export function CanvasImportDialog({ onImport }: CanvasImportDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastImportCount, setLastImportCount] = useState<number | null>(null);
  const urlRef = useRef<HTMLInputElement>(null);

  const close = () => {
    setOpen(false);
    setError(null);
    setLoading(false);
    setLastImportCount(null);
  };

  const handleFile = async (file: File | null) => {
    if (!file) return;
    setLoading(true);
    setError(null);
    try {
      const text = await file.text();
      const events = parseCanvasICS(text);
      onImport(events);
      setLastImportCount(events.length);
    } catch (err) {
      console.error(err);
      setError("We could not parse that file. Try the Canvas calendar export instead.");
    } finally {
      setLoading(false);
    }
  };

  const handleUrl = async () => {
    if (!urlRef.current) return;
    const rawUrl = urlRef.current.value.trim();
    if (!rawUrl) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(rawUrl);
      if (!res.ok) throw new Error("Failed to fetch the ICS feed");
      const text = await res.text();
      const events = parseCanvasICS(text);
      onImport(events);
      setLastImportCount(events.length);
    } catch (err) {
      console.error(err);
      setError(
        "Unable to reach that URL. Canvas feeds sometimes block cross-origin requests. Download the ICS file instead and upload it here."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-xl border border-brand-200 bg-white px-3 py-2 text-sm font-semibold text-brand-700 shadow-sm hover:border-brand-300 hover:bg-brand-50"
      >
        <ArrowDownTrayIcon className="h-4 w-4" />
        Import from Canvas
      </button>

      <Transition appear show={open} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={close}>
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
                <Dialog.Panel className="w-full max-w-xl transform overflow-hidden rounded-3xl bg-white p-8 shadow-2xl transition-all">
                  <Dialog.Title className="text-lg font-semibold text-slate-900">
                    Sync Canvas Assignments
                  </Dialog.Title>
                  <Dialog.Description className="mt-1 text-sm text-slate-600">
                    Download your Canvas Calendar feed (Account &gt; Settings &gt; Calendar
                    Feed) and upload it here. We&apos;ll translate events into assignments
                    you can manage in the dashboard.
                  </Dialog.Description>

                  <div className="mt-6 space-y-6">
                    <label className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-brand-200 bg-brand-50/40 px-6 py-10 text-center text-brand-700 transition hover:border-brand-300 hover:bg-brand-50">
                      <input
                        type="file"
                        accept=".ics,text/calendar"
                        className="hidden"
                        onChange={(event) => {
                          const file = event.target.files?.[0] ?? null;
                          event.target.value = "";
                          void handleFile(file);
                        }}
                      />
                      <ArrowDownTrayIcon className="mb-3 h-8 w-8 text-brand-500" />
                      <span className="font-medium">Drop your Canvas .ics file</span>
                      <span className="mt-1 text-xs text-brand-600">
                        It stays local – nothing is uploaded anywhere else.
                      </span>
                    </label>

                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700">
                        Or paste your Canvas feed URL
                      </label>
                      <div className="flex flex-col gap-3 sm:flex-row">
                        <div className="flex flex-1 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-inner">
                          <LinkIcon className="h-4 w-4 text-slate-400" />
                          <input
                            ref={urlRef}
                            type="url"
                            placeholder="https://yourinstitution.instructure.com/feeds/calendars/user_x.ics"
                            className="w-full border-none bg-transparent text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => void handleUrl()}
                          className="inline-flex items-center justify-center rounded-2xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-brand-500"
                          disabled={loading}
                        >
                          {loading ? "Importing..." : "Fetch"}
                        </button>
                      </div>
                      <p className="text-xs text-slate-500">
                        Canvas feeds sometimes block browsers. If Fetch fails, download the
                        file instead.
                      </p>
                    </div>

                    {error ? (
                      <div className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-600">
                        {error}
                      </div>
                    ) : null}
                    {lastImportCount !== null ? (
                      <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                        Imported {lastImportCount} Canvas items. Review them below.
                      </div>
                    ) : null}
                  </div>

                  <div className="mt-8 flex justify-end">
                    <button
                      type="button"
                      onClick={close}
                      className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
                    >
                      Done
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
