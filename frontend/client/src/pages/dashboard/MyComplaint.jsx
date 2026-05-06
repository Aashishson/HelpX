import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/NavBar";
import Topbar from "../components/TopBar";
import Pagination from "../../pagination/pagination";
import { HiOutlineTrash } from "react-icons/hi";
import { FiFilter } from "react-icons/fi";

// ================== Complaint Card ==================
const ComplaintCard = ({ complaint, onDelete }) => {
  const [showModal, setShowModal] = useState(false);

  const statusStyles = {
    pending: "bg-yellow-100 text-yellow-700",
    "in-progress": "bg-blue-100 text-blue-700",
    resolved: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700",
  };

  return (
    <>
      <div className="bg-white rounded-xl border p-5 shadow-sm relative">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-lg font-semibold">{complaint.title}</h2>
            <p className="text-sm text-gray-500">
              #{complaint._id?.slice(-6)} · {complaint.category || "General"}
            </p>
          </div>

          {/* 🔥 UPDATED: Status + Priority */}
          <div className="flex gap-2">
            {/* Status */}
            <div
              className={`px-3 py-1 rounded-full text-sm capitalize ${
                statusStyles[complaint.status] || "bg-gray-100"
              }`}
            >
              {complaint.status || "pending"}
            </div>

            {/* Priority */}
            <div
              className={`px-3 py-1 rounded-full text-sm capitalize ${
                complaint.priority === "high"
                  ? "bg-red-100 text-red-600"
                  : complaint.priority === "medium"
                    ? "bg-yellow-100 text-yellow-600"
                    : "bg-green-100 text-green-600"
              }`}
            >
              {complaint.priority || "low"}
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-600 mt-3 text-sm">{complaint.description}</p>

        {/* Date */}
        <div className="border-t mt-4 pt-3 text-sm text-gray-500">
          Filed on {new Date(complaint.createdAt).toLocaleDateString()}
        </div>

        {/* Delete Icon */}
        <div
          onClick={() => setShowModal(true)}
          className="absolute right-5 bottom-5 w-7 h-7 rounded-full flex items-center justify-center 
                     border-2 border-red-300 
                     transition duration-300 
                     hover:shadow-[0_0_12px_3px_#f87171] 
                     hover:scale-110 cursor-pointer"
        >
          <HiOutlineTrash className="text-red-500" />
        </div>
      </div>

      {/* ================== Modal ================== */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-80 text-center">
            <h2 className="text-lg font-semibold mb-4">
              Are you sure you want to delete this complaint?
            </h2>

            <div className="flex justify-center gap-4">
              {/* YES */}
              <button
                onClick={() => {
                  onDelete(complaint._id);
                  setShowModal(false);
                }}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Yes
              </button>

              {/* NO */}
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// ================== Main Component ==================
const MyComplaint = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // ================== Fetch Complaints ==================
  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const token = localStorage.getItem("accessToken");

        const response = await axios.get("/api/complaint/user-complaints", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data.success) {
          setComplaints(response.data.complaints);
        }
      } catch (error) {
        console.error("Failed to fetch complaints", error);
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  // ================== Delete Function ==================
  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("accessToken");

      await axios.delete(`/api/complaint/delete-complaint/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setComplaints((prev) => prev.filter((c) => c._id !== id));
    } catch (error) {
      console.error("Delete failed", error);
    }
  };

  // ================== Filters ==================
  const filtered =
    activeFilter === "all"
      ? complaints
      : complaints.filter((c) => c.status === activeFilter);

  const getCount = (status) =>
    complaints.filter((c) => c.status === status).length;

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
        <div className="flex-1 overflow-y-auto">
          {/* Stats */}
          <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 mt-10 px-4">
            <StatCard label="Total" count={complaints.length} />
            <StatCard label="Pending" count={getCount("pending")} />
            <StatCard label="In Progress" count={getCount("in-progress")} />
            <StatCard label="Resolved" count={getCount("resolved")} />
          </div>

          {/* Filters */}
          <div className="max-w-4xl mx-auto px-4 mt-6 flex items-center gap-2 overflow-x-auto pb-2">
            <FiFilter className="text-gray-500 text-xl shrink-0 mr-2" />

            {["all", "pending", "in-progress", "resolved", "rejected"].map(
              (status) => (
                <button
                  key={status}
                  onClick={() => {
                    setActiveFilter(status);
                    setCurrentPage(1);
                  }}
                  className={`px-4 py-1 rounded-full text-sm capitalize whitespace-nowrap transition-colors ${
                    activeFilter === status
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {status.replace("-", " ")}
                </button>
              ),
            )}
          </div>

          {/* List */}
          <div className="max-w-4xl mx-auto px-4 mt-6 space-y-4 pb-10">
            {loading ? (
              <p className="text-center">Loading your complaints...</p>
            ) : filtered.length > 0 ? (
              filtered.map((c) => (
                <ComplaintCard
                  key={c._id}
                  complaint={c}
                  onDelete={handleDelete}
                />
              ))
            ) : (
              <p className="text-center text-gray-500">No complaints found</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ================== Stat Card ==================
const StatCard = ({ label, count }) => (
  <div className="bg-white p-4 rounded-xl shadow text-center">
    <p className="text-2xl font-bold text-blue-600">{count}</p>
    <p className="text-sm text-gray-500">{label}</p>
  </div>
);

export default MyComplaint;
