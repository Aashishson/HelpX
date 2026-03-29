import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/NavBar";
import Topbar from "../components/TopBar";
import Pagination from "../../pagination/pagination";


// 1. Define the Card first
const ComplaintCard = ({ complaint }) => {
  const statusStyles = {
    pending: "bg-yellow-100 text-yellow-700",
    "in-progress": "bg-blue-100 text-blue-700",
    resolved: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700",
  };

  return (
    <div className="bg-white rounded-xl border p-5 shadow-sm">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-lg font-semibold">{complaint.title}</h2>
          <p className="text-sm text-gray-500">
            {/* Note: MongoDB uses _id, not id */}
            #{complaint._id?.slice(-6)} · {complaint.category || "General"}
          </p>
        </div>
        <div className={`px-3 py-1 rounded-full text-sm capitalize ${statusStyles[complaint.status] || "bg-gray-100"}`}>
          {complaint.status || "pending"}
        </div>
      </div>
      <p className="text-gray-600 mt-3 text-sm">{complaint.description}</p>
      <div className="border-t mt-4 pt-3 text-sm text-gray-500">
        Filed on {new Date(complaint.createdAt).toLocaleDateString()}
      </div>
    </div>
  );
};



const MyComplaint = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");
  const [complaints, setComplaints] = useState([]); // State for API data
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const token = localStorage.getItem("accessToken"); 
        const response = await axios.get(
          "/api/complaint/user-complaints",
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

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

  // Filter the live data instead of sample data
  const filtered =
    activeFilter === "all"
      ? complaints
      : complaints.filter((c) => c.status === activeFilter);

  // Helper for Stats (using live data)
  const getCount = (status) =>
    complaints.filter((c) => c.status === status).length;

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <Topbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar logic remains same */}
        <div
          className={`hidden md:block bg-white shadow transition-all duration-300 ${sidebarOpen ? "w-64" : "w-0 overflow-hidden"}`}
        >
          <Navbar />
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* Header */}
          <div className="relative h-220px bg-blue-600">
            {/* ... header content ... */}
          </div>

          {/* Stats Section - Updated to use live data */}
          <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 mt-10 px-4">
            <StatCard label="Total" count={complaints.length} />
            <StatCard label="Pending" count={getCount("pending")} />
            <StatCard label="In Progress" count={getCount("in-progress")} />
            <StatCard label="Resolved" count={getCount("resolved")} />
          </div>

          {/* Filters remain the same */}

          {/* List Section */}
          <div className="max-w-4xl mx-auto px-4 mt-6 space-y-4 pb-10">
            {loading ? (
              <p className="text-center">Loading your complaints...</p>
            ) : filtered.length > 0 ? (
              filtered.map((c) => <ComplaintCard key={c._id} complaint={c} />)
            ) : (
              <p className="text-center text-gray-500">No complaints found</p>
            )}
          </div>

          {/* Pagination*/}
          <div className="max-w-4xl mx-auto px-4">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => setCurrentPage(page)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Small helper for the Stat boxes
const StatCard = ({ label, count }) => (
  <div className="bg-white p-4 rounded-xl shadow text-center">
    <p className="text-2xl font-bold text-blue-600">{count}</p>
    <p className="text-sm text-gray-500">{label}</p>
  </div>
);

export default MyComplaint;
