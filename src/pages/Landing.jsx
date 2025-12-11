import { useState } from "react";
import { Link } from "react-router";
import Logo from "../Icons";

const featuresList = [
  {
    id: 1,
    title: "Accessible Anywhere",
    description:
      "Your notes update instantly across all your devices with automatic real-time sync.",
    icon: "",
  },
  {
    id: 2,
    title: "Stay Organized",
    description:
      "Use tags to sort, filter, and quickly locate notes with fast, intuitive search.",
    icon: "",
  },
  {
    id: 3,
    title: "Effortless Collaboration",
    description:
      "Share lists, send instructions, or publish notes publicly in just a few clicks.",
    icon: "",
  },
  {
    id: 4,
    title: "Version History",
    description:
      "Every edit is saved, allowing you to review and restore previous versions at any time.",
    icon: "",
  },
  {
    id: 5,
    title: "Markdown Support",
    description:
      "Write in Markdown and instantly preview your formatted notes as you type.",
    icon: "",
  },
  {
    id: 6,
    title: "Completely Free",
    description:
      "Sync, backups, sharing, and apps are all included at no cost.",
    icon: "",
  },
];

function Landing() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="flex flex-col justify-center items-center max-w-5xl w-full">
      <header className="relative w-full flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Logo className="w-14 h-14 text-amber-500" />
          <h3 className="text-2xl sm:text-2xl font-normal">Notepad</h3>
        </div>

        <button
          className="cursor-pointer md:hidden"
          onClick={() => setIsMenuOpen((prev) => !prev)}
        >
          <svg
            className="w-6 h-6 stroke-zinc-700 dark:stroke-zinc-200"
            fill="none"
            strokeWidth="2"
            strokeLinecap="round"
          >
            {isMenuOpen ? (
              // X icon
              <path d="M4 4 L20 20 M20 4 L4 20" />
            ) : (
              // Hamburger
              <>
                <path d="M3 6h18" />
                <path d="M3 12h18" />
                <path d="M3 18h18" />
              </>
            )}
          </svg>
        </button>
        {isMenuOpen && (
          <nav className="absolute right-0 top-full bg-white p-5 rounded-md drop-shadow-lg/25 text-sm md:hidden">
            <div className="text-base space-y-4">
              <p className="cursor-pointer">Features</p>
              <p className="cursor-pointer">Pricing</p>
              <p className="cursor-pointer">About</p>
              <p className="cursor-pointer">Contact</p>
            </div>

            <div className="flex justify-center items-center gap-4 px-5 border-t mt-5 pt-5 border-gray-300 text-base">
              <Link to="/login">
                <p className="p2-2 cursor-pointer">Log In</p>
              </Link>

              <Link to="/signup">
                <p className="p-2 rounded-sm border border-gray-400 hover:border-gray-500 cursor-pointer">
                  Sign Up
                </p>
              </Link>
            </div>
          </nav>
        )}

        <nav className="gap-5 text-sm hidden md:flex">
          <div className="flex items-center gap-4">
            <p className="cursor-pointer">Features</p>
            <p className="cursor-pointer">Pricing</p>
            <p className="cursor-pointer">About</p>
            <p className="cursor-pointer">Contact</p>
          </div>

          <div className="flex justify-center items-center gap-4 px-5 border-l border-gray-300">
            <Link to="/login">
              <p className="p2-2 cursor-pointer">Log In</p>
            </Link>
            <Link to="/signup">
              <p className="p-2 rounded-sm border border-gray-400 hover:border-gray-500 cursor-pointer">
                Sign Up
              </p>
            </Link>
          </div>
        </nav>
      </header>
      <div className="py-24 flex flex-col gap-5 justify-center items-center text-center max-w-lg">
        <h1 className="text-5xl font-extrabold">Capture What's On Your Mind</h1>
        <p className="text-xl">
          All your thoughts synced seamlessly across every device right from
          your favorite browser.
        </p>
        <Link to="/signup">
          <button className="px-5 py-2 rounded-sm bg-amber-500 hover:bg-amber-600 transition duration-300 text-white cursor-pointer">
            Sign up now
          </button>
        </Link>
      </div>
      <div className="w-48 h-96 bg-gray-100"></div>
      <div className="py-20 w-full">
        <h1 className="text-center text-4xl font-bold">
          Powerful at its core, effortless on the surface
        </h1>
        <div className="flex flex-col sm:grid sm:grid-cols-2 md:grid-cols-3 gap-10 mt-10">
          {featuresList.map((feature) => (
            <div key={feature.id} className="mt-10">
              <h2 className="text-2xl font-semibold">{feature.title}</h2>
              <p className="mt-2 text-lg text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
      <footer className="w-full mt-10 text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
        <div className="max-w-3xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="flex items-center gap-1 tracking-tight">
            <Logo className="w-6 h-6 text-amber-500" />
            <span className="font-semibold text-zinc-700 dark:text-zinc-100">
              Notepad
            </span>{" "}
            · Capture ideas, lists, and thoughts in one place.
          </p>

          <div className="flex items-center gap-4">
            <button className="hover:text-zinc-700 dark:hover:text-zinc-200 transition cursor-pointer">
              Privacy
            </button>
            <button className="hover:text-zinc-700 dark:hover:text-zinc-200 transition cursor-pointer">
              Terms
            </button>
            <span className="hidden sm:inline-block text-zinc-400">•</span>
            <span className="text-[11px] sm:text-xs">
              © {new Date().getFullYear()} Notepad
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Landing;
