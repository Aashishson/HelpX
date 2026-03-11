import "./Slider.css";
import { useNavigate } from "react-router-dom";

function Slider({ active, setActive }) {
  const navigate = useNavigate();

  const handleLogin = () => {
    setActive("login");
    navigate("/login");
  };

  const handleSignup = () => {
    setActive("signup");
    navigate("/signup");
  };

  return (
    <div className="container">
      <div className="slider-wrapper">
        <div
          className={`slider-indicator ${active === "signup" ? "right" : ""}`}
        ></div>

        <div
          className={`slider-btn ${active === "login" ? "active" : ""}`}
          onClick={handleLogin}
        >
          Login
        </div>

        <div
          className={`slider-btn ${active === "signup" ? "active" : ""}`}
          onClick={handleSignup}
        >
          Sign Up
        </div>
      </div>
    </div>
  );
}

export default Slider;
