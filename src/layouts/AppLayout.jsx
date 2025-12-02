import Header from "../components/Header";
import { Outlet } from "react-router";

export default function AppLayout() {
  return (
    <div className="w-full max-w-3xl mx-auto">
      <Header />
      <Outlet />
    </div>
  );
}
