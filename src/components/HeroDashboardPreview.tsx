"use client";

import React from "react";

/** Generic SaaS dashboard preview – KPI cards, line chart, activity list, status pills */

const KPIS = [
  { label: "Revenue", value: "$12.4k", change: "+12%" },
  { label: "Users", value: "1,284", change: "+8%" },
  { label: "Conversion", value: "3.2%", change: "+0.4%" },
];

const ACTIVITY = [
  { action: "New signup", detail: "john@acme.com", time: "2m ago" },
  { action: "Subscription", detail: "Pro plan", time: "15m ago" },
  { action: "Payment", detail: "$49.00", time: "1h ago" },
];

const STATUS_PILLS = ["Active", "Pending", "Trial"];

export default function HeroDashboardPreview({ className = "" }: { className?: string }) {
  return (
    <div className={`dashboard-preview relative w-full h-full rounded-2xl overflow-hidden ${className}`} aria-hidden>
      {/* Premium motion layers */}
      <div className="dashboard-drift absolute inset-0 opacity-30 pointer-events-none" />
      <div className="dashboard-shimmer absolute inset-0 pointer-events-none" />

      <div className="dashboard-tilt relative h-full rounded-2xl border border-white/[0.08] bg-neutral-950/80 backdrop-blur-xl p-4 sm:p-5 flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-white/90">Overview</h3>
          <span className="text-xs text-neutral-500 flex items-center gap-1.5">
            <span className="dashboard-live-dot" aria-hidden />
            Live
          </span>
        </div>

        {/* KPI cards */}
        <div className="grid grid-cols-3 gap-2">
          {KPIS.map((k) => (
            <div
              key={k.label}
              className="dashboard-kpi-card rounded-lg border border-white/[0.06] bg-white/[0.03] px-3 py-2.5"
            >
              <p className="text-[10px] text-neutral-500 uppercase tracking-wide">{k.label}</p>
              <p className="text-sm font-semibold text-white mt-0.5">{k.value}</p>
              <p className="text-[10px] text-emerald-400/80 mt-0.5">{k.change}</p>
            </div>
          ))}
        </div>

        {/* Line chart */}
        <div className="dashboard-chart-area relative rounded-lg border border-white/[0.06] bg-white/[0.02] p-3 h-[100px] overflow-hidden">
          <div className="dashboard-chart-shimmer absolute inset-0 pointer-events-none" aria-hidden />
          <p className="text-[10px] text-neutral-500 mb-2">Traffic (7d)</p>
          <svg viewBox="0 0 200 50" className="w-full h-12" preserveAspectRatio="none" aria-hidden>
            <defs>
              <linearGradient id="hero-dash-chart" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(168,85,247,0.4)" />
                <stop offset="100%" stopColor="rgba(168,85,247,0)" />
              </linearGradient>
            </defs>
            <path
              d="M0,40 Q25,35 50,30 T100,25 T150,20 T200,15 L200,50 L0,50 Z"
              fill="url(#hero-dash-chart)"
            />
            <path
              d="M0,40 Q25,35 50,30 T100,25 T150,20 T200,15"
              fill="none"
              stroke="rgba(168,85,247,0.7)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* Activity list + status pills */}
        <div className="flex flex-1 min-h-0 gap-3">
          <div className="flex-1 min-w-0 rounded-lg border border-white/[0.06] bg-white/[0.02] p-3">
            <p className="text-[10px] text-neutral-500 mb-2">Recent activity</p>
            <ul className="space-y-2">
              {ACTIVITY.map((a, i) => (
                <li key={i} className="text-[11px] flex justify-between gap-2">
                  <span className="text-white/80 truncate">{a.action}</span>
                  <span className="text-neutral-500 shrink-0">{a.time}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="shrink-0 flex flex-col gap-2">
            <p className="text-[10px] text-neutral-500">Status</p>
            <div className="flex flex-col gap-1.5">
              {STATUS_PILLS.map((s) => (
                <span
                  key={s}
                  className="dashboard-pill px-2 py-0.5 rounded-full text-[10px] font-medium w-fit"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
