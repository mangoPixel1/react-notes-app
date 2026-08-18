import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { ArrowLeft } from "lucide-react";

import { AuthContext } from "../contexts/AuthContext";
import Logo from "../icons/Logo";
import PasswordInput from "../components/PasswordInput";

function ResetPassword() {
  const { session, isLoading, updatePassword } = useContext(AuthContext);
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoading && !session) {
      navigate("/forgot-password", { replace: true });
    }
  }, [isLoading, session, navigate]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!password || !confirmPassword) {
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
      await updatePassword(password);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading || !session) return null;

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
            <h1 className="text-4xl font-bold tracking-tight">Set new password</h1>
          </div>

          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <PasswordInput
              className="px-3 py-2 border border-gray-400 rounded-sm"
              id="password"
              placeholder="New password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <PasswordInput
              className="px-3 py-2 border border-gray-400 rounded-sm"
              id="confirm-password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button
              type="submit"
              disabled={isSubmitting}
              className="text-white bg-amber-500 hover:bg-amber-700 transition duration-300 cursor-pointer py-1 rounded-sm w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Updating…" : "Update password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
