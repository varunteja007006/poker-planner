"use client";

import * as React from "react";
import { ThemeProvider } from "next-themes";
import { AppProvider } from "@/providers/app-provider";

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
      <AppProvider>{children}</AppProvider>
    </ThemeProvider>
  );
}
