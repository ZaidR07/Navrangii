"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { PropsWithChildren, useState } from "react";

export default function QueryProvider({ children }: PropsWithChildren) {
  // Create one client per browser tab; memoise via state, not useMemo
  const [client] = useState(() => new QueryClient({
    defaultOptions: {
      mutations: { retry: false },          // sensible default for auth
      queries:   { refetchOnWindowFocus: false },
    },
  }));

  return (
    <QueryClientProvider client={client}>
      {children}
      {process.env.NODE_ENV === "development" && <ReactQueryDevtools />}
    </QueryClientProvider>
  );
}