import { useState } from "react";
import Navbar from "../components/Navbar";
import Topbar from "../components/Topbar";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import {
  HiOutlineInformationCircle,
  HiOutlineDocumentText,
  HiOutlineChartBar,
  HiOutlineCog,
} from "react-icons/hi";

const faqs = {
  General: {
    icon: <HiOutlineInformationCircle className="text-blue-500 text-lg" />,
    questions: [
      {
        q: "Who is eligible to file a formal complaint?",
        a: "Any registered user on the HelpX platform is eligible to file a complaint. You must have a verified account to submit, track, and manage complaints. This ensures accountability and allows our team to follow up with you directly.",
      },
      {
        q: "What happens after I submit a complaint?",
        a: "Once submitted, your complaint is automatically analyzed by our AI system to assign a priority level (Low, Medium, or High). It is then reviewed by our admin team who will update the status as it progresses through — Pending → In Progress → Resolved (or Rejected if ineligible).",
      },
      {
        q: "How long does it take to resolve a complaint?",
        a: "Resolution time depends on the complexity and priority of your complaint. High-priority complaints are typically addressed within 24–48 hours. Medium and Low priority complaints may take 3–7 business days. You will receive an email notification when your complaint status changes.",
      },
      {
        q: "Can I file multiple complaints?",
        a: "Yes, you can file as many complaints as needed. Each complaint is tracked independently with its own ticket ID. You can view and manage all your complaints from the My Complaints section of your dashboard.",
      },
    ],
  },
  Submission: {
    icon: <HiOutlineDocumentText className="text-green-500 text-lg" />,
    questions: [
      {
        q: "How do I attach evidence to my submission?",
        a: "When filing a complaint, you will find an image upload option in the complaint form. You can attach one image (JPG, PNG) as supporting evidence. Make sure the image is clear and directly relevant to your complaint for faster processing.",
      },
      {
        q: "Can I save a draft and finish it later?",
        a: "Currently, HelpX does not support draft saving. We recommend preparing your complaint details beforehand and submitting in one session. The form only requires a title and description to get started, so you can keep it brief and add more context in follow-up communications.",
      },
      {
        q: "What should I include in my complaint description?",
        a: "A good complaint description should include: what the issue is, when it occurred, where it happened (if applicable), and what outcome you are expecting. The more specific and clear your description, the faster our team can assess and address it.",
      },
      {
        q: "Is there a character limit for complaint descriptions?",
        a: "There is no strict character limit, but we recommend keeping your description concise and focused — ideally between 100 and 500 words. Overly long descriptions may slow down the review process. Include only the most relevant details.",
      },
    ],
  },
  Tracking: {
    icon: <HiOutlineChartBar className="text-yellow-500 text-lg" />,
    questions: [
      {
        q: "How long does a standard review take?",
        a: "A standard review typically takes 3–5 business days depending on the current volume of complaints and the priority assigned by our AI system. High-priority complaints flagged as urgent are escalated and reviewed within 24 hours.",
      },
      {
        q: "Who can see the details of my complaint?",
        a: "Your complaint details are visible only to you and the HelpX admin team. Other users cannot view your complaints. Admins use this information solely for the purpose of reviewing and resolving your issue.",
      },
      {
        q: "What do the different complaint statuses mean?",
        a: "Pending — your complaint has been received and is awaiting review. In Progress — an admin is actively working on it. Resolved — the issue has been addressed and closed. Rejected — the complaint did not meet the criteria for formal review. You'll receive an email notification for Resolved and Rejected status changes.",
      },
      {
        q: "Can I edit my complaint after submitting?",
        a: "Yes, you can edit your complaint title and description as long as it is still in Pending or In Progress status. Once a complaint is Resolved or Rejected, editing is disabled. To edit, go to My Complaints and click the pencil icon on the relevant complaint.",
      },
    ],
  },
  Technical: {
    icon: <HiOutlineCog className="text-purple-500 text-lg" />,
    questions: [
      {
        q: "What browsers are supported by HelpX?",
        a: "HelpX is optimized for modern browsers including Google Chrome, Mozilla Firefox, Microsoft Edge, and Safari. We recommend keeping your browser up to date for the best experience. Internet Explorer is not supported.",
      },
      {
        q: "Why am I not receiving email notifications?",
        a: "Please check your spam or junk folder first. If the email is not there, ensure that the email address associated with your account is correct under your Profile settings. Also make sure that emails from helpx-support@gmail.com are not blocked by your email provider.",
      },
      {
        q: "I forgot my password. How do I reset it?",
        a: "On the login page, click 'Forgot Password'. Enter your registered email address and we will send you a One-Time Password (OTP) valid for 10 minutes. Enter the OTP to verify your identity, then set a new password. If you do not receive the OTP, check your spam folder.",
      },
      {
        q: "Is my personal data safe on HelpX?",
        a: "Yes. HelpX takes data privacy seriously. Your personal information and complaint data are stored securely and are never shared with third parties. Passwords are hashed using bcrypt and access tokens are securely managed. For more details, please refer to our Privacy Policy.",
      },
    ],
  },
};

const categoryColors = {
  General: { active: "#2563EB", light: "#EFF6FF", text: "#2563EB" },
  Submission: { active: "#059669", light: "#ECFDF5", text: "#059669" },
  Tracking: { active: "#D97706", light: "#FFFBEB", text: "#D97706" },
  Technical: { active: "#7C3AED", light: "#F5F3FF", text: "#7C3AED" },
};

