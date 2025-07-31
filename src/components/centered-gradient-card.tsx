export function CenteredGradientCard({
  children,
  error = false,
}: {
  children: React.ReactNode;
  error?: boolean;
}) {
  const gradient = error
    ? "from-red-50 via-white to-orange-50 dark:from-slate-900 dark:via-slate-800 dark:to-red-900/30"
    : "from-purple-50 via-white to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900/30";

  return (
    <div
      className={`flex h-96 items-center justify-center rounded-xl
                  bg-gradient-to-br ${gradient}
                  shadow-lg border
                  ${error
          ? "border-red-100 dark:border-red-800/30"
          : "border-purple-100 dark:border-purple-800/30"}`}
    >
      <div
        className={`flex flex-col items-center space-y-4 rounded-xl
                    bg-white/80 p-8 shadow-xl backdrop-blur-md
                    ${error ? "dark:bg-red-950/50"
            : "dark:bg-slate-800/80"}`}
      >
        {children}
      </div>
    </div>
  );
}
