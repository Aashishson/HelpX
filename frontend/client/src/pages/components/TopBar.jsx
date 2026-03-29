import { FaBars } from "react-icons/fa";

function Topbar({ toggleSidebar }) {
  return (
    <div className="flex items-center h-14 px-4 bg-gray-50 shadow gap-4">

      {/* Menu Icon */}
      <button
        onClick={toggleSidebar}
        className="text-xl"
      >
        <FaBars />
      </button>

      {/* Search */}
      <input
        type="text"
        placeholder="Search your complaint"
        className="w-full max-w-md h-10 rounded-lg border border-gray-300 px-3 outline-none"
      />

      {/* Icons */}
      <div className="flex items-center ml-auto space-x-5">
        <i className="fa-solid fa-bell"></i>
        <i className="fa-solid fa-gear"></i>
      </div>

    </div>
  );
}

export default Topbar;