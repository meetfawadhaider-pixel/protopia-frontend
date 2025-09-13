import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const [token, setToken] = React.useState(() => localStorage.getItem("accessToken"));

  React.useEffect(() => {
    const onAuthChange = () => setToken(localStorage.getItem("accessToken"));
    window.addEventListener("authchange", onAuthChange);
    return () => window.removeEventListener("authchange", onAuthChange);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    window.dispatchEvent(new Event("authchange"));
    navigate("/login");
  };

  return (
    <nav className="bg-indigo-700 text-white px-8 py-4 shadow-lg">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        <Link to="/" className="text-2xl font-bold">Protopia</Link>

        <div className="space-x-6 text-lg flex items-center">
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/services">Services</Link>
          <Link to="/dashboard">Dashboard</Link>
          {!token ? (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          ) : (
            <button onClick={handleLogout} className="text-white hover:text-yellow-300 transition">
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
