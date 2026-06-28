import { useState, useEffect } from "react";
import api from "../../utils/axiosInstance"
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/NavBar";
import Topbar from "../components/TopBar";

const EditComplaint = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  // ================== Fetch Existing Complaint ==================
  useEffect(() => {
    const fetchComplaint = async () => {
      try {
        const response = await api.get(`/api/complaint/details/${id}`);
        const { title, description } = response.data.complaint;
        setFormData({ title, description });
      } catch (err) {
        setError("Failed to load complaint. Please try again.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchComplaint();
  }, [id]);

  // ================== Handle Submit ==================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const token = localStorage.getItem("accessToken");
      await api.patch(`/api/complaint/edit/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess(true);
      setTimeout(() => navigate("/MyComplaint"), 1500);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to update. Please try again.",
      );
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <Topbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div
          className={`hidden md:block bg-white shadow transition-all duration-300 ${
            sidebarOpen ? "w-64" : "w-0 overflow-hidden"
          }`}
        >
          <Navbar />
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto flex items-start justify-center px-4 py-10">
          <div className="bg-white rounded-2xl shadow-sm border w-full max-w-2xl p-8">
            {/* Header */}
            <div className="mb-8">
              <button
                onClick={() => navigate("/my-complaints")}
                className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1 mb-4 transition"
              >
                ← Back to complaints
              </button>
              <h1 className="text-2xl font-semibold text-gray-800">
                Edit Complaint
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Update your complaint details below
              </p>
            </div>

            {/* Loading State */}
            {loading ? (
              <div className="flex justify-center items-center py-16">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Success Banner */}
                {success && (
                  <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
                    ✓ Complaint updated successfully! Redirecting...
                  </div>
                )}

                {/* Error Banner */}
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                {/* Title Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    required
                    placeholder="Enter complaint title"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm
                               focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                               transition"
                  />
                </div>

                {/* Description Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    required
                    rows={6}
                    placeholder="Describe your complaint in detail"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm
                               focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                               transition resize-none"
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={submitting || success}
                    className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg text-sm font-medium
                               hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    {submitting ? "Saving..." : "Save Changes"}
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate("/my-complaints")}
                    className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-lg text-sm font-medium
                               hover:bg-gray-200 transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditComplaint;
