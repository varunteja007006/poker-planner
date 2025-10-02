import LogoutBtn from "./LogoutBtn";
import { UserCard } from "@/components/features/user/UserCard";
import { ModeToggle } from "@/components/mode-toggle";
import { Kanban } from "lucide-react";
import { Link } from "react-router";

export default function Navbar() {
  return (
    <nav className="flex w-full items-center justify-between p-4">
      <Link to={"/"}>
        <div className="flex items-center gap-2">
          <Kanban className="text-primary size-8" />
          <h1 className="text-primary text-xl font-bold">Poker Planner</h1>
        </div>
      </Link>
      <div className="flex items-center gap-2">
        <UserCard />
        <ModeToggle />
        <LogoutBtn />
      </div>
    </nav>
  );
}
