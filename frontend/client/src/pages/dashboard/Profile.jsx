import React, { useState } from "react";
import Navbar from "../components/NavBar";
import { FaBars, FaUserCircle } from "react-icons/fa";

const Profile = () => {

  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [user, setUser] = useState({
    name: "Ayush",
    email: "ayush@example.com",
    phone: "9876543210",
    account: "User",
  });

  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gray-200">

      {/* Topbar */}
      <div className="flex items-center h-14 bg-gray-50 shadow px-4 fixed w-full z-50">
        <FaBars
          className="text-2xl cursor-pointer "
          onClick={() => setSidebarOpen(!sidebarOpen)}
        />
        <h1 className="ml-4 font-bold text-lg text-blue-500">Profile</h1>
      </div>

      <div className="flex pt-14">

        {/* Sidebar */}
        <div
          className={`fixed md:relative top-14 md:top-0 left-0 
          h-[calc(100vh-56px)] md:h-auto 
          bg-white z-40 transition-all duration-300
          ${sidebarOpen ? "w-full md:w-64" : "w-0 overflow-hidden"}`}
        >
          <Navbar />
        </div>

        {/* Profile Content */}
        <div className="flex-1 p-6 md:p-2">

          <div className="max-w-xl mx-auto bg-white shadow-lg rounded-lg p-6">

            {/* Profile Icon */}
            <div className="flex justify-center">
              <FaUserCircle className="text-7xl text-gray-500" />
            </div>

            {/* Form Fields */}
            <div className="mt-6 space-y-4">

              {/* Name */}
              <div>
                <label className="text-gray-500">Name</label>
                <input
                  type="text"
                  name="name"
                  value={user.name}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-2 mt-1"
                />
              </div>

              {/* Email */}
              <div>
                <label className="text-gray-500">Email</label>
                <input
                  type="email"
                  name="email"
                  value={user.email}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-2 mt-1"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="text-gray-500">Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={user.phone}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-2 mt-1"
                />
              </div>

              {/* Account Type */}
              <div>
                <label className="text-gray-500">Account Type</label>
                <input
                  type="text"
                  name="account"
                  value={user.account}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-2 mt-1"
                />
              </div>

            </div>

            {/* Save Button */}
            <button className="mt-6 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition">
              Save Changes
            </button>

          </div>

        </div>
      </div>
    </div>
  );
};

export default Profile;