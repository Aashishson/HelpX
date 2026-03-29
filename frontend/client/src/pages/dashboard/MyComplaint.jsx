import React, { useState } from "react";
import Navbar from "../components/NavBar";
import Topbar from "../components/TopBar";

import { FiFilter } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

// Complaint Card Component
const ComplaintCard = ({ complaint }) => {
  const navigate = useNavigate();
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
            #{complaint.id} · {complaint.category}
          </p>
        </div>

        <div
          className={`px-3 py-1 rounded-full text-sm ${
            statusStyles[complaint.status]
          }`}
        >
          {complaint.status}
        </div>
      </div>

      <p className="text-gray-600 mt-3 text-sm">
        {complaint.description}
      </p>

      <div className="border-t mt-4 pt-3 text-sm text-gray-500">
        Filed on {complaint.date}
      </div>
    </div>
  );
};

// Sample Data
const sampleComplaints = [
  {
    id: "CMP-1024",
    title: "Water supply disruption",
    description:
      "No water supply in Block C for the past 3 days. Multiple residents affected.",
    date: "Mar 25, 2026",
    status: "in-progress",
    category: "Utilities",
  },
  {
    id: "CMP-1023",
    title: "Streetlight not working",
    description:
      "The streetlight near Gate 2 has been non-functional for a week.",
    date: "Mar 22, 2026",
    status: "pending",
    category: "Infrastructure",
  },
];

const MyComplaint = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");

  const filtered =
    activeFilter === "all"
      ? sampleComplaints
      : sampleComplaints.filter((c) => c.status === activeFilter);

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Topbar */}
      <Topbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Sidebar */}
        <div
          className={`hidden md:block bg-white shadow transition-all duration-300 
          ${sidebarOpen ? "w-64" : "w-0 overflow-hidden"}`}
        >
          <Navbar />
        </div>

        {/* Mobile Sidebar */}
        <div
          className={`fixed top-14 left-0 w-full h-full bg-white z-40 transform transition-transform duration-300 md:hidden
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
        >
          <Navbar />
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          
          {/* Header */}
          <div className="relative h-220px bg-blue-600">
            <div className="max-w-4xl mx-auto px-4 py-10 text-white">
              <h1 className="text-3xl font-bold">My Complaints</h1>
              <p className="text-blue-100 mt-2">
                Track the status of all your registered complaints
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 mt-10 px-4">
            {[
              { label: "Total", count: sampleComplaints.length },
              {
                label: "Pending",
                count: sampleComplaints.filter(
                  (c) => c.status === "pending"
                ).length,
              },
              {
                label: "In Progress",
                count: sampleComplaints.filter(
                  (c) => c.status === "in-progress"
                ).length,
              },
              {
                label: "Resolved",
                count: sampleComplaints.filter(
                  (c) => c.status === "resolved"
                ).length,
              },
            ].map((item) => (
              <div
                key={item.label}
                className="bg-white p-4 rounded-xl shadow text-center"
              >
                <p className="text-2xl font-bold text-blue-600">
                  {item.count}
                </p>
                <p className="text-sm text-gray-500">{item.label}</p>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="max-w-4xl mx-auto px-4 mt-6 flex items-center gap-2 overflow-x-auto">
            
            {/* Filter Icon */}
            <FiFilter className="text-gray-500 text-xl flex-shrink-0 hover:text-blue-600 transition" />

            {["all", "pending", "in-progress", "resolved", "rejected"].map(
              (f) => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={`px-4 py-1 rounded-full text-sm capitalize whitespace-nowrap ${
                    activeFilter === f
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {f}
                </button>
              )
            )}
          </div>

          {/* List */}
          <div className="max-w-4xl mx-auto px-4 mt-6 space-y-4 pb-10">
            {filtered.length > 0 ? (
              filtered.map((c) => (
                <ComplaintCard key={c.id} complaint={c} />
              ))
            ) : (
              <p className="text-center text-gray-500">
                No complaints found
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyComplaint;