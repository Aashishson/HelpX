import { Routes, Route, Navigate } from "react-router-dom";
import Signup from "../pages/SignUp.jsx";
import Login from "../pages/login.jsx";
import ForgetPassword from "../pages/ForgetPassword.jsx";
import Dashboard from "../pages/dashboard/dashboard.jsx";
import PageNotFound from "../pages/PageNotFound.jsx";
import { AuthSuccess } from "../pages/AuthSuccess.jsx";
import SubmitComplaint from "../pages/dashboard/SubmitComplaint.jsx"
import FAQ from "../pages/dashboard/FAQ.jsx"
import Profile from "../pages/dashboard/Profile.jsx"
import MyComplaint from "../pages/dashboard/MyComplaint.jsx"
import EditComplaint from "../pages/dashboard/EditComplaint.jsx";
import ComplaintDetail from "../pages/dashboard/complaintDetail.jsx";
import AdminDashboard from "../pages/dashboard/AdminDashboard.jsx";
import EditStatus from "../pages/dashboard/EditStatus.jsx";

const AppRoutes = ({ active, setActive }) => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/signup" />} />

      <Route
        path="/signup"
        element={<Signup active={active} setActive={setActive} />}
      />

      <Route
        path="/login"
        element={<Login active={active} setActive={setActive} />}
      />
      <Route path="/user-dashboard" element={<Dashboard />} />
      <Route path="/admin-dashboard" element={<AdminDashboard />} />
      <Route path="/edit-status/:id" element={<EditStatus />} />
      <Route path="/auth-success" element={<AuthSuccess />} />
      <Route path="/forgot-password" element={<ForgetPassword />} />
      <Route path="/complaint" element={<SubmitComplaint />} />
      <Route path="/FAQ" element={<FAQ />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/MyComplaint" element={<MyComplaint />} />
      <Route path="/edit-complaint/:id" element={<EditComplaint />} />
      <Route path="/complaint-details/:id" element={<ComplaintDetail />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

export default AppRoutes;
