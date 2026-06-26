// components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { isAuthenticated, getUserRole } from "../../utils/auth";

/**
 * Wrap any route element with this to guard it.
 *
 * Usage:
 *   <Route
 *     path="/admin-dashboard"
 *     element={
 *       <ProtectedRoute allowedRoles={["admin"]}>
 *         <AdminDashboard />
 *       </ProtectedRoute>
 *     }
 *   />
 *
 * Pass no `allowedRoles` if you just want "must be logged in" with no role check.
 */
function ProtectedRoute({ children, allowedRoles }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  const role = getUserRole();

  if (allowedRoles && !allowedRoles.includes(role)) {
    // Logged in, but wrong role for this page — send them to their own
    // dashboard instead of bouncing back to login.
    const fallback = role === "admin" ? "/admin-dashboard" : "/user-dashboard";
    return <Navigate to={fallback} replace />;
  }

  return children;
}

export default ProtectedRoute;
