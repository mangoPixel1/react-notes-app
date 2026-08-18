import { Outlet } from "react-router";
import ThemeToggle from "../components/ThemeToggle";

export default function LandingLayout() {
  return (
    <div>
      <ThemeToggle className="fixed top-6 right-4 z-20" />
      <Outlet />
    </div>
  );
}
