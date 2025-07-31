import { TooltipProps } from "recharts";

/* typed tooltip for Recharts */
const CustomTooltip: React.FC<TooltipProps<number, string>> = ({
  active,
  payload,
  label,
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white/95 p-3 shadow-lg backdrop-blur-sm dark:border-slate-700 dark:bg-slate-800/95">
        {label && (
          <p className="font-medium text-slate-700 dark:text-slate-300">
            {label}
          </p>
        )}
        {payload.map((entry, idx) => (
          <p
            key={idx}
            className="text-sm"
            style={{ color: (entry.color as string) ?? entry.fill }}
          >
            {entry.name}: {entry.value?.toLocaleString()}
          </p>
        ))}
      </div>
    );
  }
  return null;
};


export default CustomTooltip