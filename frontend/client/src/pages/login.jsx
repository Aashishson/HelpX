import { useState } from "react";
import img from "../assets/ai.jpeg";
import logo from "../assets/logo.png";
import { FcGoogle } from "react-icons/fc";
import Slider from "./components/Slider.jsx";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Login({ active, setActive }) {
  const navigate = useNavigate();

  const [loading,setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const storedEmail = "test@gmail.com";
  const storedPassword = "Password@123";

  const handleLogin = async(e) => {
    e.preventDefault();

  

    const data = {
      Email : email,
      Password : password,
    }

    try{
      setLoading(true);
      const response = await axios.post("http://localhost:4000/api/auth/login", data ,{
          headers: {
            "Content-Type": "application/json",
          },
        },
      
      );
      localStorage.setItem("accessToken", response.data.accessToken);
      // console.log(response.data);

      toast.success("Account Logged-In Successfully!", {
              className: "bg-blue-600 text-white",
            });
            navigate("/user-dashboard");

    }catch(error){
      console.log(error);

    }finally{
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col md:flex-row h-screen w-full overflow-hidden">
      {/* Left Image */}
      <div className="hidden xl:block xl:w-1/2 h-full">
        <img
          src={img}
          className="w-full h-full object-cover xl:rounded-l-2xl"
          alt="login"
        />
      </div>

      {/* Right Form */}
      <div className="w-full xl:w-1/2 h-full bg-white flex pt-2 md:pt-5">
        <Slider active={active} setActive={setActive} />
        <div className="w-full px-4 relative">
          {/* Logo */}
          <div className=" translate-x-1/4 absolute top-0 xl:left-4 xl:translate-x-0">
            <img src={logo} alt="logo" className="h-28 object-contain" />
          </div>

          <form
            onSubmit={handleLogin}
            className="flex flex-col mt-32 xl:mt-20 space-y-4 xl:px-14"
          >
            <p className="text-gray-600 mt-8">
              Please enter your credentials to continue.
            </p>

            {/* Email */}
            <div className="flex flex-col">
              <label className="font-bold text-sm mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full text-sm border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Password */}
            <div className="flex flex-col">
              <label className="font-bold text-sm mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="*******"
                className="w-full text-sm border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Error */}
            {error && <p className="text-red-500 text-sm">{error}</p>}

            {/* Remember */}
            <div className="flex items-center gap-2">
              <input type="checkbox" />
              <label className="text-sm font-semibold">
                Remember this device
              </label>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className={`py-2 text-white rounded-lg transition duration-300 ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {loading ? "Loading..." : "Sign in"}
            </button>

            <div className="flex justify-center text-sm">or</div>

            {/* Google Login */}
            <button
              type="button"
              className="flex items-center justify-center gap-3 w-full border border-gray-300 rounded-lg py-2 text-sm font-medium hover:bg-gray-400 transition"
            >
              <FcGoogle size={20} />
              Continue with Google
            </button>

            <p className="text-sm text-gray-600 text-center">
              Don't have an account?{" "}
              <span
                className="text-blue-600 cursor-pointer"
                onClick={() => {
                  setActive("signup");
                  navigate("/signup");
                }}
              >
                Sign up
              </span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
