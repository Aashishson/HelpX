import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/NavBar";
import Topbar from "../components/TopBar";
import Pagination from "../../pagination/Pagination";
import { HiOutlineTrash } from "react-icons/hi";
import { HiOutlinePencilSquare } from "react-icons/hi2";
import { FiFilter } from "react-icons/fi";

const ITEMS_PER_PAGE = 5;

// ================== Complaint Card ==================
const ComplaintCard = ({ complaint, onDelete }) => {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const statusStyles = {
    pending: "bg-yellow-100 text-yellow-700",
    "in-progress": "bg-blue-100 text-blue-700",
    resolved: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700",
  };

  const priorityStyles = {
    Medium: "bg-yellow-100 text-yellow-700",
    Low: "bg-green-100 text-green-700",
    High: "bg-red-100 text-red-700",
  };

  return (
    <>
      <div className="bg-white rounded-xl border p-5 shadow-sm">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-lg font-semibold">{complaint.title}</h2>
            <p className="text-sm text-gray-500">
              #{complaint._id?.slice(-6)} · {complaint.category || "General"}
            </p>
          </div>

          {/* Status + Priority */}
          <div className="flex gap-2">
            <div
              className={`px-3 py-1 rounded-full text-sm capitalize ${
                statusStyles[complaint.status] || "bg-gray-100"
              }`}
            >
              {complaint.status || "pending"}
            </div>
            <div
              className={`px-3 py-1 rounded-full text-sm capitalize ${
                priorityStyles[complaint.priority]
              }`}
            >
              {complaint.priority || "Low"}
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-600 mt-3 text-sm">{complaint.description}</p>

        {/* Footer */}
        <div className="border-t mt-4 pt-3 flex justify-between items-center">
          <span className="text-sm text-gray-500">
            Filed on {new Date(complaint.createdAt).toLocaleDateString()}
          </span>

          {/* Action Icons */}
          <div className="flex gap-3">
            {/* Edit */}
            <div
              onClick={() => navigate(`/edit-complaint/${complaint._id}`)}
              className="w-7 h-7 rounded-full flex items-center justify-center
                         border-2 border-blue-300 cursor-pointer
                         transition duration-300
                         hover:shadow-[0_0_12px_3px_#93c5fd]
                         hover:scale-110"
              title="Edit complaint"
            >
              <HiOutlinePencilSquare className="text-blue-500" />
            </div>

            {/* Delete */}
            <div
              onClick={() => setShowModal(true)}
              className="w-7 h-7 rounded-full flex items-center justify-center
                         border-2 border-red-300 cursor-pointer
                         transition duration-300
                         hover:shadow-[0_0_12px_3px_#f87171]
                         hover:scale-110"
              title="Delete complaint"
            >
              <HiOutlineTrash className="text-red-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-80 text-center">
            <h2 className="text-lg font-semibold mb-4">
              Are you sure you want to delete this complaint?
            </h2>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => {
                  onDelete(complaint._id);
                  setShowModal(false);
                }}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Yes
              </button>
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

  // Reset to page 1 when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeFilter]);

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

  // ================== Filters + Pagination ==================
  const filtered =
    activeFilter === "all"
      ? complaints
      : complaints.filter((c) => c.status === activeFilter);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);

  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

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
                  onClick={() => setActiveFilter(status)}
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

          {/* Complaint List */}
          <div className="max-w-4xl mx-auto px-4 mt-6 space-y-4 pb-4">
            {loading ? (
              <p className="text-center">Loading your complaints...</p>
            ) : paginated.length > 0 ? (
              paginated.map((c) => (
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

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="max-w-4xl mx-auto px-4 pb-10">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => setCurrentPage(page)}
              />
            </div>
          )}
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
