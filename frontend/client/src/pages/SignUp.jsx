import { useState } from "react";
import aiImage from "../assets/ai.jpeg";
import logo from "../assets/logo.png";
import { FcGoogle } from "react-icons/fc";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Slider from "./components/Slider.jsx";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Signup = ({ active, setActive }) => {
  const navigate = useNavigate();
  const notify = () => toast("Account Created Succesfully!");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");

  const handleGoogleSignup = () => {
    console.log("Signup with Google clicked");
  };

  const validatePassword = (password) => {
    const strongPassword =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
    return strongPassword.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validatePassword(password)) {
      setError(
        "Password must contain 8 characters, uppercase, lowercase, number and special character.",
      );
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      const data = {
        Username: name,
        Email: email,
        Password: password,
      };

      const response = await axios.post("/api/auth/signup", data, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      // console.log(response.data);

      toast.success("Account Created Successfully!", {
        className: "bg-blue-600 text-white",
      });
      setActive("login");
      navigate("/login");
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message || "Signup failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex flex-col md:flex-row h-screen w-full overflow-hidden">
        <div className="hidden xl:block xl:w-1/2 h-full">
          <img
            src={aiImage}
            alt="Signup"
            className="w-full h-full object-cover xl:rounded-r-2xl"
          />
        </div>

        <div className="w-full xl:w-1/2 h-full bg-white flex pt-2 md:pt-5">
          <Slider active={active} setActive={setActive} />

          <div className="w-full px-4 relative">
            <div className="translate-x-1/4 absolute top-0 xl:left-4 xl:translate-x-0">
              <img src={logo} alt="logo" className="h-28 object-contain" />
            </div>

            <form
              onSubmit={handleSubmit}
              className="flex flex-col mt-40 xl:mt-24 space-y-4 xl:px-14"
            >
              <div className="flex flex-col">
                <label className="text-sm mb-1 font-bold">Full Name</label>
                <input
                  type="text"
                  value={name}
                  placeholder="Enter your full name"
                  className="text-sm border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="flex flex-col">
                <label className="text-sm mb-1 font-bold">Email Address</label>
                <input
                  type="email"
                  value={email}
                  placeholder="Enter your email"
                  className="text-sm border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="flex flex-col relative">
                <label className="text-sm mb-1 font-bold">Password</label>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  placeholder="Create password"
                  onChange={(e) => setPassword(e.target.value)}
                  className="text-sm border border-gray-300 rounded-lg px-4 py-2 pr-10 focus:ring-2 focus:ring-blue-500"
                  required
                />

                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-9 cursor-pointer text-gray-500"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>

              <div className="flex flex-col relative">
                <label className="text-sm mb-1 font-bold">
                  Confirm Password
                </label>

                <input
                  type={showConfirm ? "text" : "password"}
                  value={confirmPassword}
                  placeholder="Confirm password"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="text-sm border border-gray-300 rounded-lg px-4 py-2 pr-10 focus:ring-2 focus:ring-blue-500"
                  required
                />

                <span
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-9 cursor-pointer text-gray-500"
                >
                  {showConfirm ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className={`py-2 text-white rounded-lg transition duration-300 ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {loading ? "Loading..." : "Create Account"}
              </button>

             

           

              <p className="text-sm text-center">
                Already have an account?{" "}
                <span
                  className="text-blue-600 cursor-pointer"
                  onClick={() => {
                    setActive("login");
                    navigate("/login");
                  }}
                >
                  login
                </span>
              </p>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Signup;
