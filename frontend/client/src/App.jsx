import { useState } from "react";
import "./App.css";
import AppRoutes from "./routes/AppRoutes.jsx";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [active, setActive] = useState("signup");

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        toastClassName="bg-blue-600 text-white"
        hideProgressBar={false}
      />
      <AppRoutes active={active} setActive={setActive} />;
    </>
  );
}

export default App;
