import { Copyright, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="text-primary bg-background dark:bg-background flex w-full flex-col items-start justify-between gap-5 px-10 py-12 md:flex-row">
      <div className="flex flex-row items-center justify-start gap-2">
        <Mail className="size-4" /> {`Email: varunteja007006@gmail.com`}
      </div>
      <div className="flex flex-row items-center justify-start gap-2">
        <Copyright className="size-4" />{" "}
        {`2025 Poker Planner. All rights reserved.`}
      </div>
    </footer>
  );
}
