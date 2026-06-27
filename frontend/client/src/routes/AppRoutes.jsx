import { Routes, Route, Navigate } from "react-router-dom";
import Signup from "../pages/SignUp.jsx";
import Login from "../pages/login.jsx";
import ForgetPassword from "../pages/ForgetPassword.jsx";
import Dashboard from "../pages/dashboard/dashboard.jsx";
import PageNotFound from "../pages/PageNotFound.jsx";
import { AuthSuccess } from "../pages/AuthSuccess.jsx";
import SubmitComplaint from "../pages/dashboard/SubmitComplaint.jsx";
import FAQ from "../pages/dashboard/FAQ.jsx";
import Profile from "../pages/dashboard/Profile.jsx";
import MyComplaint from "../pages/dashboard/MyComplaint.jsx";
import EditComplaint from "../pages/dashboard/EditComplaint.jsx";
import ComplaintDetail from "../pages/dashboard/complaintDetail.jsx";
import AdminDashboard from "../pages/dashboard/AdminDashboard.jsx";
import EditStatus from "../pages/dashboard/EditStatus.jsx";
import ProtectedRoute from "../pages/components/ProtectedRoute.jsx";

const AppRoutes = ({ active, setActive }) => {
  return (
    <Routes>
      {/* ── Public routes ───────────────────────────────────────── */}
      <Route path="/" element={<Navigate to="/signup" />} />
      <Route
        path="/signup"
        element={<Signup active={active} setActive={setActive} />}
      />
      <Route
        path="/login"
        element={<Login active={active} setActive={setActive} />}
      />
      <Route path="/forgot-password" element={<ForgetPassword />} />
      <Route path="/auth-success" element={<AuthSuccess />} />

      {/* ── Admin-only routes ────────────────────────────────────── */}
      <Route
        path="/admin-dashboard"
        element={
          <ProtectedRoute allowedRoles={["Admin", "admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/edit-status/:id"
        element={
          <ProtectedRoute allowedRoles={["Admin", "admin"]}>
            <EditStatus />
          </ProtectedRoute>
        }
      />
      {/* Legacy path kept in case any old link uses /edit-status/:id */}
      <Route
        path="/edit-status/:id"
        element={
          <ProtectedRoute allowedRoles={["Admin", "admin"]}>
            <EditStatus />
          </ProtectedRoute>
        }
      />

      {/* ── Authenticated user routes (any logged-in role) ───────── */}
      <Route
        path="/user-dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/complaint"
        element={
          <ProtectedRoute>
            <SubmitComplaint />
          </ProtectedRoute>
        }
      />
      <Route
        path="/FAQ"
        element={
          <ProtectedRoute>
            <FAQ />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/MyComplaint"
        element={
          <ProtectedRoute>
            <MyComplaint />
          </ProtectedRoute>
        }
      />
      <Route
        path="/edit-complaint/:id"
        element={
          <ProtectedRoute>
            <EditComplaint />
          </ProtectedRoute>
        }
      />
      <Route
        path="/complaint-details/:id"
        element={
          <ProtectedRoute>
            <ComplaintDetail />
          </ProtectedRoute>
        }
      />

      {/* ── 404 ─────────────────────────────────────────────────── */}
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

export default AppRoutes;
