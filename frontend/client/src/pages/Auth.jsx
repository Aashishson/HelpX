import { useState } from "react";
import Slider from "./components/Slider";
import Login from "./login";
import Signup from "./SignUp";

function AuthPage() {
  const [active, setActive] = useState("login");

  return (
    <>
      <Slider active={active} setActive={setActive} />

      {active === "login" ? (
        <Login setActive={setActive} />
      ) : (
        <Signup setActive={setActive} />
      )}
    </>
  );
}

export default AuthPage;
