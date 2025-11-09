import { ReactNode } from "react";
import { clsx } from "clsx";

type SectionCardProps = {
  title: string;
  action?: ReactNode;
  className?: string;
  children: ReactNode;
};

export function SectionCard({ title, action, className, children }: SectionCardProps) {
  return (
    <section
      className={clsx(
        "flex flex-col rounded-3xl border border-slate-200 bg-white/70 p-6 shadow-card backdrop-blur",
        className
      )}
    >
      <header className="mb-4 flex items-center justify-between gap-4">
        <h2 className="text-lg font-semibold text-slate-800">{title}</h2>
        {action ? <div className="flex items-center gap-2">{action}</div> : null}
      </header>
      <div className="flex-1">{children}</div>
    </section>
  );
}
