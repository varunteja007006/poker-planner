"use client";

import * as React from "react";
import { ThemeProvider } from "next-themes";

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
      {children}
    </ThemeProvider>
  );
}
