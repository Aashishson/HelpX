import { useState } from "react";
import img from "../assets/ai.jpeg";
import logo from "../assets/logo.png";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

function ForgetPassword() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [resetToken, setResetToken] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const validatePassword = (password) => {
    const strongPassword =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
    return strongPassword.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // STEP 1 → SEND OTP
      if (step === 1) {
        setLoading(true);

        const response = await axios.post("/api/auth/send-otp", {
          Email: email,
        });

        setLoading(false);

        if (response.data.message === "OTP sent successfully!") {
          toast.success("OTP sent!");
          setStep(2);
        }

        return;
      }

      // STEP 2 → VERIFY OTP
      if (step === 2) {
        if (otp.length !== 6) {
          toast.error("Enter valid OTP");
          return;
        }

        setLoading(true);

        const checkOtp = await axios.post("/api/auth/verify-otp", {
          Email: email,
          Otp: otp,
        });

        setLoading(false);

         if (!checkOtp.data.success) {
           toast.error("Wrong OTP!");
         } else{
          toast.success("OTP verified!");
          setResetToken(checkOtp.data.resetToken);
          setStep(3);
        }

       

        return;
      }

      // STEP 3 → RESET PASSWORD
      if (step === 3) {
        if (!validatePassword(password)) {
          toast.error(
            "Password must contain uppercase, lowercase, number and special character",
          );
          return;
        }

        if (password !== confirmPassword) {
          toast.error("Passwords do not match");
          return;
        }

        setLoading(true);

        const response = await axios.post("/api/auth/reset-password", {
          token: resetToken,
          newPassword: password,
        });

        setLoading(false);

        if (response.data.message === "Password changed successfully") {
          toast.success("Password changed successfully!");

          setTimeout(() => {
            navigate("/login");
          }, 1500);
        }

        return;
      }
    } catch (error) {
      setLoading(false);
      toast.error(error.response?.data?.message || "Something went wrong");
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
            <img src={logo} alt="logo" className="h-28 object-contain" />
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col mt-40 xl:mt-24 space-y-4 xl:px-14"
          >
            {/* STEP 1 */}

            {step === 1 && (
              <>
                <label className="font-bold text-sm">Email Address</label>

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
                  disabled={loading}
                  className={`py-2 text-white rounded-lg transition duration-300 ${
                    loading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {loading ? "Sending..." : "Send OTP"}
                </button>
              </>
            )}

            {/* STEP 2 */}

            {step === 2 && (
              <>
                <label className="font-bold text-sm">Enter OTP</label>

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
                  disabled={loading}
                  className={`py-2 text-white rounded-lg transition duration-300 ${
                    loading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {loading ? "Verifying..." : "Verify OTP"}
                </button>
              </>
            )}

            {/* STEP 3 */}

            {step === 3 && (
              <>
                <label className="font-bold text-sm">New Password</label>

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
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2 cursor-pointer"
                  >
                    {showPassword ? <FaEye /> : <FaEyeSlash />}
                  </span>
                </div>

                <label className="font-bold text-sm">Confirm Password</label>

                <div className="relative">
                  <input
                    type={showConfirm ? "text" : "password"}
                    placeholder="Confirm password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="border px-4 py-2 rounded-lg w-full"
                    required
                  />

                  <span
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-2 cursor-pointer"
                  >
                    {showConfirm ? <FaEye /> : <FaEyeSlash />}
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`py-2 text-white rounded-lg transition duration-300 ${
                    loading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {loading ? "Changing..." : "Change Password"}
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
