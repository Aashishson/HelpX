import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { setToken, getUserRole } from "../utils/auth";

export const AuthSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (!token) {
      navigate("/login");
      return;
    }

    setToken(token);
    const role = getUserRole();
    navigate(role === "Admin" ? "/admin-dashboard" : "/user-dashboard");
  }, [navigate]);

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
};
