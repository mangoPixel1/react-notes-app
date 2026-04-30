import { useState } from "react";
import { Link, useNavigate } from "react-router";

import Logo from "../icons/Logo";

function Signup() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email || !password || !confirmPassword) {
      setError("All fields are required.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setIsSubmitting(true);
    setError("");
    try {
      // await supabase.auth.signUp({ email, password });
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Sign up failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen w-full flex justify-center items-center translate-y-[-40px]">
      <div className="w-full max-w-72 space-y-7">
        <div className="flex flex-col items-center gap-4">
          <Logo className="w-24 h-24 text-amber-500" />
          <h1 className="text-4xl font-bold tracking-tight">Sign up</h1>
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
          <input
            className="px-3 py-2 border border-gray-400 rounded-sm"
            id="confirm-password"
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="text-white bg-amber-500 hover:bg-amber-700 transition duration-300 cursor-pointer py-1 rounded-sm w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Creating account…" : "Sign up"}
          </button>

          <div className="flex justify-center gap-2">
            <p className="text-sm text-center select-none">
              By creating an account you agree to our{" "}
              <span className="text-amber-700 cursor-pointer">Terms of Service</span>
            </p>
          </div>
        </form>

        <div className="flex flex-col items-center text-sm">
          <p>
            Already have an account?{" "}
            <Link to="/login">
              <span className="text-amber-700 cursor-pointer">Log in</span>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
