import logo from "../../assets/logo.png";
import { NavLink } from "react-router-dom";

function Navbar() {
  const navItem =
    "pt-3 flex items-center gap-2 w-40 px-3 py-2 rounded-lg transition duration-200";

  return (
    <div className="w-full h-screen bg-gray-50">

      {/* Logo */}
      <img src={logo} alt="logo" className="h-28 object-contain ml-2" />

      <ul className="ml-10 space-y-3">

        {/* Dashboard */}
        <li>
          <NavLink
            to="/dashboard"
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
            to="/complaint"
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
                <span>My Complaint</span>

                {isActive && (
                  <span className="ml-auto w-2 h-2 bg-blue-700 rounded-full blink-dot"></span>
                )}
              </>
            )}
          </NavLink>
        </li>

        {/* FAQ */}
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

      </ul>
    </div>
  );
}

export default Navbar;