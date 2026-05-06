import { useContext, useState } from "react";
import { Link } from "react-router";

import { AuthContext } from "../contexts/AuthContext";
import Logo from "../icons/Logo";

function Login() {
  const { signIn } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email || !password) {
      setError("All fields are required.");
      return;
    }
    setIsSubmitting(true);
    setError("");
    try {
      await signIn(email, password);
      // Navigation is handled automatically by the route guard reacting to the session change
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen w-full flex justify-center items-center translate-y-[-40px]">
      <div className="w-full max-w-72 space-y-7">
        <div className="flex flex-col items-center gap-4">
          <Logo className="w-24 h-24 text-amber-500" />
          <h1 className="text-4xl font-bold tracking-tight">Log in</h1>
        </div>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <input
            className="px-3 py-2 border border-gray-400 rounded-sm"
            id="email"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="px-3 py-2 border border-gray-400 rounded-sm"
            id="password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="text-white bg-amber-500 hover:bg-amber-700 transition duration-300 cursor-pointer py-1 rounded-sm w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Logging in…" : "Log in"}
          </button>

          <div className="flex justify-center gap-2">
            <input type="checkbox" id="remember-me" />
            <label htmlFor="remember-me" className="text-sm select-none">
              Remember Me
            </label>
          </div>
        </form>

        <div className="flex flex-col items-center text-sm">
          <p className="text-amber-700 cursor-pointer">Forgot your password?</p>
          <p>
            Don&apos;t have an account?{" "}
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
