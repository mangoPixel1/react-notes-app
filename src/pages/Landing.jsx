import React from "react";
import { Link } from "react-router";

function Landing() {
  return (
    <div className="flex flex-col justify-center items-center w-4xl">
      <header className="w-full flex justify-between items-center">
        <h3 className="text-3xl font-normal">📒 Notepad</h3>
        <nav className="flex gap-5 text-sm">
          <p className="cursor-pointer">Features</p>
          <p className="cursor-pointer">Pricing</p>
          <p className="cursor-pointer">About</p>
          <p className="cursor-pointer">Contact</p>
        </nav>
      </header>
      <div className="py-20 flex flex-col gap-5 justify-center items-center text-center w-lg">
        <h1 className="text-5xl font-extrabold">Capture What's On Your Mind</h1>
        <p className="text-xl">
          All your thoughts synced seamlessly across every device right from
          your favorite browser.
        </p>
        <button className="px-5 py-2 rounded-sm bg-amber-500 hover:bg-amber-600 transition duration-300 text-white cursor-pointer">
          Sign up now
        </button>
      </div>

      <Link to="/dashboard">
        <button className="cursor-pointer">Dashboard</button>
      </Link>
    </div>
  );
}

export default Landing;
