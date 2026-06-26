import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// ⚠️ Adjust these two import paths to match where these files actually live in your project
import Navbar from "../components/Navbar";
import Topbar from "../components/Topbar";

// ── Axios helper ──────────────────────────────────────────────
const api = (token) => ({
  headers: { Authorization: `Bearer ${token}` },
});

// ── Tiny helpers ──────────────────────────────────────────────
const avatar = (name = "") =>
  name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

const avatarColor = (name = "") => {
  const colors = [
    ["#E0E7FF", "#4338CA"],
    ["#FCE7F3", "#BE185D"],
    ["#D1FAE5", "#065F46"],
    ["#FEF3C7", "#92400E"],
    ["#EDE9FE", "#6D28D9"],
    ["#FFE4E6", "#9F1239"],
  ];
  if (!name || name.length === 0) return colors[0];
  const i = name.charCodeAt(0) % colors.length;
  return colors[i] ?? colors[0];
};

const statusMeta = {
  pending: {
    label: "Pending",
    color: "#D97706",
    bg: "#FEF3C7",
    dot: "#F59E0B",
  },
  "in-progress": {
    label: "In Progress",
    color: "#1D4ED8",
    bg: "#DBEAFE",
    dot: "#3B82F6",
  },
  resolved: {
    label: "Resolved",
    color: "#065F46",
    bg: "#D1FAE5",
    dot: "#10B981",
  },
  rejected: {
    label: "Rejected",
    color: "#9F1239",
    bg: "#FFE4E6",
    dot: "#F43F5E",
  },
};

// ── Stat Card ─────────────────────────────────────────────────
const StatCard = ({ label, value, sub, subColor, accent, icon }) => (
  <div
    style={{
      background: "#fff",
      borderRadius: 12,
      border: "1px solid #F1F5F9",
      padding: "20px 22px",
      display: "flex",
      flexDirection: "column",
      gap: 6,
      boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
    }}
  >
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
      }}
    >
      <span
        style={{
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: "0.07em",
          color: accent,
          background: accent + "18",
          padding: "3px 8px",
          borderRadius: 20,
          textTransform: "uppercase",
        }}
      >
        {label}
      </span>
      <span style={{ fontSize: 18 }}>{icon}</span>
    </div>
    <div
      style={{
        fontSize: 36,
        fontWeight: 800,
        color: "#0F172A",
        lineHeight: 1.1,
      }}
    >
      {value}
    </div>
    {sub && (
      <div style={{ fontSize: 12, color: subColor || "#64748B" }}>{sub}</div>
    )}
  </div>
);

// ── Status Badge ──────────────────────────────────────────────
const Badge = ({ status }) => {
  const m = statusMeta[status] || {
    label: status,
    color: "#64748B",
    bg: "#F8FAFC",
    dot: "#94A3B8",
  };
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        background: m.bg,
        color: m.color,
        padding: "3px 10px",
        borderRadius: 20,
        fontSize: 12,
        fontWeight: 600,
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: m.dot,
          display: "inline-block",
        }}
      />
      {m.label}
    </span>
  );
};

// ── Bar Chart ─────────────────────────────────────────────────
const BarChart = ({ counts }) => {
  const bars = [
    { label: "Pending", value: counts.pending || 0, color: "#F59E0B" },
    { label: "In Progress", value: counts.inProgress || 0, color: "#3B82F6" },
    { label: "Resolved", value: counts.resolved || 0, color: "#10B981" },
    { label: "Rejected", value: counts.rejected || 0, color: "#F43F5E" },
  ];
  const max = Math.max(...bars.map((b) => b.value), 1);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-end",
        gap: 20,
        height: 140,
        padding: "0 8px",
      }}
    >
      {bars.map((b) => (
        <div
          key={b.label}
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 6,
          }}
        >
          <span style={{ fontSize: 12, fontWeight: 700, color: "#0F172A" }}>
            {b.value}
          </span>
          <div
            style={{
              width: "100%",
              borderRadius: "6px 6px 0 0",
              background: b.color + "22",
              position: "relative",
              height: Math.max((b.value / max) * 100, 4),
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                background: b.color,
                borderRadius: "6px 6px 0 0",
                height: "100%",
                opacity: 0.85,
              }}
            />
          </div>
          <span
            style={{
              fontSize: 10,
              color: "#94A3B8",
              fontWeight: 600,
              textAlign: "center",
              lineHeight: 1.3,
            }}
          >
            {b.label}
          </span>
        </div>
      ))}
    </div>
  );
};

