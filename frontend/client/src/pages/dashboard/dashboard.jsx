import React, { useState } from "react";
import Navbar from "../components/NavBar";
import Topbar from "../components/TopBar";

import { useNavigate } from "react-router-dom";


const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  

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
        <div className="flex-1 overflow-y-auto p-4 md:p-6">

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">

            <div>
              <h2 className="text-xl md:text-2xl font-bold">
                User Dashboard
              </h2>
              <p className="text-gray-600 text-sm">
                Track and manage your complaints
              </p>
            </div>

            <button  onClick={() => navigate("/complaint")} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition w-full sm:w-auto">
              + New Complaint
            </button>

          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">

            <div className="bg-white rounded-xl shadow p-4 flex items-center gap-4">
              <i className="fa-solid fa-file-contract text-blue-600 text-2xl"></i>
              <div>
                <p className="text-gray-500 text-sm">Total Complaints</p>
                <p className="text-xl font-bold">1</p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow p-4 flex items-center gap-4">
              <i className="fa-solid fa-circle-check text-green-600 text-2xl"></i>
              <div>
                <p className="text-gray-500 text-sm">Resolved</p>
                <p className="text-xl font-bold">0</p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow p-4 flex items-center gap-4">
              <i className="fa-solid fa-clock text-orange-600 text-2xl"></i>
              <div>
                <p className="text-gray-500 text-sm">Pending</p>
                <p className="text-xl font-bold">0</p>
              </div>
            </div>

          </div>

          {/* Table */}
          <div className="bg-white rounded-xl shadow p-4 mt-8">

            <h3 className="text-lg font-semibold mb-4">
              Recent Complaints
            </h3>

            <div className="overflow-x-auto">

              <table className="min-w-[650px w-full text-sm">

                <thead className="border-b text-gray-500">
                  <tr>
                    <th className="py-3 text-left">ID</th>
                    <th className="text-left">Title</th>
                    <th className="text-left">Category</th>
                    <th className="text-left">Priority</th>
                    <th className="text-left">Status</th>
                  </tr>
                </thead>

                <tbody>

                  <tr className="border-b hover:bg-gray-50">
                    <td className="py-3">#146bbf</td>
                    <td>Lack of books in library</td>
                    <td>General</td>
                    <td>
                      <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-xs">
                        HIGH
                      </span>
                    </td>
                    <td className="text-blue-600">In Progress</td>
                  </tr>

                 
                </tbody>

              </table>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default Dashboard;