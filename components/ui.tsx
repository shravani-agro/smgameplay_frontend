"use client";

import React from "react";

export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export function Card({
  title,
  subtitle,
  children,
  actions,
  className = "",
  bodyClassName = "",
}: {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  children: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
  bodyClassName?: string;
}) {
  return (
    <div className={cn("card animate-fade-in group hover:border-white/20 transition-all duration-300", className)}>
      {(title || actions) && (
        <div className="flex flex-col gap-3 border-b border-white/5 px-5 py-4 sm:flex-row sm:items-center sm:justify-between bg-white/[0.01]">
          <div>
            {title && <h3 className="text-base font-semibold text-slate-100">{title}</h3>}
            {subtitle && <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p>}
          </div>
          {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
        </div>
      )}
      <div className={cn("p-5", bodyClassName)}>{children}</div>
    </div>
  );
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  type = "button",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger" | "success" | "ghost" | "outline";
  size?: "sm" | "md" | "lg" | "icon";
}) {
  const variants: Record<string, string> = {
    primary: "bg-brand-600 hover:bg-brand-500 text-white shadow-glow",
    secondary: "bg-ink-700 hover:bg-ink-600 text-slate-100",
    danger: "bg-red-600 hover:bg-red-500 text-white",
    success: "bg-emerald-600 hover:bg-emerald-500 text-white",
    ghost: "bg-transparent hover:bg-white/5 text-slate-300",
    outline: "border border-white/10 bg-transparent hover:bg-white/5 text-slate-200",
  };
  const sizes: Record<string, string> = {
    sm: "h-8 px-3 text-xs",
    md: "h-10 px-4 text-sm",
    lg: "h-11 px-5 text-sm",
    icon: "h-9 w-9",
  };
  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-150 disabled:cursor-not-allowed disabled:opacity-50 active:scale-[0.98]",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function Badge({
  children,
  color = "slate",
  className = "",
}: {
  children: React.ReactNode;
  color?: "slate" | "green" | "red" | "amber" | "blue" | "emerald" | "brand" | "violet";
  className?: string;
}) {
  const colors: Record<string, string> = {
    slate: "bg-white/5 text-slate-300 ring-1 ring-inset ring-white/10",
    green: "bg-emerald-500/10 text-emerald-300 ring-1 ring-inset ring-emerald-500/20",
    red: "bg-red-500/10 text-red-300 ring-1 ring-inset ring-red-500/20",
    amber: "bg-amber-500/10 text-amber-300 ring-1 ring-inset ring-amber-500/20",
    blue: "bg-sky-500/10 text-sky-300 ring-1 ring-inset ring-sky-500/20",
    emerald: "bg-emerald-500/10 text-emerald-300 ring-1 ring-inset ring-emerald-500/20",
    brand: "bg-brand-500/10 text-brand-300 ring-1 ring-inset ring-brand-500/20",
    violet: "bg-violet-500/10 text-violet-300 ring-1 ring-inset ring-violet-500/20",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        colors[color],
        className
      )}
    >
      {children}
    </span>
  );
}

export function Input({
  className = "",
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn("input-base", className)} {...props} />;
}

export function Textarea({
  className = "",
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn("input-base resize-none", className)} {...props} />;
}

export function Select({
  className = "",
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select className={cn("input-base appearance-none", className)} {...props}>
      {children}
    </select>
  );
}

