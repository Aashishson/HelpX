import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "../components/NavBar.jsx";
import Topbar from "../components/TopBar.jsx";
import api from "../../utils/axiosInstance.jsx"

const STATUS_CONFIG = {
  pending: {
    label: "Pending",
    icon: "fa-solid fa-clock",
    color: "text-yellow-600",
    bg: "bg-yellow-50",
    border: "border-yellow-300",
    ring: "ring-yellow-400",
    dot: "bg-yellow-400",
  },
  "in-progress": {
    label: "In Progress",
    icon: "fa-solid fa-rotate",
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-300",
    ring: "ring-blue-400",
    dot: "bg-blue-500",
  },
  resolved: {
    label: "Resolved",
    icon: "fa-solid fa-circle-check",
    color: "text-green-600",
    bg: "bg-green-50",
    border: "border-green-300",
    ring: "ring-green-400",
    dot: "bg-green-500",
  },
  rejected: {
    label: "Rejected",
    icon: "fa-solid fa-circle-xmark",
    color: "text-red-600",
    bg: "bg-red-50",
    border: "border-red-300",
    ring: "ring-red-400",
    dot: "bg-red-500",
  },
};

const PRIORITY_STYLES = {
  High: "bg-red-100 text-red-700 border border-red-200",
  Medium: "bg-yellow-100 text-yellow-700 border border-yellow-200",
  Low: "bg-green-100 text-green-700 border border-green-200",
};

