import { useContext, useState } from "react";
import { Link } from "react-router";
import { ArrowLeft } from "lucide-react";

import { AuthContext } from "../contexts/AuthContext";
import Logo from "../icons/Logo";

function ForgotPassword() {
  const { resetPasswordForEmail } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email) {
      setError("Email is required.");
      return;
    }
    setIsSubmitting(true);
    setError("");
    try {
      await resetPasswordForEmail(email);
      setSuccess(true);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (success) {
    return (
      <div className="min-h-screen w-full flex justify-center items-center translate-y-[-40px]">
        <div className="w-full max-w-72 space-y-4 text-center">
          <Logo className="w-24 h-24 text-amber-500 mx-auto" />
          <h2 className="text-2xl font-bold">Check your email</h2>
          <p className="text-sm text-gray-500">
            We sent a password reset link to <strong>{email}</strong>. Click it to set a new password.
          </p>
          <Link to="/login" className="text-sm text-amber-700">
            Back to Log in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full">
      <Link
        to="/login"
        className="absolute top-6 left-4 z-10 flex items-center gap-1.5 text-base text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Log in
      </Link>

      <div className="min-h-screen w-full flex justify-center items-center translate-y-[-40px]">
        <div className="w-full max-w-72 space-y-7">
          <div className="flex flex-col items-center gap-4">
            <Logo className="w-24 h-24 text-amber-500" />
            <h1 className="text-4xl font-bold tracking-tight">Reset password</h1>
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

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button
              type="submit"
              disabled={isSubmitting}
              className="text-white bg-amber-500 hover:bg-amber-700 transition duration-300 cursor-pointer py-1 rounded-sm w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Sending…" : "Send reset link"}
            </button>
          </form>

          <div className="flex flex-col items-center text-sm">
            <p>
              Remembered your password?{" "}
              <Link to="/login">
                <span className="text-amber-700 cursor-pointer">Log in</span>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
