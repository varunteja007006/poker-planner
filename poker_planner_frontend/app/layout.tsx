import type { Metadata } from "next";

import "./globals.css";

import { Provider } from "./provider";

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
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
