import { Routes, Route, Navigate } from "react-router-dom";
import Signup from "../pages/SignUp.jsx";
import Login from "../pages/login.jsx";
import Dashboard from "../pages/dashboard/index.jsx"

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
      <Route
        path="/user-dashboard"
        element= {<Dashboard/>}
        
      
      
      />

      
    </Routes>
  );
};

export default AppRoutes;
