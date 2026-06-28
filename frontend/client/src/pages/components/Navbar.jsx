import logo from "../../assets/logo.png";
import { NavLink, useNavigate } from "react-router-dom";
import { getUserRole } from "../../utils/auth";

function Navbar() {
  const role = getUserRole();
  const isAdmin = role === "Admin";

  const navItem =
    "pt-3 flex items-center gap-2 w-40 px-3 py-2 rounded-lg transition duration-200";

  return (
    <div className="w-full h-screen bg-gray-50">
      {/* Logo — clicking takes you to the correct dashboard */}
      <NavLink to={isAdmin ? "/admin-dashboard" : "/user-dashboard"}>
        <img src={logo} alt="logo" className="h-28 object-contain ml-2" />
      </NavLink>

      <ul className="ml-10 space-y-3">
        {/* Dashboard — destination depends on role */}
        <li>
          <NavLink
            to={isAdmin ? "/admin-dashboard" : "/user-dashboard"}
            className={({ isActive }) =>
              `${navItem} ${
                isActive
                  ? "bg-blue-100 border border-blue-600 text-blue-700"
                  : "hover:bg-blue-100 border border-transparent"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <i className="fa-solid fa-clipboard text-blue-700"></i>
                <span>Dashboard</span>
                {isActive && (
                  <span className="ml-auto w-2 h-2 bg-blue-700 rounded-full blink-dot"></span>
                )}
              </>
            )}
          </NavLink>
        </li>

        {/* My Complaint */}
        <li>
          <NavLink
            to="/MyComplaint"
            className={({ isActive }) =>
              `${navItem} ${
                isActive
                  ? "bg-blue-100 border border-blue-600 text-blue-700"
                  : "hover:bg-blue-100 border border-transparent"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <i className="fa-solid fa-book text-red-500"></i>
                <span>MyComplaint</span>
                {isActive && (
                  <span className="ml-auto w-2 h-2 bg-blue-700 rounded-full blink-dot"></span>
                )}
              </>
            )}
          </NavLink>
        </li>

        {/* FAQ — hidden for admins */}
        {!isAdmin && (
          <li>
            <NavLink
              to="/FAQ"
              className={({ isActive }) =>
                `${navItem} ${
                  isActive
                    ? "bg-blue-100 border border-blue-600 text-blue-700"
                    : "hover:bg-blue-100 border border-transparent"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <i className="fa-solid fa-clipboard text-green-500"></i>
                  <span>FAQ</span>
                  {isActive && (
                    <span className="ml-auto w-2 h-2 bg-blue-700 rounded-full blink-dot"></span>
                  )}
                </>
              )}
            </NavLink>
          </li>
        )}

        {/* Profile */}
        <li>
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `${navItem} ${
                isActive
                  ? "bg-blue-100 border border-blue-900 text-blue-400"
                  : "hover:bg-blue-100 border border-transparent"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <i className="fa-solid fa-user text-blue-500"></i>
                <span>Profile</span>
                {isActive && (
                  <span className="ml-auto w-2 h-2 bg-blue-700 rounded-full blink-dot"></span>
                )}
              </>
            )}
          </NavLink>
        </li>

        {/* Admin-only: User Management shortcut */}
        {isAdmin && (
          <li>
            <NavLink
              to="/admin-dashboard"
              className={({ isActive }) =>
                `${navItem} ${
                  isActive
                    ? "bg-purple-100 border border-purple-600 text-purple-700"
                    : "hover:bg-purple-100 border border-transparent"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <i className="fa-solid fa-users-gear text-purple-500"></i>
                  <span>Admin Panel</span>
                  {isActive && (
                    <span className="ml-auto w-2 h-2 bg-purple-700 rounded-full blink-dot"></span>
                  )}
                </>
              )}
            </NavLink>
          </li>
        )}
      </ul>
    </div>
  );
}

export default Navbar;
