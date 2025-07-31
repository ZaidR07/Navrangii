"use client";

import React from "react";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  today: number;
  yesterday: number;
  week: number;
  month: number;
  icon: LucideIcon;
  color?: string; // e.g. "from-purple-500 to-purple-600"
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  today,
  yesterday,
  week,
  month,
  icon: Icon,
  color = "from-purple-500 to-purple-600",
}) => (
  <div
    className={[
      "relative grid gap-4 rounded-2xl p-4 sm:p-6 text-white",
      "bg-gradient-to-br",
      color,
      "border border-white/15 backdrop-blur-md",
      "shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl",
      "min-h-[160px] overflow-hidden",
    ].join(" ")}
  >
    {/* Header with title, today value, and icon (grid version) */}
    <div className="grid grid-cols-[1fr_auto] items-start">
      <div className="grid gap-1">
        <p className="text-sm font-medium text-white/90">{title}</p>
        <p className="text-3xl sm:text-4xl font-bold">{today}</p>
      </div>
      <div className="p-3 rounded-full bg-white/15 backdrop-blur-sm place-self-start">
        <Icon className="text-white" size={32} />
      </div>
    </div>

    {/* 3-column stats grid */}
    <div className="grid grid-cols-2 gap-2 text-center text-xs sm:text-sm">
      <div>
        <p className=" text-white/70 tracking-wider">Yesterday</p>
        <p className="font-semibold">{yesterday}</p>
      </div>
      <div>
        <p className=" text-white/70 tracking-wider">Week</p>
        <p className="font-semibold">{week}</p>
      </div>
    </div>
    <div className="text-center">
      <p className=" text-white/70 tracking-wider">Month</p>
      <p className="font-semibold">{month}</p>
    </div>

    {/* Decorative blob */}
    <div className="pointer-events-none absolute right-0 top-0 h-24 w-24 -translate-y-12 translate-x-12 rounded-full bg-white/10 sm:h-32 sm:w-32 sm:-translate-y-16 sm:translate-x-16" />
  </div>
);

export default StatCard;
