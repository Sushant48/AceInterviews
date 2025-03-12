import { NavLink } from "react-router-dom";
import { User, LogIn } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect, useRef} from "react";

const Navbar = () => {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);


  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const handleClickOutside = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    if (dropdownOpen) {
      document.addEventListener("click", handleClickOutside);
    } else {
      document.removeEventListener("click", handleClickOutside);
    }

    return () => document.removeEventListener("click", handleClickOutside);
  }, [dropdownOpen]);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Dashboard", path: "/dashboard" },
    { name: "Resumes", path: "/resumes" },
    { name: "Interviews", path: "/interviews" },
    { name: "Performance Metrics", path: "/performanceMetrics" },
  ];

  const handleLogout = async () => {
    await logout();
  };

  return (
    <nav className="bg-[#491B6D] text-white p-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold">AceInterviews</h1>
      <div className="flex gap-8">
        {navLinks.map((link) => (
          <NavLink
            key={link.name}
            to={link.path}
            className={({ isActive }) =>
              `text-lg ${isActive ? "font-bold underline" : "hover:opacity-80"}`
            }
          >
            {link.name}
          </NavLink>
        ))}
      </div>
      <div ref={dropdownRef} className="flex gap-4">
        {user ? (
          <>
            {user?.profilePic ? (
              <img
                src={user.profilePic}
                alt="Profile"
                className="w-10 h-10 rounded-full cursor-pointer"
                onClick={toggleDropdown}
              />
            ) : (
              <User
                className="w-6 h-6 cursor-pointer"
                title={user.username}
                onClick={toggleDropdown}
              />
            )}

            {dropdownOpen && (
              <div className="absolute right-2 mt-7 w-48 bg-white text-black rounded-lg shadow-lg">
                <div className="p-2 border-b">{user?.name}</div>
                <NavLink
                  to="/profile"
                  className="block px-4 py-2 hover:bg-gray-100"
                  onClick={toggleDropdown}
                >
                  View & Update Details
                </NavLink>
                <NavLink
                  to="/profile-picture"
                  className="block px-4 py-2 hover:bg-gray-100"
                  onClick={toggleDropdown}
                >
                  Upload/Change Picture
                </NavLink>
                <NavLink
                  to="/change-password"
                  className="block px-4 py-2 hover:bg-gray-100"
                  onClick={toggleDropdown}
                >
                  Change Password
                </NavLink>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </>
        ) : (
          <NavLink to="/login">
            <LogIn className="w-6 h-6 cursor-pointer" title="Login" />
          </NavLink>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
