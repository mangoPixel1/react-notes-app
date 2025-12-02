import React from "react";
import { Link } from "react-router";

function Landing() {
  return (
    <div>
      <header>
        <h3>Notepad</h3>
      </header>
      <h1>Capture What's On Your Mind</h1>
      <p>
        Add notes, lists, and reminders. All your thoughts synced seamlessly
        across every device.
      </p>

      <Link to="/dashboard">
        <button className="cursor-pointer">Dashboard</button>
      </Link>
    </div>
  );
}

export default Landing;
