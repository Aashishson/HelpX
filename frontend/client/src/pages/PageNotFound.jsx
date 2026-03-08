import { Link } from "react-router-dom";

function PageNotFound() {
  return (
    <div className="h-screen w-full flex items-center justify-center bg-linear-to-r from-blue-600 to-blue-400">
      <div className="bg-white p-10 rounded-xl shadow-xl text-center max-w-md">
        <h1 className="text-7xl font-bold text-blue-500">404</h1>

        <h2 className="text-2xl font-semibold mt-2 text-gray-800">
          Page Not Found
        </h2>

        <p className="text-gray-500 mt-3">
          The page you are looking for might have been removed or does not
          exist.
        </p>

        <Link
          to="/"
          className="inline-block mt-6 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Go Back Home
        </Link>
      </div>
    </div>
  );
}

export default PageNotFound;
