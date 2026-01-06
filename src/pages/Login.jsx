import React from "react";
import { Link } from "react-router";

// Icons
import Logo from "../icons/Logo";

function Login() {
  return (
    <div className="min-h-screen w-full flex justify-center items-center translate-y-[-40px]">
      <div className="w-full max-w-72 space-y-7">
        <div className="flex flex-col items-center gap-4">
          <Logo className="w-24 h-24 text-amber-500" />
          <h1 className="text-4xl font-bold tracking-tight">Log in</h1>
        </div>

        <form className="flex flex-col gap-4">
          <input
            className="px-3 py-2 border border-gray-400 rounded-sm"
            id="email"
            type="email"
            placeholder="Email"
          />
          <input
            className="px-3 py-2 border border-gray-400 rounded-sm"
            id="password"
            type="password"
            placeholder="Password"
          />

          <Link to="/dashboard">
            <button className="text-white bg-amber-500 hover:bg-amber-700 transition duration-300 cursor-pointer py-1 rounded-sm w-full">
              Log in
            </button>
          </Link>

          <div className="flex justify-center gap-2">
            <input type="checkbox" />
            <p className="text-sm select-none">Remember Me</p>
          </div>
        </form>

        <div className="flex flex-col items-center text-sm">
          <p className="text-amber-700 cursor-pointer">Forgot your password?</p>
          <p>
            Don't have an account?{" "}
            <Link to="/signup">
              <span className="text-amber-700 cursor-pointer">Sign up</span>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
