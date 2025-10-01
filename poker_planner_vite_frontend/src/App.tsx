import React from "react";

import { ThemeProvider } from "@/components/theme-provider";
import { ConvexProvider, ConvexReactClient } from "convex/react";

import Navbar from "@/components/molecules/navbar/navbar";
import Footer from "@/components/molecules/footer/footer";

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL);

function App({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <ConvexProvider client={convex}>
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </ConvexProvider>
    </ThemeProvider>
  );
}

export default App;
