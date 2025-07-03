"use client";

import * as React from "react";
import { ThemeProvider } from "next-themes";
import { AppProvider } from "@/providers/app-provider";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

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
        <AppProvider>{children}</AppProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
