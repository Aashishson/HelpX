import { useState, useEffect } from "react";
import api from "../../utils/axiosInstance";
import Navbar from "../components/NavBar";
import Topbar from "../components/TopBar";
import { FaUserCircle } from "react-icons/fa";
import { HiOutlinePencilSquare, HiOutlineCheck } from "react-icons/hi2";

const Profile = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const [user, setUser] = useState({
    name: "",
    email: "",
    role: "",
  });

  const [formData, setFormData] = useState({ name: "" });

  // ── Fetch profile on mount ──
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const res = await axios.get("/api/auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const u = res.data.user || res.data;
        setUser({
          name: u.UserName || u.name || "",
          email: u.Email || u.email || "",
          role: u.role || "user",
        });
        setFormData({ name: u.UserName || u.name || "" });
      } catch (e) {
        console.error("Failed to fetch profile", e);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // ── Save handler ──
  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      const token = localStorage.getItem("accessToken");
      await api.put("/api/auth/profile", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser((prev) => ({ ...prev, name: formData.name }));
      setSuccess(true);
      setEditMode(false);
      setTimeout(() => setSuccess(false), 3000);
    } catch (e) {
      setError(e.response?.data?.message || "Failed to save changes.");
    } finally {
      setSaving(false);
    }
  };

  const roleStyle = {
    Admin: { bg: "#EDE9FE", color: "#6D28D9" },
    user: { bg: "#F1F5F9", color: "#475569" },
  };
  const rs = roleStyle[user.role] || roleStyle.user;

  return (
    <div
      className="h-screen flex flex-col bg-gray-100 overflow-hidden"
      style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
    >
      <Topbar toggleSidebar={() => setSidebarOpen((v) => !v)} />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div
          className={`hidden md:block bg-white shadow transition-all duration-300 ${sidebarOpen ? "w-64" : "w-0 overflow-hidden"}`}
        >
          <Navbar />
        </div>

        {/* Main */}
        <div className="flex-1 overflow-y-auto flex items-start justify-center px-4 py-10">
          <div className="w-full max-w-lg">
            {loading ? (
              <div className="flex justify-center items-center py-32">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <>
                {/* Avatar Card */}
                <div className="bg-white rounded-2xl shadow-sm border p-8 mb-4 text-center">
                  <div className="flex justify-center mb-4">
                    <div
                      style={{
                        width: 80,
                        height: 80,
                        borderRadius: "50%",
                        background: "linear-gradient(135deg,#3B82F6,#6366F1)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#fff",
                        fontWeight: 800,
                        fontSize: 28,
                      }}
                    >
                      {user.name ? (
                        user.name.charAt(0).toUpperCase()
                      ) : (
                        <FaUserCircle />
                      )}
                    </div>
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {user.name || "—"}
                  </h2>
                  <p className="text-sm text-gray-400 mt-1">{user.email}</p>
                  <div className="flex justify-center mt-3">
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        padding: "3px 12px",
                        borderRadius: 20,
                        background: rs.bg,
                        color: rs.color,
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                      }}
                    >
                      {user.role}
                    </span>
                  </div>
                </div>

                {/* Details Card */}
                <div className="bg-white rounded-2xl shadow-sm border p-6">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h3 className="text-base font-semibold text-gray-800">
                        Account Details
                      </h3>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Manage your personal information
                      </p>
                    </div>
                    {!editMode ? (
                      <button
                        onClick={() => setEditMode(true)}
                        className="flex items-center gap-1.5 text-sm text-blue-600 font-medium hover:text-blue-700 transition"
                      >
                        <HiOutlinePencilSquare className="text-base" /> Edit
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setEditMode(false);
                          setFormData({ name: user.name });
                          setError(null);
                        }}
                        className="text-sm text-gray-400 hover:text-gray-600 transition"
                      >
                        Cancel
                      </button>
                    )}
                  </div>

                  {/* Success */}
                  {success && (
                    <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 px-4 py-2.5 rounded-lg text-sm mb-4">
                      <HiOutlineCheck className="text-base" /> Profile updated
                      successfully!
                    </div>
                  )}

                  {/* Error */}
                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2.5 rounded-lg text-sm mb-4">
                      {error}
                    </div>
                  )}

                  <div className="space-y-5">
                    {/* Name */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                        Full Name
                      </label>
                      {editMode ? (
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                          placeholder="Enter your name"
                        />
                      ) : (
                        <p className="text-sm text-gray-800 font-medium px-1">
                          {user.name || "—"}
                        </p>
                      )}
                    </div>

                    {/* Email — always read-only */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                        Email Address
                      </label>
                      <div className="flex items-center gap-2">
                        <p className="text-sm text-gray-800 font-medium px-1">
                          {user.email || "—"}
                        </p>
                        <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                          Read-only
                        </span>
                      </div>
                    </div>

                    {/* Account Type — always read-only */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                        Account Type
                      </label>
                      <p className="text-sm text-gray-800 font-medium px-1 capitalize">
                        {user.role}
                      </p>
                    </div>
                  </div>

                  {/* Save Button */}
                  {editMode && (
                    <button
                      onClick={handleSave}
                      disabled={saving || !formData.name.trim()}
                      className="mt-6 w-full bg-blue-600 text-white py-2.5 rounded-lg text-sm font-medium
                                 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                      {saving ? "Saving…" : "Save Changes"}
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
