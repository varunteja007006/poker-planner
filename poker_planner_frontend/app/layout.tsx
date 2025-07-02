import type { Metadata } from "next";

import "./globals.css";

import { Provider } from "./provider";

import Footer from "@/components/molecules/footer/footer";
import Navbar from "@/components/molecules/navbar/navbar";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "Poker Planner",
  description: "Poker Planner built using Next JS and Nest JS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`font-mono antialiased`}>
        <Provider>
          <div className="min-h-screen font-[family-name:var(--font-geist-sans)]">
            <Navbar />
            <main className="min-h-screen">{children}</main>
            <Footer />
          </div>
        </Provider>
        <Toaster />
      </body>
    </html>
  );
}
