import React from "react";

export default function Footer() {
  return (
    <footer className="border-t-2 border-primary text-primary w-full flex flex-col items-start md:flex-row gap-5 justify-between bg-background p-5 dark:bg-background p-5">
      <div>
        <p>{`> Email: support@pokerplanner.com`}</p>
        <p>{`> Phone: +91 1234567890`}</p>
        <p>{`> Address: 123 Main St, Anytown, USA`}</p>
        <br />
        <br />
        <p>@2025 Poker Planner. All rights reserved.</p>
      </div>
      <div>
        <h6 className="font-bold">Follow us on:</h6>
        <ul>
          <li>{`> Twitter`}</li>
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
