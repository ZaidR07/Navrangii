import { KPICardProps } from "@/lib/types/reactComponentsProps";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { motion } from "framer-motion";

export default function KPICard({
  title,
  value,
  subtitle,
  icon,
  color,
}: KPICardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="group"
    >
      <Card
        className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${color} p-4 shadow-lg border-0`}
      >
        {/* soft glow */}
        <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-white/20 blur-3xl transition-opacity duration-500 group-hover:opacity-70" />

        <CardHeader className="flex items-start justify-between space-y-0 p-0">
          <CardTitle className="text-sm font-semibold text-white/90">
            {title}
          </CardTitle>
          <div className="flex h-10 w-10 items-center justify-center rounded-full  backdrop-blur-sm text-white">
            {icon}
          </div>
        </CardHeader>

        <CardContent className="p-0 pt-4 text-white">
          <div className="text-3xl font-extrabold leading-none">
            {value}
          </div>
          <p className="mt-1 text-xs text-white/70">{subtitle}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
