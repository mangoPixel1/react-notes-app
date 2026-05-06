import { useContext } from "react";
import { Navigate, Outlet } from "react-router";
import { AuthContext } from "../contexts/AuthContext";

function ProtectedRoute() {
  const { session, isLoading } = useContext(AuthContext);

  if (isLoading) return null;
  if (!session) return <Navigate to="/login" replace />;

  return <Outlet />;
}

export default ProtectedRoute;
