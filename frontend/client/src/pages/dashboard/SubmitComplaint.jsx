import React, { useState } from "react";
import Navbar from "../components/NavBar";
import Topbar from "../components/TopBar";

import { useNavigate } from "react-router-dom";


const ComplaintForm = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="w-full min-h-screen bg-gray-200 ">


      <Topbar toggleSidebar={toggleSidebar} />

      <div className="flex">
       



        <div
          className={`
            fixed md:relative
            top-14 md:top-0
            left-0
            h-[calc(100vh-56px)] md:h-auto
            bg-white
            z-40
            transition-all duration-300 ease-in-out
            ${sidebarOpen ? ":w-64 " : "w-0 md:w-0 overflow-hidden"}
          `}

        >
          <Navbar />
        </div>

        <div className="flex-1 p-4 transition-all duration-300">


          <h2 className="font-bold text-2xl mt-0">
            Submit a New Complaint
          </h2>

          <p className="text-sm mt-2 text-gray-600">
            Our AI will automatically categorize and route your submission
            to the appropriate department
          </p>

          {/* Form */}
          <div className="bg-white w-full rounded-3xl mt-4 p-8">

            <div className="flex flex-col space-y-6">

              <input
                type="text"
                placeholder="Title *"
                className="w-full h-14 rounded-xl bg-gray-50 border border-gray-300 p-4"
              />

              <textarea
                placeholder="Description of complaint"
                className="w-full h-40 rounded-xl bg-gray-50 border border-gray-300 p-4 resize-none"
              ></textarea>

              <input
                type="file"
                className="w-full h-14 rounded-xl bg-gray-50 border border-gray-300 p-4"
              />

              <button
                type="submit"
                className="py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Submit Complaint
              </button>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default ComplaintForm;