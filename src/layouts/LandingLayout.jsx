import { Outlet } from "react-router";

export default function LandingLayout() {
  return (
    <div className="w-full max-w-3xl mx-auto">
      <Outlet />
    </div>
  );
}
