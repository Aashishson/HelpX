import { useState, useEffect } from "react";
import api from "../../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Topbar from "../components/Topbar";

const avatar = (name = "") => {
  if (!name) return "?";
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
};

const avatarColor = (name = "") => {
  const palette = [
    ["#E0E7FF", "#4338CA"],
    ["#FCE7F3", "#BE185D"],
    ["#D1FAE5", "#065F46"],
    ["#FEF3C7", "#92400E"],
    ["#EDE9FE", "#6D28D9"],
    ["#FFE4E6", "#9F1239"],
  ];
  if (!name || name.length === 0) return palette[0];
  return palette[name.charCodeAt(0) % palette.length] ?? palette[0];
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

const PriorityBadge = ({ priority }) => (
  <span
    style={{
      fontSize: 12,
      fontWeight: 600,
      padding: "3px 10px",
      borderRadius: 20,
      background:
        priority === "High"
          ? "#FFE4E6"
          : priority === "Medium"
            ? "#FEF3C7"
            : "#D1FAE5",
      color:
        priority === "High"
          ? "#9F1239"
          : priority === "Medium"
            ? "#92400E"
            : "#065F46",
    }}
  >
    {priority || "Low"}
  </span>
);

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [activeNav, setActiveNav] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [complaints, setComplaints] = useState([]);
  const [users, setUsers] = useState([]);
  const [loadingComplaints, setLoadingComplaints] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [togglingRoleId, setTogglingRoleId] = useState(null);
  const [roleFilter, setRoleFilter] = useState("all");
  const [userPage, setUserPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");
  const [complaintPage, setComplaintPage] = useState(1);

  const USERS_PER_PAGE = 5;
  const COMPLAINTS_PER_PAGE = 7;

  useEffect(() => {
    api
      .get("/api/complaint/all-complaints")
      .then((res) => {
        if (res.data.success) setComplaints(res.data.complaints);
      })
      .catch(console.error)
      .finally(() => setLoadingComplaints(false));
  }, []);

  useEffect(() => {
    api
      .get("/api/auth/all-users")
      .then((res) => {
        if (res.data.success) setUsers(res.data.users);
      })
      .catch(console.error)
      .finally(() => setLoadingUsers(false));
  }, []);

  const updateStatus = async (id, status) => {
    setUpdatingId(id);
    try {
      await api.patch(`/api/complaint/update-status/${id}`, { status });
      setComplaints((prev) =>
        prev.map((c) => (c._id === id ? { ...c, status } : c)),
      );
    } catch (e) {
      console.error(e);
    } finally {
      setUpdatingId(null);
    }
  };

  const toggleRole = async (userId) => {
    setTogglingRoleId(userId);
    try {
      const res = await api.patch(`/api/auth/toggle-role/${userId}`, {});
      if (res.data.success) {
        setUsers((prev) =>
          prev.map((u) =>
            u._id === userId ? { ...u, role: res.data.role } : u,
          ),
        );
      }
    } catch (e) {
      console.error("Toggle role failed:", e);
    } finally {
      setTogglingRoleId(null);
    }
  };

  const counts = {
    total: complaints.length,
    pending: complaints.filter((c) => c.status === "pending").length,
    inProgress: complaints.filter((c) => c.status === "in-progress").length,
    resolved: complaints.filter((c) => c.status === "resolved").length,
    rejected: complaints.filter((c) => c.status === "rejected").length,
  };

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

  const filteredUsers =
    roleFilter === "all"
      ? users
      : users.filter((u) => (u.role || "user") === roleFilter);
  const totalUserPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE);
  const paginatedUsers = filteredUsers.slice(
    (userPage - 1) * USERS_PER_PAGE,
    userPage * USERS_PER_PAGE,
  );

  const tableHead = {
    padding: "11px 16px",
    fontSize: 11,
    fontWeight: 700,
    color: "#94A3B8",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    borderBottom: "1px solid #F1F5F9",
    background: "#FAFAFA",
    whiteSpace: "nowrap",
    textAlign: "left",
  };
  const tableCell = {
    padding: "14px 16px",
    fontSize: 13.5,
    color: "#334155",
    borderBottom: "1px solid #F8FAFC",
    verticalAlign: "middle",
    textAlign: "left",
  };

  const Pagination = ({ page, totalPages, onPageChange }) => (
    <div style={{ display: "flex", gap: 6 }}>
      <button
        onClick={() => onPageChange(Math.max(1, page - 1))}
        disabled={page === 1}
        style={{
          border: "1px solid #E2E8F0",
          background: "#fff",
          borderRadius: 6,
          padding: "4px 12px",
          cursor: "pointer",
          fontSize: 13,
          opacity: page === 1 ? 0.4 : 1,
        }}
      >
        ←
      </button>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          style={{
            border: "none",
            borderRadius: 6,
            padding: "4px 10px",
            cursor: "pointer",
            fontSize: 13,
            background: page === p ? "#2563EB" : "#F1F5F9",
            color: page === p ? "#fff" : "#475569",
            fontWeight: page === p ? 700 : 400,
          }}
        >
          {p}
        </button>
      ))}
      <button
        onClick={() => onPageChange(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        style={{
          border: "1px solid #E2E8F0",
          background: "#fff",
          borderRadius: 6,
          padding: "4px 12px",
          cursor: "pointer",
          fontSize: 13,
          opacity: page === totalPages ? 0.4 : 1,
        }}
      >
        →
      </button>
    </div>
  );

  return (
    <div
      className="h-screen flex flex-col overflow-hidden"
      style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
    >
      <Topbar toggleSidebar={() => setSidebarOpen((v) => !v)} />

      <div className="flex flex-1 overflow-hidden">
        {sidebarOpen && (
          <div className="w-64 flex-shrink-0 overflow-y-auto border-r border-gray-100">
            <Navbar />
          </div>
        )}

        <main
          style={{
            flex: 1,
            overflow: "auto",
            padding: "28px 32px",
            background: "#F8FAFC",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 20,
            }}
          >
            <div style={{ display: "flex", gap: 8 }}>
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

            <button
              onClick={() => navigate("/complaint")}
              style={{
                padding: "8px 18px",
                borderRadius: 8,
                fontSize: 13,
                cursor: "pointer",
                background: "#2563EB",
                color: "#fff",
                border: "none",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              + New Complaint
            </button>
          </div>

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
                      STATUS:{" "}
                      {counts.resolved >= counts.pending
                        ? "STABLE"
                        : "NEEDS ATTENTION"}
                    </div>
                  </div>
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
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    tableLayout: "fixed",
                  }}
                >
                  <colgroup>
                    <col style={{ width: "35%" }} />
                    <col style={{ width: "20%" }} />
                    <col style={{ width: "15%" }} />
                    <col style={{ width: "15%" }} />
                    <col style={{ width: "15%" }} />
                  </colgroup>
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
                        <tr
                          key={c._id}
                          onClick={() =>
                            navigate(`/complaint-details/${c._id}`)
                          }
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.background = "#F8FAFC")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.background = "")
                          }
                          style={{ cursor: "pointer" }}
                        >
                          <td
                            style={{
                              ...tableCell,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
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
                          <td
                            style={{
                              ...tableCell,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {c.userID?.UserName || c.userID?.name || "—"}
                          </td>
                          <td style={tableCell}>
                            <PriorityBadge priority={c.priority} />
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
                    Manage and update the status of all complaints.
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
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    tableLayout: "fixed",
                  }}
                >
                  <colgroup>
                    <col style={{ width: "28%" }} />
                    <col style={{ width: "22%" }} />
                    <col style={{ width: "12%" }} />
                    <col style={{ width: "13%" }} />
                    <col style={{ width: "12%" }} />
                    <col style={{ width: "13%" }} />
                  </colgroup>
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
                          Loading…
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
                        <tr
                          key={c._id}
                          onClick={() =>
                            navigate(`/complaint-details/${c._id}`)
                          }
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.background = "#F8FAFC")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.background = "")
                          }
                          style={{ cursor: "pointer" }}
                        >
                          <td style={{ ...tableCell, overflow: "hidden" }}>
                            <div
                              style={{
                                fontWeight: 600,
                                color: "#0F172A",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
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
                          <td style={{ ...tableCell, overflow: "hidden" }}>
                            <div
                              style={{
                                fontWeight: 500,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {c.userID?.UserName || c.userID?.name || "—"}
                            </div>
                            <div
                              style={{
                                fontSize: 11.5,
                                color: "#94A3B8",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {c.userID?.Email || c.userID?.email || ""}
                            </div>
                          </td>
                          <td style={tableCell}>
                            <PriorityBadge priority={c.priority} />
                          </td>
                          <td style={tableCell}>
                            <Badge status={c.status} />
                          </td>
                          <td style={tableCell}>
                            {new Date(c.createdAt).toLocaleDateString()}
                          </td>
                          <td
                            style={tableCell}
                            onClick={(e) => e.stopPropagation()}
                          >
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
                    <Pagination
                      page={complaintPage}
                      totalPages={totalComplaintPages}
                      onPageChange={setComplaintPage}
                    />
                  </div>
                )}
              </div>
            </>
          )}

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
                  {["all", "user", "Admin"].map((r) => (
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
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    tableLayout: "fixed",
                  }}
                >
                  <colgroup>
                    <col style={{ width: "22%" }} />
                    <col style={{ width: "28%" }} />
                    <col style={{ width: "14%" }} />
                    <col style={{ width: "14%" }} />
                    <col style={{ width: "22%" }} />
                  </colgroup>
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
                        const colorPair = avatarColor(
                          u.UserName || u.name || "",
                        );
                        const bg = colorPair[0];
                        const fg = colorPair[1];
                        const isAdmin = u.role === "Admin";
                        const isToggling = togglingRoleId === u._id;
                        return (
                          <tr
                            key={u._id}
                            onMouseEnter={(e) =>
                              (e.currentTarget.style.background = "#F8FAFC")
                            }
                            onMouseLeave={(e) =>
                              (e.currentTarget.style.background = "")
                            }
                          >
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
                                  {avatar(u.UserName || u.name)}
                                </div>
                                <span
                                  style={{
                                    fontWeight: 600,
                                    color: "#0F172A",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                  }}
                                >
                                  {u.UserName || u.name || "—"}
                                </span>
                              </div>
                            </td>
                            <td
                              style={{
                                ...tableCell,
                                color: "#2563EB",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {u.Email || u.email}
                            </td>
                            <td style={tableCell}>
                              <span
                                style={{
                                  fontSize: 11.5,
                                  fontWeight: 700,
                                  padding: "3px 10px",
                                  borderRadius: 20,
                                  background: isAdmin ? "#EDE9FE" : "#F1F5F9",
                                  color: isAdmin ? "#6D28D9" : "#475569",
                                  textTransform: "uppercase",
                                  letterSpacing: "0.05em",
                                }}
                              >
                                {u.role || "user"}
                              </span>
                            </td>
                            <td style={tableCell}>
                              {u.CreatedAt || u.createdAt
                                ? new Date(
                                    u.CreatedAt || u.createdAt,
                                  ).toLocaleDateString("en-US", {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                  })
                                : "—"}
                            </td>
                            <td style={tableCell}>
                              <button
                                onClick={() => toggleRole(u._id)}
                                disabled={isToggling}
                                style={{
                                  border: `1px solid ${isAdmin ? "#FECDD3" : "#BBF7D0"}`,
                                  borderRadius: 7,
                                  padding: "5px 14px",
                                  fontSize: 12.5,
                                  cursor: isToggling
                                    ? "not-allowed"
                                    : "pointer",
                                  background: isAdmin ? "#FFF1F2" : "#F0FDF4",
                                  color: isAdmin ? "#E11D48" : "#16A34A",
                                  fontWeight: 600,
                                  opacity: isToggling ? 0.6 : 1,
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 6,
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {isToggling ? (
                                  <>⏳ Updating…</>
                                ) : isAdmin ? (
                                  <>⬇ Demote to User</>
                                ) : (
                                  <>⬆ Upgrade to Admin</>
                                )}
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>

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
                    <Pagination
                      page={userPage}
                      totalPages={totalUserPages}
                      onPageChange={setUserPage}
                    />
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
