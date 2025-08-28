"use client";

import * as React from "react";
import { ThemeProvider } from "next-themes";
import { AppProvider } from "@/providers/app-provider";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient();

export function Provider({
  children,
  ...props
}: React.ComponentProps<typeof ThemeProvider>) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      {...props}
    >
      <QueryClientProvider client={queryClient}>
        <AppProvider>
          {children}
          <ReactQueryDevtools
            initialIsOpen={false}
            buttonPosition="bottom-right"
          />
        </AppProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
