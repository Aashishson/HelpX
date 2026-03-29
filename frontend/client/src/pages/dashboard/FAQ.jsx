import React, { useState } from "react";
import Navbar from "../components/NavBar";
import { FaBars } from "react-icons/fa";

const faqData = [
  {
    question: "How do I submit a complaint?",
    answer:
      "Go to the dashboard and click on the Complaint Form. Fill in the required details and submit the form.",
  },
  {
    question: "Can I track my complaint status?",
    answer:
      "Yes, after submitting a complaint you can track the status from your dashboard profile section.",
  },
  {
    question: "Is my personal information secure?",
    answer:
      "Yes, your data is securely stored and only authorized administrators can access it.",
  },
  {
    question: "How long does it take to resolve a complaint?",
    answer:
      "Most complaints are reviewed within 24-48 hours depending on the issue.",
  },
  {
    question: "Can I edit my complaint after submitting?",
    answer:
      "No, but you can contact support or create another complaint if required.",
  },
];

const FAQ = () => {
  const [active, setActive] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleFAQ = (index) => {
    setActive(active === index ? null : index);
  };

  return (
    <div className="w-full min-h-screen bg-gray-200">

      {/* Topbar */}
      <div className="flex items-center bg-white shadow-md h-14 px-4">
        <FaBars
          className="text-2xl cursor-pointer "
          onClick={() => setSidebarOpen(!sidebarOpen)}
        />
        <h1 className="ml-4 font-bold text-blue-500">FAQ Page</h1>
      </div>

      <div className="flex">

        {/* Sidebar */}
        <div
          className={`fixed md:relative top-14 md:top-0 left-0 h-[calc(100vh-56px)] md:h-auto bg-white z-40 transition-all duration-300
          ${sidebarOpen ? "w-full md:w-64" : "w-0 overflow-hidden"}`}
        >
          <Navbar />
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4 md:p-10">

          <h1 className="text-2xl md:text-3xl font-bold text-center mb-8">
            Frequently Asked Questions
          </h1>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqData.map((faq, index) => (
              <div
                key={index}
                className="bg-white shadow-md rounded-lg p-4 cursor-pointer"
                onClick={() => toggleFAQ(index)}
              >
                <div className="flex justify-between items-center">
                  <h2 className="font-semibold">{faq.question}</h2>
                  <span className="text-xl">
                    {active === index ? "-" : "+"}
                  </span>
                </div>

                {active === index && (
                  <p className="mt-3 text-gray-600">{faq.answer}</p>
                )}
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};

export default FAQ;