const AccordionItem = ({ question, answer, accentColor }) => {
  const [open, setOpen] = useState(false);
  return (
    <div
      onClick={() => setOpen((v) => !v)}
      style={{
        border: "1px solid",
        borderColor: open ? accentColor + "40" : "#F1F5F9",
        borderRadius: 10,
        marginBottom: 10,
        background: open ? accentColor + "06" : "#fff",
        cursor: "pointer",
        transition: "all 0.2s",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "14px 18px",
        }}
      >
        <span
          style={{
            fontSize: 14,
            fontWeight: 600,
            color: "#0F172A",
            flex: 1,
            paddingRight: 16,
            lineHeight: 1.5,
          }}
        >
          {question}
        </span>
        {open ? (
          <FiChevronUp
            style={{ color: accentColor, flexShrink: 0, fontSize: 18 }}
          />
        ) : (
          <FiChevronDown
            style={{ color: "#94A3B8", flexShrink: 0, fontSize: 18 }}
          />
        )}
      </div>
      {open && (
        <div
          style={{
            padding: "0 18px 16px",
            fontSize: 13.5,
            color: "#475569",
            lineHeight: 1.8,
            borderTop: `1px solid ${accentColor}20`,
          }}
        >
          <div style={{ paddingTop: 12 }}>{answer}</div>
        </div>
      )}
    </div>
  );
};

const FAQ = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeCategory, setActiveCategory] = useState("General");

  const categories = Object.keys(faqs);
  const current = faqs[activeCategory];
  const colors = categoryColors[activeCategory];

  return (
    <div
      className="h-screen flex flex-col overflow-hidden bg-gray-50"
      style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
    >
      <Topbar toggleSidebar={() => setSidebarOpen((v) => !v)} />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div
          className={`hidden md:block bg-white shadow transition-all duration-300 ${sidebarOpen ? "w-64" : "w-0 overflow-hidden"}`}
        >
          <Navbar />
        </div>

        {/* Main */}
        <main
          className="flex-1 overflow-y-auto px-6 py-8"
          style={{ background: "#F8FAFC" }}
        >
          <div style={{ maxWidth: 860, margin: "0 auto" }}>
            {/* Header */}
            <div style={{ marginBottom: 28 }}>
              <h1
                style={{
                  fontSize: 26,
                  fontWeight: 800,
                  color: "#0F172A",
                  margin: 0,
                }}
              >
                Frequently Asked Questions
              </h1>
              <p
                style={{
                  fontSize: 14,
                  color: "#64748B",
                  marginTop: 8,
                  lineHeight: 1.7,
                  maxWidth: 560,
                }}
              >
                Find detailed information about our institutional complaint
                processes, timelines, and technical requirements. Our goal is to
                ensure transparency and clarity at every step of your journey.
              </p>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "200px 1fr",
                gap: 24,
              }}
            >
              {/* Category Sidebar */}
              <div>
                <p
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    color: "#94A3B8",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    marginBottom: 10,
                  }}
                >
                  Categories
                </p>
                {categories.map((cat) => {
                  const isActive = activeCategory === cat;
                  const c = categoryColors[cat];
                  return (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        width: "100%",
                        padding: "9px 14px",
                        borderRadius: 8,
                        border: "none",
                        cursor: "pointer",
                        textAlign: "left",
                        marginBottom: 4,
                        background: isActive ? c.active : "transparent",
                        color: isActive ? "#fff" : "#475569",
                        fontWeight: isActive ? 700 : 400,
                        fontSize: 13.5,
                        transition: "all 0.15s",
                      }}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>

              {/* FAQ Content */}
              <div>
                {/* Section Header */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 16,
                  }}
                >
                  {current.icon}
                  <h2
                    style={{
                      fontSize: 17,
                      fontWeight: 700,
                      color: "#0F172A",
                      margin: 0,
                    }}
                  >
                    {activeCategory === "General" && "General Information"}
                    {activeCategory === "Submission" && "Submitting Complaints"}
                    {activeCategory === "Tracking" && "Tracking & Status"}
                    {activeCategory === "Technical" && "Technical Support"}
                  </h2>
                </div>

                {/* Accordion */}
                {current.questions.map((item, i) => (
                  <AccordionItem
                    key={i}
                    question={item.q}
                    answer={item.a}
                    accentColor={colors.active}
                  />
                ))}

                {/* Still need help */}
                <div
                  style={{
                    marginTop: 32,
                    background: "linear-gradient(135deg,#2563EB,#4F46E5)",
                    borderRadius: 14,
                    padding: "28px 32px",
                    color: "#fff",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <div
                      style={{ fontSize: 17, fontWeight: 700, marginBottom: 6 }}
                    >
                      Still need help?
                    </div>
                    <div
                      style={{ fontSize: 13.5, opacity: 0.85, lineHeight: 1.6 }}
                    >
                      Can't find the answer you're looking for? Reach out to our
                      support team and we'll get back to you as soon as
                      possible.
                    </div>
                  </div>
                  <a
                    href="mailto:support@helpx.com"
                    style={{
                      flexShrink: 0,
                      marginLeft: 24,
                      background: "#fff",
                      color: "#2563EB",
                      padding: "10px 20px",
                      borderRadius: 8,
                      fontSize: 13.5,
                      fontWeight: 700,
                      textDecoration: "none",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Contact Support
                  </a>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default FAQ;