// ── Main Component ────────────────────────────────────────────
const AdminDashboard = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");

  const [activeNav, setActiveNav] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Data states
  const [complaints, setComplaints] = useState([]);
  const [recentComplaints, setRecentComplaints] = useState([]);
  const [users, setUsers] = useState([]);
  const [loadingComplaints, setLoadingComplaints] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);

  // Complaint status dropdown
  const [updatingId, setUpdatingId] = useState(null);

  // User management filter
  const [roleFilter, setRoleFilter] = useState("all");
  const [userPage, setUserPage] = useState(1);
  const USERS_PER_PAGE = 5;

  // Complaint list filter
  const [statusFilter, setStatusFilter] = useState("all");
  const [complaintPage, setComplaintPage] = useState(1);
  const COMPLAINTS_PER_PAGE = 7;

  // ── Fetch all complaints ──
  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get(
          "/api/complaint/all-complaints",
          api(token),
        );
        if (res.data.success) setComplaints(res.data.complaints);
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingComplaints(false);
      }
    };
    fetch();
  }, []);

  // ── Fetch recent complaints ──
  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get(
          "/api/complaint/recent-complaints",
          api(token),
        );
        if (res.data.success) setRecentComplaints(res.data.complaints);
      } catch (e) {
        console.error(e);
      }
    };
    fetch();
  }, []);

  // ── Fetch users ──
  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get("/api/auth/all-users", api(token));
        if (res.data.success) setUsers(res.data.users);
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingUsers(false);
      }
    };
    fetch();
  }, []);

  // ── Update complaint status ──
  const updateStatus = async (id, status) => {
    setUpdatingId(id);
    try {
      await axios.patch(
        `/api/complaint/update-status/${id}`,
        { status },
        api(token),
      );
      setComplaints((prev) =>
        prev.map((c) => (c._id === id ? { ...c, status } : c)),
      );
    } catch (e) {
      console.error(e);
    } finally {
      setUpdatingId(null);
    }
  };

  // ── Counts ──
  const counts = {
    total: complaints.length,
    pending: complaints.filter((c) => c.status === "pending").length,
    inProgress: complaints.filter((c) => c.status === "in-progress").length,
    resolved: complaints.filter((c) => c.status === "resolved").length,
    rejected: complaints.filter((c) => c.status === "rejected").length,
  };

  // ── Filtered complaints ──
  const filteredComplaints =
    statusFilter === "all"
      ? complaints
      : complaints.filter((c) => c.status === statusFilter);
  const totalComplaintPages = Math.ceil(
    filteredComplaints.length / COMPLAINTS_PER_PAGE,
  );
  const paginatedComplaints = filteredComplaints.slice(
    (complaintPage - 1) * COMPLAINTS_PER_PAGE,
    complaintPage * COMPLAINTS_PER_PAGE,
  );

  // ── Filtered users ──
  const filteredUsers =
    roleFilter === "all"
      ? users
      : users.filter((u) => (u.role || "user") === roleFilter);
  const totalUserPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE);
  const paginatedUsers = filteredUsers.slice(
    (userPage - 1) * USERS_PER_PAGE,
    userPage * USERS_PER_PAGE,
  );

  // ── Styles ──
  const tableHead = {
    padding: "10px 14px",
    fontSize: 11,
    fontWeight: 700,
    color: "#94A3B8",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    borderBottom: "1px solid #F1F5F9",
    background: "#FAFAFA",
  };
  const tableCell = {
    padding: "14px 14px",
    fontSize: 13.5,
    color: "#334155",
    borderBottom: "1px solid #F8FAFC",
    verticalAlign: "middle",
  };

  return (
    // Top-level wrapper is now a COLUMN (h-screen flex flex-col), same as UserDashboard.
    // Topbar sits here directly — full width, above everything else.
    <div
      className="h-screen flex flex-col overflow-hidden"
      style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
    >
      {/* Topbar: full-width, top-level sibling — same placement as UserDashboard */}
      <Topbar toggleSidebar={() => setSidebarOpen((v) => !v)} />

      {/* Row below the Topbar: sidebar + main content side-by-side */}
      <div className="flex flex-1 overflow-hidden">
        {/* Your sidebar/nav component. Toggled by the Topbar's hamburger button. */}
        {sidebarOpen && (
          <div className="w-64 flex-shrink-0 overflow-y-auto border-r border-gray-100">
            <Navbar />
          </div>
        )}

        {/* Page content */}
        <main
          style={{
            flex: 1,
            overflow: "auto",
            padding: "28px 32px",
            background: "#F8FAFC",
          }}
        >
          {/* ── Admin section switcher ─────────────────────────────────
              Your Navbar's links point to user-facing routes (MyComplaint,
              FAQ, Profile), not these 3 admin views — they were previously
              tabs in local state, not routes. This keeps all 3 reachable.
              Delete this block if you handle admin navigation elsewhere. */}
          <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
            {[
              { id: "dashboard", label: "Dashboard" },
              { id: "users", label: "User Management" },
              { id: "complaints", label: "Complaint Reports" },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveNav(t.id)}
                style={{
                  padding: "6px 16px",
                  borderRadius: 20,
                  fontSize: 12.5,
                  cursor: "pointer",
                  fontWeight: activeNav === t.id ? 700 : 500,
                  border: activeNav === t.id ? "none" : "1px solid #E2E8F0",
                  background: activeNav === t.id ? "#2563EB" : "#fff",
                  color: activeNav === t.id ? "#fff" : "#475569",
                }}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* ══ DASHBOARD ══════════════════════════════════════════════ */}
          {activeNav === "dashboard" && (
            <>
              <div style={{ marginBottom: 24 }}>
                <h1
                  style={{
                    fontSize: 24,
                    fontWeight: 800,
                    color: "#0F172A",
                    margin: 0,
                  }}
                >
                  Institutional Oversight
                </h1>
                <p
                  style={{
                    fontSize: 13.5,
                    color: "#64748B",
                    margin: "4px 0 0",
                  }}
                >
                  Real-time complaint monitoring and administrative governance
                  dashboard.
                </p>
              </div>

              {/* Stat Cards */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4,1fr)",
                  gap: 16,
                  marginBottom: 24,
                }}
              >
                <StatCard
                  label="Awaiting Review"
                  value={counts.pending}
                  icon="📥"
                  accent="#D97706"
                  sub={`${counts.total} total complaints`}
                />
                <StatCard
                  label="Active Process"
                  value={counts.inProgress}
                  icon="⚙️"
                  accent="#2563EB"
                  sub="Currently being handled"
                />
                <StatCard
                  label="Validated"
                  value={counts.resolved}
                  icon="✅"
                  accent="#059669"
                  sub="Successfully closed"
                  subColor="#059669"
                />
                <StatCard
                  label="Dismissed"
                  value={counts.rejected}
                  icon="❌"
                  accent="#E11D48"
                  sub="Reviewed and rejected"
                  subColor="#E11D48"
                />
              </div>

              {/* Chart + Efficiency */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 320px",
                  gap: 16,
                  marginBottom: 24,
                }}
              >
                <div
                  style={{
                    background: "#fff",
                    borderRadius: 12,
                    border: "1px solid #F1F5F9",
                    padding: "22px 24px",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      marginBottom: 20,
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontWeight: 700,
                          fontSize: 15,
                          color: "#0F172A",
                        }}
                      >
                        Complaint Distribution
                      </div>
                      <div
                        style={{ fontSize: 12, color: "#94A3B8", marginTop: 2 }}
                      >
                        System-wide status breakdown
                      </div>
                    </div>
                    <span
                      style={{
                        fontSize: 12,
                        color: "#2563EB",
                        background: "#EFF6FF",
                        padding: "4px 10px",
                        borderRadius: 6,
                        fontWeight: 600,
                      }}
                    >
                      All Time
                    </span>
                  </div>
                  <BarChart counts={counts} />
                </div>

                <div
                  style={{
                    background: "linear-gradient(135deg,#2563EB,#4F46E5)",
                    borderRadius: 12,
                    padding: "24px",
                    color: "#fff",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <div>
                    <div style={{ fontSize: 22, marginBottom: 8 }}>📈</div>
                    <div
                      style={{
                        fontWeight: 700,
                        fontSize: 16,
                        marginBottom: 10,
                      }}
                    >
                      Institutional Efficiency Rating
                    </div>
                    <div
                      style={{ fontSize: 13, opacity: 0.85, lineHeight: 1.6 }}
                    >
                      {counts.total > 0
                        ? `The system is currently operating at ${Math.round((counts.resolved / counts.total) * 100)}% resolution efficiency.`
                        : "No complaints in the system yet."}
                    </div>
                  </div>
                  <div style={{ marginTop: 20 }}>
                    <div
                      style={{
                        fontSize: 11,
                        opacity: 0.6,
                        marginBottom: 6,
                        letterSpacing: "0.08em",
                      }}
                    >
                      SYSTEM HEALTH INDEX
                    </div>
                    <div
                      style={{
                        background: "rgba(255,255,255,0.2)",
                        borderRadius: 4,
                        height: 6,
                      }}
                    >
                      <div
                        style={{
                          background: "#fff",
                          borderRadius: 4,
                          height: 6,
                          width: `${counts.total > 0 ? Math.round((counts.resolved / counts.total) * 100) : 0}%`,
                          transition: "width 0.6s ease",
                        }}
                      />
                    </div>
                    <div style={{ fontSize: 11, opacity: 0.7, marginTop: 6 }}>
                      SYSTEM_HEALTH_INDEX:{" "}
                      {counts.resolved >= counts.pending
                        ? "STABLE"
                        : "NEEDS ATTENTION"}
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Complaints */}
              <div
                style={{
                  background: "#fff",
                  borderRadius: 12,
                  border: "1px solid #F1F5F9",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    padding: "18px 24px",
                    borderBottom: "1px solid #F1F5F9",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontWeight: 700,
                        fontSize: 15,
                        color: "#0F172A",
                      }}
                    >
                      Recent Complaints
                    </div>
                    <div
                      style={{ fontSize: 12, color: "#94A3B8", marginTop: 2 }}
                    >
                      Latest 5 submissions across the system
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveNav("complaints")}
                    style={{
                      border: "1px solid #E2E8F0",
                      background: "#fff",
                      padding: "6px 14px",
                      borderRadius: 7,
                      fontSize: 12.5,
                      color: "#2563EB",
                      cursor: "pointer",
                      fontWeight: 600,
                    }}
                  >
                    View all →
                  </button>
                </div>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr>
                      {[
                        "Complaint",
                        "Filed By",
                        "Priority",
                        "Status",
                        "Date",
                      ].map((h) => (
                        <th key={h} style={tableHead}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {loadingComplaints ? (
                      <tr>
                        <td
                          colSpan={5}
                          style={{
                            textAlign: "center",
                            padding: 24,
                            color: "#94A3B8",
                          }}
                        >
                          Loading…
                        </td>
                      </tr>
                    ) : (
                      complaints.slice(0, 5).map((c) => (
                        <tr key={c._id} style={{ cursor: "pointer" }}>
                          <td style={tableCell}>
                            <div
                              style={{
                                fontWeight: 600,
                                color: "#0F172A",
                                fontSize: 13.5,
                              }}
                            >
                              {c.title}
                            </div>
                            <div style={{ fontSize: 11.5, color: "#94A3B8" }}>
                              #{c._id?.slice(-6).toUpperCase()}
                            </div>
                          </td>
                          <td style={tableCell}>{c.userID?.name || "—"}</td>
                          <td style={tableCell}>
                            <span
                              style={{
                                fontSize: 12,
                                fontWeight: 600,
                                padding: "3px 10px",
                                borderRadius: 20,
                                background:
                                  c.priority === "High"
                                    ? "#FFE4E6"
                                    : c.priority === "Medium"
                                      ? "#FEF3C7"
                                      : "#D1FAE5",
                                color:
                                  c.priority === "High"
                                    ? "#9F1239"
                                    : c.priority === "Medium"
                                      ? "#92400E"
                                      : "#065F46",
                              }}
                            >
                              {c.priority || "Low"}
                            </span>
                          </td>
                          <td style={tableCell}>
                            <Badge status={c.status} />
                          </td>
                          <td style={tableCell}>
                            {new Date(c.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* ══ COMPLAINTS ══════════════════════════════════════════════ */}
          {activeNav === "complaints" && (
            <>
              <div
                style={{
                  marginBottom: 24,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-end",
                }}
              >
                <div>
                  <h1
                    style={{
                      fontSize: 22,
                      fontWeight: 800,
                      color: "#0F172A",
                      margin: 0,
                    }}
                  >
                    Complaint Reports
                  </h1>
                  <p
                    style={{
                      fontSize: 13,
                      color: "#64748B",
                      margin: "4px 0 0",
                    }}
                  >
                    Manage and update the status of all complaints across the
                    system.
                  </p>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  {[
                    "all",
                    "pending",
                    "in-progress",
                    "resolved",
                    "rejected",
                  ].map((s) => (
                    <button
                      key={s}
                      onClick={() => {
                        setStatusFilter(s);
                        setComplaintPage(1);
                      }}
                      style={{
                        padding: "6px 14px",
                        borderRadius: 20,
                        fontSize: 12.5,
                        cursor: "pointer",
                        fontWeight: statusFilter === s ? 700 : 500,
                        border:
                          statusFilter === s ? "none" : "1px solid #E2E8F0",
                        background: statusFilter === s ? "#2563EB" : "#fff",
                        color: statusFilter === s ? "#fff" : "#475569",
                        textTransform: "capitalize",
                      }}
                    >
                      {s.replace("-", " ")}
                    </button>
                  ))}
                </div>
              </div>

              <div
                style={{
                  background: "#fff",
                  borderRadius: 12,
                  border: "1px solid #F1F5F9",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                  overflow: "hidden",
                }}
              >
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr>
                      {[
                        "Complaint",
                        "Filed By",
                        "Priority",
                        "Status",
                        "Date",
                        "Actions",
                      ].map((h) => (
                        <th key={h} style={tableHead}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {loadingComplaints ? (
                      <tr>
                        <td
                          colSpan={6}
                          style={{
                            textAlign: "center",
                            padding: 32,
                            color: "#94A3B8",
                          }}
                        >
                          Loading complaints…
                        </td>
                      </tr>
                    ) : paginatedComplaints.length === 0 ? (
                      <tr>
                        <td
                          colSpan={6}
                          style={{
                            textAlign: "center",
                            padding: 32,
                            color: "#94A3B8",
                          }}
                        >
                          No complaints found
                        </td>
                      </tr>
                    ) : (
                      paginatedComplaints.map((c) => (
                        <tr key={c._id}>
                          <td style={tableCell}>
                            <div style={{ fontWeight: 600, color: "#0F172A" }}>
                              {c.title}
                            </div>
                            <div
                              style={{
                                fontSize: 11.5,
                                color: "#94A3B8",
                                marginTop: 2,
                              }}
                            >
                              #{c._id?.slice(-6).toUpperCase()}
                            </div>
                          </td>
                          <td style={tableCell}>
                            <div style={{ fontWeight: 500 }}>
                              {c.userID?.name || "—"}
                            </div>
                            <div style={{ fontSize: 11.5, color: "#94A3B8" }}>
                              {c.userID?.email || ""}
                            </div>
                          </td>
                          <td style={tableCell}>
                            <span
                              style={{
                                fontSize: 12,
                                fontWeight: 600,
                                padding: "3px 10px",
                                borderRadius: 20,
                                background:
                                  c.priority === "High"
                                    ? "#FFE4E6"
                                    : c.priority === "Medium"
                                      ? "#FEF3C7"
                                      : "#D1FAE5",
                                color:
                                  c.priority === "High"
                                    ? "#9F1239"
                                    : c.priority === "Medium"
                                      ? "#92400E"
                                      : "#065F46",
                              }}
                            >
                              {c.priority || "Low"}
                            </span>
                          </td>
                          <td style={tableCell}>
                            <Badge status={c.status} />
                          </td>
                          <td style={tableCell}>
                            {new Date(c.createdAt).toLocaleDateString()}
                          </td>
                          <td style={tableCell}>
                            <select
                              value={c.status}
                              disabled={updatingId === c._id}
                              onChange={(e) =>
                                updateStatus(c._id, e.target.value)
                              }
                              style={{
                                border: "1px solid #E2E8F0",
                                borderRadius: 7,
                                padding: "5px 10px",
                                fontSize: 12.5,
                                cursor: "pointer",
                                background: "#F8FAFC",
                                color: "#334155",
                                outline: "none",
                                opacity: updatingId === c._id ? 0.5 : 1,
                              }}
                            >
                              <option value="pending">Pending</option>
                              <option value="in-progress">In Progress</option>
                              <option value="resolved">Resolved</option>
                              <option value="rejected">Rejected</option>
                            </select>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>

                {/* Pagination */}
                {totalComplaintPages > 1 && (
                  <div
                    style={{
                      padding: "14px 20px",
                      borderTop: "1px solid #F1F5F9",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span style={{ fontSize: 12.5, color: "#94A3B8" }}>
                      Showing {(complaintPage - 1) * COMPLAINTS_PER_PAGE + 1}–
                      {Math.min(
                        complaintPage * COMPLAINTS_PER_PAGE,
                        filteredComplaints.length,
                      )}{" "}
                      of {filteredComplaints.length}
                    </span>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button
                        onClick={() =>
                          setComplaintPage((p) => Math.max(1, p - 1))
                        }
                        disabled={complaintPage === 1}
                        style={{
                          border: "1px solid #E2E8F0",
                          background: "#fff",
                          borderRadius: 6,
                          padding: "4px 12px",
                          cursor: "pointer",
                          fontSize: 13,
                          color: "#475569",
                          opacity: complaintPage === 1 ? 0.4 : 1,
                        }}
                      >
                        ←
                      </button>
                      {Array.from(
                        { length: totalComplaintPages },
                        (_, i) => i + 1,
                      ).map((p) => (
                        <button
                          key={p}
                          onClick={() => setComplaintPage(p)}
                          style={{
                            border: "none",
                            borderRadius: 6,
                            padding: "4px 10px",
                            cursor: "pointer",
                            fontSize: 13,
                            background:
                              complaintPage === p ? "#2563EB" : "#F1F5F9",
                            color: complaintPage === p ? "#fff" : "#475569",
                            fontWeight: complaintPage === p ? 700 : 400,
                          }}
                        >
                          {p}
                        </button>
                      ))}
                      <button
                        onClick={() =>
                          setComplaintPage((p) =>
                            Math.min(totalComplaintPages, p + 1),
                          )
                        }
                        disabled={complaintPage === totalComplaintPages}
                        style={{
                          border: "1px solid #E2E8F0",
                          background: "#fff",
                          borderRadius: 6,
                          padding: "4px 12px",
                          cursor: "pointer",
                          fontSize: 13,
                          color: "#475569",
                          opacity:
                            complaintPage === totalComplaintPages ? 0.4 : 1,
                        }}
                      >
                        →
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {/* ══ USERS ══════════════════════════════════════════════════ */}
          {activeNav === "users" && (
            <>
              <div
                style={{
                  marginBottom: 24,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-end",
                }}
              >
                <div>
                  <h1
                    style={{
                      fontSize: 22,
                      fontWeight: 800,
                      color: "#0F172A",
                      margin: 0,
                    }}
                  >
                    User Management
                  </h1>
                  <p
                    style={{
                      fontSize: 13,
                      color: "#64748B",
                      margin: "4px 0 0",
                    }}
                  >
                    Audit and permission control for registered stakeholders.
                  </p>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  {["all", "user", "admin"].map((r) => (
                    <button
                      key={r}
                      onClick={() => {
                        setRoleFilter(r);
                        setUserPage(1);
                      }}
                      style={{
                        padding: "6px 16px",
                        borderRadius: 20,
                        fontSize: 12.5,
                        cursor: "pointer",
                        fontWeight: roleFilter === r ? 700 : 500,
                        border: roleFilter === r ? "none" : "1px solid #E2E8F0",
                        background: roleFilter === r ? "#2563EB" : "#fff",
                        color: roleFilter === r ? "#fff" : "#475569",
                        textTransform: "capitalize",
                      }}
                    >
                      Filter by {r === "all" ? "Role" : r}
                    </button>
                  ))}
                </div>
              </div>

              <div
                style={{
                  background: "#fff",
                  borderRadius: 12,
                  border: "1px solid #F1F5F9",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                  overflow: "hidden",
                }}
              >
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr>
                      {[
                        "Full Name",
                        "Email",
                        "Current Role",
                        "Join Date",
                        "Administrative Actions",
                      ].map((h) => (
                        <th key={h} style={tableHead}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {loadingUsers ? (
                      <tr>
                        <td
                          colSpan={5}
                          style={{
                            textAlign: "center",
                            padding: 32,
                            color: "#94A3B8",
                          }}
                        >
                          Loading users…
                        </td>
                      </tr>
                    ) : paginatedUsers.length === 0 ? (
                      <tr>
                        <td
                          colSpan={5}
                          style={{
                            textAlign: "center",
                            padding: 32,
                            color: "#94A3B8",
                          }}
                        >
                          No users found
                        </td>
                      </tr>
                    ) : (
                      paginatedUsers.map((u) => {
                        const [bg, fg] = avatarColor(u.name || "");
                        return (
                          <tr key={u._id}>
                            <td style={tableCell}>
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 10,
                                }}
                              >
                                <div
                                  style={{
                                    width: 34,
                                    height: 34,
                                    borderRadius: "50%",
                                    background: bg,
                                    color: fg,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontWeight: 700,
                                    fontSize: 12,
                                    flexShrink: 0,
                                  }}
                                >
                                  {avatar(u.name)}
                                </div>
                                <span
                                  style={{ fontWeight: 600, color: "#0F172A" }}
                                >
                                  {u.name}
                                </span>
                              </div>
                            </td>
                            <td style={{ ...tableCell, color: "#2563EB" }}>
                              {u.email}
                            </td>
                            <td style={tableCell}>
                              <span
                                style={{
                                  fontSize: 11.5,
                                  fontWeight: 700,
                                  padding: "3px 10px",
                                  borderRadius: 20,
                                  background:
                                    u.role === "admin" ? "#EDE9FE" : "#F1F5F9",
                                  color:
                                    u.role === "admin" ? "#6D28D9" : "#475569",
                                  textTransform: "uppercase",
                                  letterSpacing: "0.05em",
                                }}
                              >
                                {u.role || "user"}
                              </span>
                            </td>
                            <td style={tableCell}>
                              {u.createdAt
                                ? new Date(u.createdAt).toLocaleDateString(
                                    "en-US",
                                    {
                                      day: "2-digit",
                                      month: "short",
                                      year: "numeric",
                                    },
                                  )
                                : "—"}
                            </td>
                            <td style={tableCell}>
                              {u.role === "admin" ? (
                                <span
                                  style={{ fontSize: 12.5, color: "#94A3B8" }}
                                >
                                  Manage Access ⋮
                                </span>
                              ) : (
                                <button
                                  style={{
                                    border: "1px solid #E2E8F0",
                                    borderRadius: 7,
                                    padding: "5px 14px",
                                    fontSize: 12.5,
                                    cursor: "pointer",
                                    background: "#fff",
                                    color: "#2563EB",
                                    fontWeight: 600,
                                  }}
                                >
                                  ⬆ Upgrade to Admin
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>

                {/* Pagination */}
                <div
                  style={{
                    padding: "14px 20px",
                    borderTop: "1px solid #F1F5F9",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span style={{ fontSize: 12.5, color: "#94A3B8" }}>
                    Displaying {paginatedUsers.length} of {filteredUsers.length}{" "}
                    system users
                  </span>
                  {totalUserPages > 1 && (
                    <div style={{ display: "flex", gap: 6 }}>
                      <button
                        onClick={() => setUserPage((p) => Math.max(1, p - 1))}
                        disabled={userPage === 1}
                        style={{
                          border: "1px solid #E2E8F0",
                          background: "#fff",
                          borderRadius: 6,
                          padding: "4px 12px",
                          cursor: "pointer",
                          fontSize: 13,
                          opacity: userPage === 1 ? 0.4 : 1,
                        }}
                      >
                        ←
                      </button>
                      {Array.from(
                        { length: totalUserPages },
                        (_, i) => i + 1,
                      ).map((p) => (
                        <button
                          key={p}
                          onClick={() => setUserPage(p)}
                          style={{
                            border: "none",
                            borderRadius: 6,
                            padding: "4px 10px",
                            cursor: "pointer",
                            fontSize: 13,
                            background: userPage === p ? "#2563EB" : "#F1F5F9",
                            color: userPage === p ? "#fff" : "#475569",
                            fontWeight: userPage === p ? 700 : 400,
                          }}
                        >
                          {p}
                        </button>
                      ))}
                      <button
                        onClick={() =>
                          setUserPage((p) => Math.min(totalUserPages, p + 1))
                        }
                        disabled={userPage === totalUserPages}
                        style={{
                          border: "1px solid #E2E8F0",
                          background: "#fff",
                          borderRadius: 6,
                          padding: "4px 12px",
                          cursor: "pointer",
                          fontSize: 13,
                          opacity: userPage === totalUserPages ? 0.4 : 1,
                        }}
                      >
                        →
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
