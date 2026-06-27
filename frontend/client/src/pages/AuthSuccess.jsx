import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { setToken } from "../utils/auth";

export const AuthSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuth = async () => {
      const params = new URLSearchParams(window.location.search);
      const accessToken = params.get("token");

      if (!accessToken) {
        navigate("/login");
        return;
      }

      // Store token via auth util (same key as local login)
      setToken(accessToken);

      try {
        const response = await axios.get("/api/authGoogle/me", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (response.data.success) {
          // Use role from the API response to navigate correctly
          const role = response.data.user?.role;
          if (role === "Admin") {
            navigate("/admin-dashboard");
          } else {
            navigate("/user-dashboard");
          }
        } else {
          navigate("/login");
        }
      } catch (error) {
        console.error("Error fetching user...", error);
        navigate("/login");
      }
    };

    handleAuth();
  }, [navigate]);

  return <div>Logging you in...</div>;
};
