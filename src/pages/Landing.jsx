import { useState } from "react";
import { Link } from "react-router";

// Icons
import Logo from "../icons/Logo";
import HeroPreview from "../components/HeroPreview";
import ThemeToggle from "../components/ThemeToggle";
import {
  NotebookPen,
  Palette,
  FolderOpen,
  Archive,
  Search,
  CloudCheck,
  Check,
} from "lucide-react";

const featuresList = [
  {
    id: 1,
    title: "Quick Notes",
    description:
      "Give every note a title, a body, and a color. Save or cancel — nothing is auto-saved as you type.",
    icon: NotebookPen,
  },
  {
    id: 2,
    title: "Colors & Pinning",
    description:
      "Group notes visually with color, and pin the ones that matter most to keep them at the top.",
    icon: Palette,
  },
  {
    id: 3,
    title: "Folders",
    description:
      "Keep related notes together. Remove a folder and its notes stay put — they just become unfiled.",
    icon: FolderOpen,
  },
  {
    id: 4,
    title: "Archive & Trash",
    description:
      "Set notes aside or send them to trash without losing them. Restore anytime, or delete for good.",
    icon: Archive,
  },
  {
    id: 5,
    title: "Fast Search",
    description: "Find any note instantly by title or body as you type.",
    icon: Search,
  },
  {
    id: 6,
    title: "Synced To Your Account",
    description:
      "Your notes and folders are saved to your account, the same whether you sign in from your laptop or phone.",
    icon: CloudCheck,
  },
];

const pricingFeatures = [
  "Unlimited notes and folders",
  "Color, pin, archive, and trash",
  "Fast search",
  "Light and dark mode",
];

function Landing() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="flex flex-col items-center max-w-5xl w-full mx-auto p-5">
      <header className="relative w-full flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Logo className="w-14 h-14 text-amber-500" />
          <h3 className="text-2xl sm:text-2xl font-normal">Noto</h3>
        </div>

        <div className="flex items-center gap-3 md:hidden">
          <ThemeToggle />
          <button
            className="cursor-pointer"
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
        </div>
        {isMenuOpen && (
          <nav className="absolute right-0 top-full bg-white p-5 rounded-md drop-shadow-lg/25 text-sm md:hidden">
            <div className="text-base space-y-4">
              <a
                href="#features"
                className="block cursor-pointer"
                onClick={() => setIsMenuOpen(false)}
              >
                Features
              </a>
              <a
                href="#pricing"
                className="block cursor-pointer"
                onClick={() => setIsMenuOpen(false)}
              >
                Pricing
              </a>
              <a
                href="#about"
                className="block cursor-pointer"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </a>
              <a
                href="#contact"
                className="block cursor-pointer"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </a>
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
            <a href="#features" className="cursor-pointer">
              Features
            </a>
            <a href="#pricing" className="cursor-pointer">
              Pricing
            </a>
            <a href="#about" className="cursor-pointer">
              About
            </a>
            <a href="#contact" className="cursor-pointer">
              Contact
            </a>
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

          <ThemeToggle />
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
      <div className="w-full max-w-2xl rounded-3xl p-6 sm:p-10 backdrop-blur-sm bg-white/70 dark:bg-zinc-800/60">
        <HeroPreview className="w-full h-auto" />
      </div>
      <section id="features" className="py-20 w-full scroll-mt-10">
        <h1 className="text-center text-4xl font-bold">
          Powerful at its core, effortless on the surface
        </h1>
        <div className="flex flex-col sm:grid sm:grid-cols-2 md:grid-cols-3 gap-6 mt-10">
          {featuresList.map((feature) => (
            <div
              key={feature.id}
              className="p-6 rounded-2xl shadow-md backdrop-blur-sm border border-black/5 dark:border-white/10 bg-white/70 dark:bg-zinc-800/60"
            >
              <feature.icon className="w-8 h-8 text-amber-500" />
              <h2 className="mt-4 text-xl font-semibold">{feature.title}</h2>
              <p className="mt-2 text-zinc-600 dark:text-zinc-400">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section id="pricing" className="py-20 w-full scroll-mt-10">
        <h1 className="text-center text-4xl font-bold">Free to use</h1>
        <p className="mt-4 text-center text-lg text-zinc-600 dark:text-zinc-400">
          Create an account and start taking notes. No paid plans, no usage
          limits.
        </p>
        <div className="max-w-sm mx-auto mt-10 p-8 rounded-2xl shadow-md backdrop-blur-sm border border-black/5 dark:border-white/10 bg-white/70 dark:bg-zinc-800/60">
          <h2 className="text-2xl font-semibold">Free</h2>
          <p className="text-4xl font-extrabold mt-2">$0</p>
          <ul className="mt-6 space-y-3">
            {pricingFeatures.map((item) => (
              <li key={item} className="flex items-center gap-2">
                <Check className="w-4 h-4 text-amber-500 shrink-0" />
                <span className="text-zinc-600 dark:text-zinc-400">{item}</span>
              </li>
            ))}
          </ul>
          <Link to="/signup">
            <button className="w-full mt-8 px-5 py-2 rounded-sm bg-amber-500 hover:bg-amber-600 transition duration-300 text-white cursor-pointer">
              Sign up now
            </button>
          </Link>
        </div>
      </section>

      <section
        id="about"
        className="py-20 w-full max-w-2xl mx-auto text-center scroll-mt-10"
      >
        <h1 className="text-4xl font-bold">Why Noto</h1>
        <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
          Noto is built to be a fast, distraction-free place to jot things down
          — a quick thought, a list, a reminder — and find it again later. No
          formatting to fuss over, no extra steps between having an idea and
          writing it down.
        </p>
        <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
          It's a single-user app: your notes are yours, with no sharing or
          visibility into anyone else's notes.
        </p>
      </section>

      <section
        id="contact"
        className="py-20 w-full max-w-2xl mx-auto text-center scroll-mt-10"
      >
        <h1 className="text-4xl font-bold">Get in touch</h1>
        <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
          Questions or feedback? Reach out at{" "}
          <a
            href="mailto:hello@noto.app"
            className="text-amber-500 hover:text-amber-600 underline"
          >
            hello@noto.app
          </a>
          .
        </p>
      </section>

      <footer className="w-full mt-10 text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
        <div className="max-w-3xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="flex items-center gap-1 tracking-tight">
            <Logo className="w-6 h-6 text-amber-500" />
            <span className="font-semibold text-zinc-700 dark:text-zinc-100">
              Noto
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
              © {new Date().getFullYear()} Noto
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Landing;