export function Label({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <label className={cn("mb-1.5 block text-xs font-medium text-slate-400", className)}>{children}</label>;
}

export function Field({
  label,
  children,
  value,
}: {
  label: string;
  children?: React.ReactNode;
  value?: React.ReactNode;
}) {
  return (
    <div>
      <Label>{label}</Label>
      {children ?? <span className="text-sm text-slate-200">{value ?? "—"}</span>}
    </div>
  );
}

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  size = "md",
}: {
  open: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg";
}) {
  if (!open) return null;
  const sizes = { sm: "max-w-md", md: "max-w-lg", lg: "max-w-2xl" };
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        className={cn(
          "w-full rounded-t-2xl border border-white/10 bg-ink-850 shadow-2xl animate-scale-in sm:rounded-2xl",
          sizes[size]
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between border-b border-white/5 px-5 py-4">
          <div>
            {title && <h3 className="text-base font-semibold text-slate-100">{title}</h3>}
            {description && <p className="mt-0.5 text-xs text-slate-500">{description}</p>}
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-white/5 hover:text-slate-200"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        <div className="max-h-[80vh] overflow-y-auto p-5">{children}</div>
      </div>
    </div>
  );
}

export function Spinner({ className = "" }: { className?: string }) {
  return (
    <div className={cn("flex items-center justify-center py-10", className)}>
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-brand-500" />
    </div>
  );
}

export function ErrorMsg({ msg }: { msg?: string | null }) {
  if (!msg) return null;
  return (
    <div className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2.5 text-sm text-red-300">
      <span>⚠</span>
      <span>{msg}</span>
    </div>
  );
}

export function EmptyState({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white/5 text-xl">📭</div>
      <p className="text-sm font-medium text-slate-300">{title}</p>
      {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
    </div>
  );
}

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-slate-50 sm:text-2xl">{title}</h1>
        {description && <p className="mt-1 text-sm text-slate-400">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export function DataTable({
  columns,
  rows,
  getRowKey,
  empty,
}: {
  columns: { key: string; header: React.ReactNode; className?: string; render?: (row: any) => React.ReactNode }[];
  rows: any[];
  getRowKey: (row: any) => React.Key;
  empty?: React.ReactNode;
}) {
  return (
    <div className="table-wrap">
      <table className="w-full min-w-[640px] text-sm">
        <thead>
          <tr className="text-left text-xs uppercase tracking-wide text-slate-500">
            {columns.map((c) => (
              <th key={c.key} className={cn("whitespace-nowrap py-2.5 font-medium", c.className)}>
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={getRowKey(row)} className="border-t border-white/5 hover:bg-white/[0.02]">
              {columns.map((c) => (
                <td key={c.key} className={cn("py-3 text-slate-300", c.className)}>
                  {c.render ? c.render(row) : row[c.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {rows.length === 0 && (empty ?? <EmptyState title="No records found" />)}
    </div>
  );
}

export function StatCard({
  label,
  value,
  icon,
  accent = "brand",
  delta,
}: {
  label: string;
  value: React.ReactNode;
  icon?: React.ReactNode;
  accent?: "brand" | "emerald" | "amber" | "sky" | "violet";
  delta?: { value: string; positive?: boolean };
}) {
  const accents: Record<string, string> = {
    brand: "from-brand-600/30 to-brand-500/5 text-brand-300 shadow-brand-500/20",
    emerald: "from-emerald-600/30 to-emerald-500/5 text-emerald-300 shadow-emerald-500/20",
    amber: "from-amber-600/30 to-amber-500/5 text-amber-300 shadow-amber-500/20",
    sky: "from-sky-600/30 to-sky-500/5 text-sky-300 shadow-sky-500/20",
    violet: "from-violet-600/30 to-violet-500/5 text-violet-300 shadow-violet-500/20",
  };
  return (
    <div className="card relative overflow-hidden p-5 group transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
      <div className={cn("pointer-events-none absolute inset-0 bg-gradient-to-br opacity-60 transition-opacity duration-300 group-hover:opacity-100", accents[accent].split(" ").slice(0, 2).join(" "))} />
      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400 group-hover:text-slate-300 transition-colors">{label}</p>
          <p className="mt-1.5 text-3xl font-bold text-slate-50">{value}</p>
          {delta && (
            <p className={cn("mt-1 text-xs font-medium", delta.positive ? "text-emerald-400" : "text-red-400")}>
              {delta.positive ? "▲" : "▼"} {delta.value}
            </p>
          )}
        </div>
        {icon && (
          <div className={cn("flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-xl backdrop-blur-md shadow-lg transition-transform duration-300 group-hover:scale-110", accents[accent].split(" ")[2])}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}

export function SlideOver({
  open,
  onClose,
  title,
  description,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
}) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm transition-opacity"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl h-full bg-ink-900 border-l border-white/10 shadow-2xl flex flex-col animate-slide-in-right overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between border-b border-white/5 px-6 py-5 bg-ink-950/50">
          <div>
            {title && <h3 className="text-xl font-bold text-slate-100">{title}</h3>}
            {description && <p className="mt-1 text-sm text-slate-400">{description}</p>}
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 transition hover:bg-white/10 hover:text-slate-200"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 scroll-smooth">{children}</div>
      </div>
    </div>
  );
}

export function Tabs({
  tabs,
  activeTab,
  onChange,
}: {
  tabs: { id: string; label: string; icon?: React.ReactNode }[];
  activeTab: string;
  onChange: (id: string) => void;
}) {
  return (
    <div className="flex space-x-1 border-b border-white/10 overflow-x-auto no-scrollbar">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={cn(
            "flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-all whitespace-nowrap",
            activeTab === tab.id
              ? "border-brand-500 text-brand-400"
              : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-white/5 rounded-t-lg"
          )}
        >
          {tab.icon && <span className="text-lg">{tab.icon}</span>}
          {tab.label}
        </button>
      ))}
    </div>
  );
}
