"use client";

import React from "react";
import {
  Cell,
  Pie,
  ResponsiveContainer,
  Tooltip,
  PieChart as RechartsPieChart,
} from "recharts";
import { PieChart as PieIcon } from "lucide-react";
import { motion } from "framer-motion";

import CustomTooltip from "./custom-tooltip";
import { PieDiagramProps } from "@/lib/types/pieDiagramsType";

/** Add a new optional prop */
export type Size = "sm" | "md" | "xs" ;

interface Props extends PieDiagramProps {
  /** `md` by default; pass `"sm"` to shrink it (fits nicely beside the graph) */
  size?: Size;
  /** optional card gradient override e.g. "from-fuchsia-500/20 to-purple-500/10" */
  gradient?: string;
}

const sizes: Record<Size, { inner: number; outer: number; h: string }> = {
  sm: { inner: 15, outer: 30, h: "h-20" },
  md: { inner: 20, outer: 35 , h: "h-28" },
  xs: { inner: 7, outer: 15 , h: "h-10" },
};

const defaultGradient =
  "from-violet-500/10 via-indigo-400/10 to-purple-500/10";

const PieDiagram: React.FC<Props> = ({
  title,
  className = "",
  statusData = [],
  innerRadius,
  outerRadius,
  showLegend = true,
  showIcon = true,
  size = "sm",
  gradient = defaultGradient,
}) => {
  const cfg = sizes[size];

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className={className}
    >
      <div
        className={`rounded-2xl border border-slate-200 p-4 xl:h-48 sm:h-64 shadow-lg backdrop-blur-lg dark:border-slate-700 dark:bg-slate-800/80 bg-gradient-to-br ${gradient}`}
      >
        {title && (
          <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-purple-600 dark:text-purple-400 truncate">
            {showIcon && <PieIcon className="h-5 w-5" />} {title}
          </h3>
        )}

        <div className="grid grid-cols-1 sm:grid-rows-2 xl:grid-cols-2 gap-0 items-start h-fit truncate">
          {/* chart */}
          <div className={`${cfg.h} w-full`}>
            <ResponsiveContainer width="100%" height="100%" >
              <RechartsPieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={innerRadius ?? cfg.inner}
                  outerRadius={outerRadius ?? cfg.outer}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                  
                >
                  {statusData.map((d, idx) => (
                    <Cell key={`cell-${idx}`} fill={d.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} cursor={{ fill: "transparent" }} />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>

          {/* legend */}
          {showLegend && (
            <div className="flex flex-col justify-center items-start flex-wrap gap-y-2 text-sm">
              {statusData.map((d, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs xl:text-sm 2xl:text-base">
                  <span
                    className="inline-block h-3 w-3 rounded-full ring-2 ring-white dark:ring-slate-800"
                    style={{ backgroundColor: d.color }}
                  />
                  <span className=" text-slate-700 dark:text-slate-300">
                    {d.name}
                  </span>
                  <span className="ml-auto  text-slate-900 dark:text-slate-100">
                    {d.value}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default PieDiagram;
