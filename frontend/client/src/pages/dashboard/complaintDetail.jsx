import { useState, useEffect } from "react";
import api from "../../utils/axiosInstance";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/NavBar";
import Topbar from "../components/TopBar";

const STATUS_STEPS = ["pending", "in-progress", "resolved"];

const statusIndex = (status) => {
  if (status === "rejected") return -1;
  return STATUS_STEPS.indexOf(status);
};

const priorityStyles = {
  High: "bg-red-100 text-red-700 border border-red-200",
  Medium: "bg-yellow-100 text-yellow-700 border border-yellow-200",
  Low: "bg-green-100 text-green-700 border border-green-200",
};

const StepIcon = ({ done, active, rejected }) => {
  if (rejected)
    return (
      <div className="w-9 h-9 rounded-full bg-red-500 flex items-center justify-center shadow">
        <svg
          className="w-4 h-4 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </div>
    );
  if (done)
    return (
      <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center shadow">
        <svg
          className="w-4 h-4 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>
    );
  if (active)
    return (
      <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center shadow ring-4 ring-blue-100">
        <div className="w-2.5 h-2.5 rounded-full bg-white" />
      </div>
    );
  return (
    <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center">
      <div className="w-2.5 h-2.5 rounded-full bg-gray-400" />
    </div>
  );
};

const ComplaintDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const role = localStorage.getItem("role");
  const isAdmin = role === "Admin";

  useEffect(() => {
    const fetchComplaint = async () => {
      try {
        const response = await api.get(`/api/complaint/details/${id}`);
        setComplaint(response.data.complaint);
      } catch (err) {
        setError("Failed to load complaint details.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchComplaint();
  }, [id]);

  const currentStep = complaint ? statusIndex(complaint.status) : 0;
  const isRejected = complaint?.status === "rejected";

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <Topbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div
          className={`hidden md:block bg-white shadow transition-all duration-300 ${sidebarOpen ? "w-64" : "w-0 overflow-hidden"}`}
        >
          <Navbar />
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto px-4 py-8">
          <div className="max-w-5xl mx-auto">
            {/* Loading */}
            {loading && (
              <div className="flex justify-center items-center py-32">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {complaint && (
              <>
                {/* Back + Ticket ID */}
                <div className="flex items-center gap-3 mb-4 text-sm text-gray-500">
                  <button
                    onClick={() => navigate("/MyComplaint")}
                    className="hover:text-gray-700 transition flex items-center gap-1"
                  >
                    ← Back to list
                  </button>
                  <span>·</span>
                  <span>Ticket #{complaint._id?.slice(-8).toUpperCase()}</span>
                </div>

                {/* Title + Badges */}
                <div className="mb-6">
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    {complaint.title}
                  </h1>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${priorityStyles[complaint.priority] || "bg-gray-100 text-gray-600"}`}
                    >
                      {complaint.priority || "Low"} Priority
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide bg-blue-100 text-blue-700 border border-blue-200">
                      {complaint.category || "General"}
                    </span>
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      📅 Submitted{" "}
                      {new Date(complaint.createdAt).toLocaleDateString(
                        "en-US",
                        { month: "long", day: "numeric", year: "numeric" },
                      )}
                    </span>
                  </div>
                </div>

                {/* Status Tracker */}
                <div className="bg-white rounded-xl border p-6 mb-6 shadow-sm">
                  {isRejected ? (
                    <div className="flex items-center gap-4">
                      <StepIcon rejected />
                      <div>
                        <p className="font-semibold text-red-600 text-sm uppercase tracking-wide">
                          Complaint Rejected
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          This complaint was reviewed and rejected by the admin.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      {STATUS_STEPS.map((step, index) => {
                        const done = index < currentStep;
                        const active = index === currentStep;
                        return (
                          <div key={step} className="flex items-center flex-1">
                            <div className="flex flex-col items-center gap-2">
                              <StepIcon done={done} active={active} />
                              <span
                                className={`text-xs font-medium uppercase tracking-wide ${done || active ? "text-blue-600" : "text-gray-400"}`}
                              >
                                {step === "in-progress"
                                  ? "In Progress"
                                  : step.charAt(0).toUpperCase() +
                                    step.slice(1)}
                              </span>
                            </div>
                            {index < STATUS_STEPS.length - 1 && (
                              <div
                                className={`flex-1 h-0.5 mx-3 mb-5 rounded ${index < currentStep ? "bg-blue-600" : "bg-gray-200"}`}
                              />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Body — Two Column */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Left — Main Content */}
                  <div className="md:col-span-2 space-y-6">
                    {/* Description */}
                    <div className="bg-white rounded-xl border p-6 shadow-sm">
                      <h2 className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-4">
                        📋 Detailed Description
                      </h2>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {complaint.description}
                      </p>
                    </div>

                    {/* Image (if present) */}
                    {complaint.image && (
                      <div className="bg-white rounded-xl border p-6 shadow-sm">
                        <h2 className="text-sm font-semibold text-gray-700 mb-4">
                          🖼 Attached Image
                        </h2>
                        <img
                          src={complaint.image}
                          alt="Complaint attachment"
                          className="rounded-lg w-full object-cover max-h-72"
                        />
                      </div>
                    )}
                  </div>

                  {/* Right — Metadata */}
                  <div className="space-y-6">
                    {/* Status Card */}
                    <div className="bg-white rounded-xl border p-5 shadow-sm">
                      <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-3">
                        Current Status
                      </p>
                      <div
                        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium capitalize ${
                          {
                            pending: "bg-yellow-100 text-yellow-700",
                            "in-progress": "bg-blue-100 text-blue-700",
                            resolved: "bg-green-100 text-green-700",
                            rejected: "bg-red-100 text-red-700",
                          }[complaint.status] || "bg-gray-100 text-gray-600"
                        }`}
                      >
                        <span className="w-2 h-2 rounded-full bg-current opacity-70" />
                        {complaint.status}
                      </div>
                    </div>

                    {/* Metadata Card */}
                    <div className="bg-white rounded-xl border p-5 shadow-sm">
                      <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-4">
                        Metadata
                      </p>
                      <div className="space-y-3 text-sm">
                        <div>
                          <p className="text-xs text-gray-400 mb-0.5">
                            Category
                          </p>
                          <p className="text-gray-700 font-medium">
                            {complaint.category || "General"}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400 mb-0.5">
                            Priority
                          </p>
                          <p className="text-gray-700 font-medium">
                            {complaint.priority || "Low"}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400 mb-0.5">
                            Filed by
                          </p>
                          <p className="text-gray-700 font-medium">
                            {complaint.userID?.UserName ||
                              complaint.userID?.name ||
                              "You"}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400 mb-0.5">
                            Submitted on
                          </p>
                          <p className="text-gray-700 font-medium">
                            {new Date(complaint.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                month: "long",
                                day: "numeric",
                                year: "numeric",
                              },
                            )}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400 mb-0.5">
                            Ticket ID
                          </p>
                          <p className="text-gray-700 font-mono text-xs">
                            #{complaint._id?.slice(-8).toUpperCase()}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Edit Complaint — only if pending */}
                    {complaint.status === "pending" && !isAdmin && (
                      <button
                        onClick={() =>
                          navigate(`/edit-complaint/${complaint._id}`)
                        }
                        className="w-full bg-blue-600 text-white py-2.5 rounded-lg text-sm font-medium
                                   hover:bg-blue-700 transition flex items-center justify-center gap-2"
                      >
                        ✏️ Edit Complaint
                      </button>
                    )}

                    {/* Edit Status — only for Admins */}
                    {isAdmin && (
                      <button
                        onClick={() =>
                          navigate(`/edit-status/${complaint._id}`)
                        }
                        className="w-full bg-purple-600 text-white py-2.5 rounded-lg text-sm font-medium
                                   hover:bg-purple-700 transition flex items-center justify-center gap-2"
                      >
                        🛡️ Edit Status
                      </button>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplaintDetail;
