import { Navigate, useLocation } from "react-router-dom";
import { getStoredUser } from "../api/axios";

const ProtectedRoute = ({ children, allowedRoles }) => {

  const location = useLocation();
  const user = getStoredUser();

  if (!user?.token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (allowedRoles?.length && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;

};

export default ProtectedRoute;
