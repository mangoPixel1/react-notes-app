import React from "react";

function Login() {
  return (
    <div className="min-h-screen w-full flex justify-center items-center translate-y-[-40px]">
      <div className="w-full max-w-72 space-y-7">
        <div className="flex flex-col items-center gap-4">
          <div className="w-24 h-24 bg-gray-200"></div>
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

          <button className="text-white bg-amber-500 hover:bg-amber-700 transition duration-300 cursor-pointer py-1 rounded-sm w-full">
            Log in
          </button>
          <div className="flex justify-center gap-2">
            <input type="checkbox" />
            <p className="text-sm">Remember Me</p>
          </div>
        </form>

        <div className="flex flex-col items-center text-sm">
          <p className="text-amber-700 cursor-pointer">Forgot your password?</p>
          <p>
            Don't have an account?{" "}
            <span className="text-amber-700 cursor-pointer">Sign up</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
