import { Copyright, Mail, MapPinHouse, Phone } from "lucide-react";
import React from "react";

export default function Footer() {
  return (
    <footer className="border-primary text-primary bg-background dark:bg-background flex w-full flex-col items-start justify-between gap-5 border-t-2 px-10 py-12 md:flex-row">
      <ul>
        <li className="flex flex-row items-center gap-2">
          <Mail className="size-4" /> {`Email: support@pokerplanner.com`}
        </li>
        <li className="flex flex-row items-center gap-2">
          <Phone className="size-4" /> {`Phone: +91 1234567890`}
        </li>
        <li className="flex flex-row items-center gap-2">
          <MapPinHouse className="size-4" />{" "}
          {`Address: 123 Main St, Anytown, USA`}
        </li>
        <br />
        <br />
        <li className="flex flex-row items-center gap-1">
          <Copyright className="size-4" />{" "}
          {`2025 Poker Planner. All rights reserved.`}
        </li>
      </ul>
      <div>
        <h6 className="font-bold">Follow us on:</h6>
        <ul>
          <li>{`> Instagram`}</li>
          <li>{`> Facebook`}</li>
          <li>{`> LinkedIn`}</li>
        </ul>
      </div>
      <div>
        <ul>
          <li>{`> Privacy Policy`}</li>
          <li>{`> Terms of Use`}</li>
          <li>{`> Cookie Policy`}</li>
          <li>{`> Accessibility`}</li>
        </ul>
      </div>
    </footer>
  );
}
