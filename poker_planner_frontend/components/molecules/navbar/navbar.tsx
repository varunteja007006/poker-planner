import React from "react";

import { ThemeToggleBtn } from "@/components/molecules/theme-toggle-btn";
import NavUserCard from "./nav-user-card";
import ResetBtn from "./reset-btn";

export default function Navbar() {
  return (
    <nav className="flex w-full items-center justify-between p-4">
      <div className="flex items-center gap-2">
        <div className="bg-primary size-8 rounded-full"></div>
        <h1 className="text-primary text-xl font-bold">Poker Planner</h1>
      </div>
      <div className="flex items-center gap-2">
        <NavUserCard />
        <ThemeToggleBtn />
        <ResetBtn />
      </div>
    </nav>
  );
}
