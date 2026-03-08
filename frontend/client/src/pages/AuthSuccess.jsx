import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const AuthSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuth = async () => {
      const params = new URLSearchParams(window.location.search);

      const accessToken = params.get("token");
      console.log("AccessToken:", accessToken);

      if (accessToken) {
        localStorage.setItem("accessToken", accessToken);

        try {
          const response = await axios.get("/api/authGoogle/me", {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });

          if (response.data.success) {
            navigate("/user-dashboard");
          } else {
            navigate("/login");
          }
        } catch (error) {
          console.error("Error fetching user...", error);
          navigate("/login");
        }
      } else {
        navigate("/login");
      }
    };

    handleAuth();
  }, [navigate]);

  return <div>Logging you in...</div>;
};
