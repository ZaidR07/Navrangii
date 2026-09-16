import { Skeleton } from "@/components/ui/skeleton";

/** Skeleton for a KPI / stat card */
export function SkeletonStatCard() {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-4 border border-gray-100 dark:border-slate-700/50">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-3 w-20" />
        </div>
        <Skeleton className="h-10 w-10 rounded-lg" />
      </div>
    </div>
  );
}

/** Grid of stat card skeletons */
export function SkeletonStatCards({ count = 3 }: { count?: number }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-6">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonStatCard key={i} />
      ))}
    </div>
  );
}

/** Skeleton for a single table row */
export function SkeletonTableRow({ columns = 6 }: { columns?: number }) {
  return (
    <tr className="border-b border-gray-100 dark:border-slate-700/50">
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className="px-6 py-4">
          {i === 0 ? (
            <div className="flex items-center gap-3">
              <Skeleton className="h-9 w-9 rounded-full" />
              <Skeleton className="h-4 w-24" />
            </div>
          ) : (
            <Skeleton className="h-4 w-full max-w-[120px]" />
          )}
        </td>
      ))}
    </tr>
  );
}

/** Skeleton for a full table */
export function SkeletonTable({ columns = 6, rows = 5 }: { columns?: number; rows?: number }) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm overflow-hidden border border-gray-100 dark:border-slate-700/50">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50 dark:bg-slate-800/50">
            <tr>
              {Array.from({ length: columns }).map((_, i) => (
                <th key={i} className="px-6 py-3">
                  <Skeleton className="h-3 w-20" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: rows }).map((_, i) => (
              <SkeletonTableRow key={i} columns={columns} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/** Skeleton for the admin page header (title + subtitle) */
export function SkeletonHeader() {
  return (
    <div className="mb-8 space-y-2">
      <Skeleton className="h-8 w-56" />
      <Skeleton className="h-4 w-72" />
    </div>
  );
}

/** Full admin page skeleton: header + stat cards + table */
export function AdminPageSkeleton({ statCards = 3, tableColumns = 6, tableRows = 5 }: {
  statCards?: number;
  tableColumns?: number;
  tableRows?: number;
}) {
  return (
    <div className="min-h-screen bg-muted/40 p-4 sm:p-6 lg:p-8">
      <SkeletonHeader />
      <SkeletonStatCards count={statCards} />
      {/* Search / filter bar */}
      <div className="mb-6 flex gap-4">
        <Skeleton className="h-10 w-full max-w-md rounded-lg" />
        <Skeleton className="h-10 w-32 rounded-lg" />
      </div>
      <SkeletonTable columns={tableColumns} rows={tableRows} />
    </div>
  );
}

/** Skeleton for the whole admin shell (sidebar + header + content) used by layout auth check */
export function AdminShellSkeleton() {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-50 dark:bg-slate-900">
      {/* Sidebar skeleton */}
      <div className="hidden lg:flex w-64 flex-col border-r border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 space-y-3">
        <div className="flex items-center gap-3 mb-6">
          <Skeleton className="h-10 w-10 rounded-lg" />
          <Skeleton className="h-5 w-28" />
        </div>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <Skeleton className="h-8 w-8 rounded-lg" />
            <Skeleton className="h-4 w-24" />
          </div>
        ))}
      </div>
      {/* Main area */}
      <div className="flex-1 flex flex-col">
        {/* Header skeleton */}
        <div className="h-16 border-b border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex items-center justify-between px-6">
          <Skeleton className="h-6 w-40" />
          <div className="flex items-center gap-3">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
        </div>
        {/* Content skeleton */}
        <div className="flex-1 p-6 overflow-hidden">
          <AdminPageSkeleton />
        </div>
      </div>
    </div>
  );
}