export default function EditStatus() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [complaint, setComplaint] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const fetchComplaint = async () => {
      try {
        const res = await api.get(`/api/complaint/details/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });
        const data = await res.json();
        if (data.complaint) {
          setComplaint(data.complaint);
          setSelectedStatus(data.complaint.status);
        } else {
          toast.error("Complaint not found.");
        }
      } catch (err) {
        toast.error("Failed to load complaint.");
      } finally {
        setLoading(false);
      }
    };

    fetchComplaint();
  }, [id]);

  const handleSave = async () => {
    if (selectedStatus === complaint.status) {
      toast.info("Status is already set to this value.");
      return;
    }

    setSaving(true);
    try {
      const res = await api.patch(`/api/complaint/update-status/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({ status: selectedStatus }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success(
          `Status updated to "${STATUS_CONFIG[selectedStatus].label}"`,
        );
        setComplaint((prev) => ({ ...prev, status: selectedStatus }));
      } else {
        toast.error(data.message || "Update failed.");
      }
    } catch (err) {
      toast.error("Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const current = complaint ? STATUS_CONFIG[complaint.status] : null;
  const selected = STATUS_CONFIG[selectedStatus];
  const hasChanged = complaint && selectedStatus !== complaint.status;

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Topbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div
          className={`hidden md:block bg-white shadow shrink-0 transition-all duration-200 ${
            sidebarOpen ? "w-56" : "w-0 overflow-hidden"
          }`}
        >
          <Navbar />
        </div>

        {/* Main */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          {/* Back + Header */}
          <div className="mb-6">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 mb-4 transition-colors"
            >
              <i className="fa-solid fa-arrow-left text-xs" />
              Back to complaints
            </button>
            <h1 className="text-2xl font-bold text-gray-900">
              Update Complaint Status
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Review the complaint details and assign a new status.
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="flex flex-col items-center gap-3 text-gray-400">
                <i className="fa-solid fa-spinner animate-spin text-3xl text-blue-500" />
                <span className="text-sm">Loading complaint...</span>
              </div>
            </div>
          ) : !complaint ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center text-gray-400">
                <i className="fa-solid fa-triangle-exclamation text-4xl mb-3 text-yellow-400" />
                <p className="font-medium">Complaint not found</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left — Complaint Details */}
              <div className="lg:col-span-2 space-y-5">
                {/* Title card */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                  <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                    <div>
                      <p className="text-xs text-gray-400 font-medium mb-1 uppercase tracking-wide">
                        Complaint #{complaint._id?.slice(-6).toUpperCase()}
                      </p>
                      <h2 className="text-xl font-semibold text-gray-900">
                        {complaint.title}
                      </h2>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {complaint.priority && (
                        <span
                          className={`text-xs font-semibold px-3 py-1 rounded-full ${
                            PRIORITY_STYLES[complaint.priority]
                          }`}
                        >
                          {complaint.priority} Priority
                        </span>
                      )}
                      <span
                        className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full ${current.bg} ${current.color} border ${current.border}`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${current.dot}`}
                        />
                        {current.label}
                      </span>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 leading-relaxed">
                    {complaint.description}
                  </p>

                  {complaint.image && (
                    <div className="mt-4">
                      <p className="text-xs text-gray-400 font-medium mb-2 uppercase tracking-wide">
                        Attached Image
                      </p>
                      <img
                        src={complaint.image}
                        alt="Complaint attachment"
                        className="rounded-xl max-h-60 object-cover border border-gray-100"
                      />
                    </div>
                  )}
                </div>

                {/* Meta info */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                  <p className="text-xs text-gray-400 font-medium mb-4 uppercase tracking-wide">
                    Filed by
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                      <i className="fa-solid fa-user text-blue-500 text-sm" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">
                        {complaint.userID?.name || "Unknown User"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {complaint.userID?.email || "No email available"}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-5 pt-4 border-t border-gray-50">
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">
                        Submitted
                      </p>
                      <p className="text-sm text-gray-700 font-medium">
                        {formatDate(complaint.createdAt)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">
                        Last Updated
                      </p>
                      <p className="text-sm text-gray-700 font-medium">
                        {formatDate(complaint.updatedAt)}
                      </p>
                    </div>
                    {complaint.category && (
                      <div>
                        <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">
                          Category
                        </p>
                        <p className="text-sm text-gray-700 font-medium">
                          {complaint.category}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right — Status Selector */}
              <div className="space-y-5">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                  <p className="text-xs text-gray-400 font-medium mb-4 uppercase tracking-wide">
                    Set Status
                  </p>

                  <div className="space-y-2.5">
                    {Object.entries(STATUS_CONFIG).map(([value, config]) => {
                      const isSelected = selectedStatus === value;
                      return (
                        <button
                          key={value}
                          onClick={() => setSelectedStatus(value)}
                          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all duration-150 ${
                            isSelected
                              ? `${config.bg} ${config.border} ${config.color} ring-2 ${config.ring} ring-offset-1`
                              : "bg-gray-50 border-gray-100 text-gray-500 hover:bg-gray-100 hover:border-gray-200"
                          }`}
                        >
                          <span
                            className={`w-2 h-2 rounded-full shrink-0 ${
                              isSelected ? config.dot : "bg-gray-300"
                            }`}
                          />
                          <i
                            className={`${config.icon} w-4 text-center ${
                              isSelected ? config.color : "text-gray-400"
                            }`}
                          />
                          {config.label}
                          {isSelected && (
                            <i className="fa-solid fa-check ml-auto text-xs" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Preview */}
                  {hasChanged && (
                    <div className="mt-5 pt-4 border-t border-gray-50">
                      <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">
                        Preview change
                      </p>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${current.bg} ${current.color}`}
                        >
                          {current.label}
                        </span>
                        <i className="fa-solid fa-arrow-right text-gray-300 text-xs" />
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${selected.bg} ${selected.color}`}
                        >
                          {selected.label}
                        </span>
                      </div>
                      {(selectedStatus === "resolved" ||
                        selectedStatus === "rejected") && (
                        <p className="text-xs text-gray-400 mt-2 flex items-center gap-1.5">
                          <i className="fa-solid fa-envelope text-gray-300" />
                          User will be notified by email.
                        </p>
                      )}
                    </div>
                  )}

                  <button
                    onClick={handleSave}
                    disabled={saving || !hasChanged}
                    className={`mt-5 w-full py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 flex items-center justify-center gap-2 ${
                      hasChanged
                        ? "bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white shadow-sm shadow-blue-200"
                        : "bg-gray-100 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    {saving ? (
                      <>
                        <i className="fa-solid fa-spinner animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <i className="fa-solid fa-floppy-disk" />
                        Save Status
                      </>
                    )}
                  </button>
                </div>

                {/* Quick stats */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                  <p className="text-xs text-gray-400 font-medium mb-3 uppercase tracking-wide">
                    Status Guide
                  </p>
                  <ul className="space-y-2.5 text-xs text-gray-500">
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 mt-1 shrink-0" />
                      <span>
                        <strong className="text-gray-700">Pending</strong> —
                        newly filed, awaiting review
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1 shrink-0" />
                      <span>
                        <strong className="text-gray-700">In Progress</strong> —
                        actively being handled
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1 shrink-0" />
                      <span>
                        <strong className="text-gray-700">Resolved</strong> —
                        issue addressed, user notified
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1 shrink-0" />
                      <span>
                        <strong className="text-gray-700">Rejected</strong> —
                        invalid or out of scope, user notified
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
}
