import React, { useState } from "react";
import Navbar from "../components/NavBar";
import Topbar from "../components/TopBar";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // 1. Import Axios
import { toast } from "react-toastify";

const ComplaintForm = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // 2. State for form inputs
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // 3. Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Multi-part form data is required for file uploads
    const formData = new FormData();
    formData.append("Title", title);
    formData.append("Description", description);
    if (file) {
      // "complaint-Image" must match upload.single("complaint-Image") in backend
      formData.append("complaint-Image", file);
    }

    try {
      const token = localStorage.getItem("accessToken"); // Assuming token is stored here
      const response = await axios.post(
        "/api/complaint/create-complaint",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      toast.success("Complaint submitted!");
      navigate("/dashboard"); // Redirect to your cards view
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("Failed to submit complaint.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-200">
      <Topbar toggleSidebar={toggleSidebar} />
      <div className="flex">
        <div
          className={`fixed md:relative top-14 md:top-0 left-0 h-[calc(100vh-56px)] md:h-auto bg-white z-40 transition-all duration-300 ease-in-out ${sidebarOpen ? "w-64" : "w-0 md:w-0 overflow-hidden"}`}
        >
          <Navbar />
        </div>

        <div className="flex-1 p-4 transition-all duration-300">
          <h2 className="font-bold text-2xl mt-0">Submit a New Complaint</h2>
          <p className="text-sm mt-2 text-gray-600">
            Our AI will automatically categorize and route your submission to
            the appropriate department.
          </p>

          <form
            onSubmit={handleSubmit}
            className="bg-white w-full rounded-3xl mt-4 p-8"
          >
            <div className="flex flex-col space-y-6">
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title *"
                className="w-full h-14 rounded-xl bg-gray-50 border border-gray-300 p-4"
              />

              <textarea
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description of complaint"
                className="w-full h-40 rounded-xl bg-gray-50 border border-gray-300 p-4 resize-none"
              ></textarea>

              <input
                type="file"
                onChange={(e) => setFile(e.target.files[0])}
                className="w-full h-14 rounded-xl bg-gray-50 border border-gray-300 p-4"
              />

              <button
                type="submit"
                disabled={loading}
                className={`py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {loading ? "Analyzing & Submitting..." : "Submit Complaint"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ComplaintForm;
