import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(
    Boolean(localStorage.getItem("token"))
  );

  useEffect(() => {
    function handleAuthChange() {
      setIsLoggedIn(Boolean(localStorage.getItem("token")));
    }

    window.addEventListener("authChange", handleAuthChange);

    return () => {
      window.removeEventListener("authChange", handleAuthChange);
    };
  }, []);

  function handleLogout() {
    localStorage.removeItem("token");
    window.dispatchEvent(new Event("authChange"));
    navigate("/login");
  }

  return (
    <nav className="border-b bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <Link to="/" className="text-xl font-bold">
          🍐 PearsMatch
        </Link>

        <div className="flex items-center gap-4 text-sm">
          {isLoggedIn ? (
            <>
              <Link to="/dashboard">Dashboard</Link>
              <Link to="/profile">Profile</Link>
              <Link to="/skills">Skills</Link>
              <Link to="/matches">Matches</Link>
              <Link to="/connections">Connections</Link>
              <button onClick={handleLogout} className="font-medium">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link
                to="/register"
                className="rounded-lg bg-green-600 px-4 py-2 text-white"
              >
                Get started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}