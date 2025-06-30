import React from "react";
import { ThemeToggleBtn } from "@/components/molecules/theme-toggle-btn";
import Image from "next/image";

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center w-full p-4">
      <div className="flex items-center gap-2">
        <div className="size-8 bg-white rounded-full">
        </div>
        <h1 className="text-xl font-bold">Poker Planner</h1>
      </div>
      <ThemeToggleBtn />
    </nav>
  );
}
