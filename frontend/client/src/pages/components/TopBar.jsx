import { FaBars } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import api from "../../utils/axiosInstance";

function Topbar({ toggleSidebar }) {
  const navigate = useNavigate();

const handleLogout = async () => {
  try {
    await api.post("/api/auth/logOut"); // interceptor auto-attaches the token
  } catch (error) {
    console.error("Logout error:", error);
  } finally {
    localStorage.removeItem("token");
    navigate("/login");
  }
};

  return (
    <div className="flex items-center h-14 px-4 bg-gray-50 shadow gap-4">
      {/* Menu Icon */}
      <button onClick={toggleSidebar} className="text-xl">
        <FaBars />
      </button>

      {/* Search */}
      <input
        type="text"
        placeholder="Search your complaint"
        className="w-full max-w-md h-10 rounded-lg border border-gray-300 px-3 outline-none"
      />

      {/* Right Side Icons + Logout */}
      <div className="flex items-center ml-auto space-x-5">
        <i className="fa-solid fa-bell"></i>
        <i className="fa-solid fa-gear"></i>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition text-sm"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Topbar;
