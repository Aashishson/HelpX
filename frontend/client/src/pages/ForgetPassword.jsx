import { useState } from "react";
import img from "../assets/ai.jpeg";
import logo from "../assets/logo.png";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";

function ForgetPassword() {


  const navigate = useNavigate();

  const [step, setStep] = useState(1);

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const validatePassword = (password) => {
    const strongPassword =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

    return strongPassword.test(password);
  };

  const handleSubmit = (e) => {

    e.preventDefault();

    if (step === 1) {
      alert("OTP Sent to " + email + " ✅");
      setStep(2);
      return;
    }

    if (step === 2) {

      if (otp.length !== 6) {
        alert("Enter valid OTP");
        return;
      }

    toast
      setStep(3);
      return;
    }

    if (step === 3) {

      if (!validatePassword(password)) {
        alert(
          "Password must contain uppercase, lowercase, number and special character"
        );
        return;
      }

      if (password !== confirmPassword) {
        alert("Passwords do not match");
        return;
      }

     toast.success("change password succesfully!", {
        className: "bg-blue-600 text-white",
      });

      setTimeout(() => {
        navigate("/login");
      }, 1500);
      
    }
  };

  return (

    <div className="flex flex-col md:flex-row h-screen w-full overflow-hidden max-w-7xl">

      {/* Left Image */}

      <div className="hidden xl:block xl:w-1/2 h-full">
        <img
          src={img}
          alt="image"
          className="w-full h-full object-cover rounded-2xl"
        />
      </div>

      {/* Right Side */}

      <div className="w-full xl:w-1/2 bg-white flex pt-5">

        <div className="w-full px-4 relative">

          {/* Logo */}

          <div className="absolute top-0 left-1/2 -translate-x-1/2 xl:left-4 xl:translate-x-0">

            <img
              src={logo}
              alt="logo"
              className="h-28 object-contain"
            />

          </div>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col mt-40 xl:mt-24 space-y-4 xl:px-14"
          >

            {/* STEP 1 */}

            {step === 1 && (
              <>
                <label className="font-bold text-sm">
                  Email Address
                </label>

                <input
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border px-4 py-2 rounded-lg"
                  required
                />

                <button
                  type="submit"
                  className="bg-blue-600 text-white py-2 rounded-lg"
                >
                  Send OTP
                </button>
               
      
              </>
            )}

            {/* STEP 2 */}

            {step === 2 && (
              <>
                <label className="font-bold text-sm">
                  Enter OTP
                </label>

                <input
                  type="text"
                  placeholder="6 digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="border px-4 py-2 rounded-lg"
                  maxLength="6"
                  required
                />

                <button
                  type="submit"
                  className="bg-blue-600 text-white py-2 rounded-lg"
                >
                  Verify OTP
                </button>
              </>
            )}

            {/* STEP 3 */}

            {step === 3 && (
              <>
                <label className="font-bold text-sm">
                  New Password
                </label>

                <div className="relative">

                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="New password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border px-4 py-2 rounded-lg w-full"
                    required
                  />

                  <span
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                    className="absolute right-3 top-2 cursor-pointer"
                  >
                    {showPassword ? <FaEye /> : <FaEyeSlash />}
                  </span>

                </div>

                <label className="font-bold text-sm">
                  Confirm Password
                </label>

                <div className="relative">

                  <input
                    type={showConfirm ? "text" : "password"}
                    placeholder="Confirm password"
                    value={confirmPassword}
                    onChange={(e) =>
                      setConfirmPassword(e.target.value)
                    }
                    className="border px-4 py-2 rounded-lg w-full"
                    required
                  />

                  <span
                    onClick={() =>
                      setShowConfirm(!showConfirm)
                    }
                    className="absolute right-3 top-2 cursor-pointer"
                  >
                    {showConfirm ? <FaEye /> : <FaEyeSlash />}
                  </span>

                </div>

                <button
                  type="submit"
                  className="bg-blue-600 text-white py-2 rounded-lg"
                >
                  Change Password
                </button>
              </>
            )}

          </form>

        </div>

      </div>

    </div>
  );
}

export default ForgetPassword;