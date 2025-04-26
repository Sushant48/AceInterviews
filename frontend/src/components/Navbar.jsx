import { NavLink } from "react-router-dom";
import { User, LogIn, Menu, X, ChevronDown } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect, useRef } from "react";

// Improved Logo Component with better contrast
const AceInterviewsLogo = ({ className = "h-10" }) => (
  <svg className={className} viewBox="0 0 300 80" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="100%" stopColor="#E6E6E6" />
      </linearGradient>
      <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.3" />
      </filter>
    </defs>
    
    {/* Improved logo with white/light colors for better contrast */}
    <path d="M40,15 L50,40 L30,40 Z" fill="url(#logoGradient)" filter="url(#shadow)" />
    <circle cx="40" cy="50" r="10" fill="#A26DB1" />
    <path d="M35,50 L38,53 L45,46" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    <text x="70" y="45" fontFamily="Arial, sans-serif" fontSize="24" fontWeight="bold" fill="white">Ace<tspan fill="#E6E6E6">Interviews</tspan></text>
    <text x="70" y="60" fontFamily="Arial, sans-serif" fontSize="10" fill="#E6E6E6">Perfect Your Interview Skills</text>
    <rect x="70" y="48" width="40" height="1" fill="white" opacity="0.7" />
    <rect x="70" y="48" width="170" height="1" fill="#E6E6E6" opacity="0.3" />
  </svg>
);

const Navbar = () => {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  const handleClickOutside = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setDropdownOpen(false);
    }
    if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target) && 
        e.target.id !== 'mobile-menu-button') {
      setMobileMenuOpen(false);
    }
  };

  useEffect(() => {
    if (dropdownOpen || mobileMenuOpen) {
      document.addEventListener("click", handleClickOutside);
    } else {
      document.removeEventListener("click", handleClickOutside);
    }

    return () => document.removeEventListener("click", handleClickOutside);
  }, [dropdownOpen, mobileMenuOpen]);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Dashboard", path: "/dashboard" },
    { name: "Resumes", path: "/resumes" },
    { name: "Interviews", path: "/interviews" },
    { name: "Performance Metrics", path: "/performanceMetrics" },
  ];

  const handleLogout = async () => {
    await logout();
    setDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  return (
    <nav className="bg-gradient-to-r from-[#491B6D] to-[#5d2c83] text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">

          <div className="flex items-center py-3">
            <NavLink to="/" className="flex-shrink-0">
              
              <div className="hidden md:block">
                <AceInterviewsLogo className="h-15 w-auto" />
              </div>
              
              <div className="md:hidden">
                <svg className="h-12 w-auto" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="mobileLogoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#FFFFFF" />
                      <stop offset="100%" stopColor="#E6E6E6" />
                    </linearGradient>
                    <filter id="mobileShadow" x="-20%" y="-20%" width="140%" height="140%">
                      <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.3" />
                    </filter>
                  </defs>
                  <path d="M30,5 L40,30 L20,30 Z" fill="url(#mobileLogoGradient)" filter="url(#mobileShadow)" />
                  <circle cx="30" cy="40" r="10" fill="#A26DB1" />
                  <path d="M25,40 L28,43 L35,36" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                </svg>
              </div>
            </NavLink>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) =>
                  `text-md font-medium transition-all duration-300 ${
                    isActive 
                      ? "text-white border-b-2 border-[#A26DB1] pb-1" 
                      : "text-gray-200 hover:text-white hover:border-b-2 hover:border-[#A26DB1] hover:pb-1"
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </div>

          {/* User Profile / Login Button */}
          <div className="flex items-center gap-4">
            {user ? (
              <div ref={dropdownRef} className="relative">
                <div 
                  onClick={toggleDropdown}
                  className="flex items-center cursor-pointer"
                >
                  {user?.profilePic ? (
                    <div className="flex items-center gap-2">
                      <img
                        src={user.profilePic}
                        alt="Profile"
                        className="w-8 h-8 rounded-full border-2 border-[#A26DB1] object-cover"
                      />
                      <span className="hidden sm:block text-sm font-medium">{user.username}</span>
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 bg-[#A26DB1]/30 hover:bg-[#A26DB1]/50 transition-colors duration-300 py-1 px-3 rounded-full">
                      <User className="w-5 h-5" />
                      <span className="hidden sm:block text-sm font-medium">{user.username}</span>
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  )}
                </div>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white text-[#4B4B4B] rounded-lg shadow-lg border border-[#E6E6E6] z-50 overflow-hidden">
                    <div className="p-3 border-b border-[#E6E6E6] bg-gradient-to-r from-[#fcf9fe] to-white">
                      <p className="font-medium text-[#491B6D]">{user?.name || user?.username}</p>
                      <p className="text-xs text-[#4B4B4B] truncate">{user?.email}</p>
                    </div>
                    <div className="py-1">
                      <NavLink
                        to="/profile"
                        className="block px-4 py-2 hover:bg-[#fcf9fe] text-sm transition-colors duration-200"
                        onClick={() => setDropdownOpen(false)}
                      >
                        View & Update Details
                      </NavLink>
                      <NavLink
                        to="/profile-picture"
                        className="block px-4 py-2 hover:bg-[#fcf9fe] text-sm transition-colors duration-200"
                        onClick={() => setDropdownOpen(false)}
                      >
                        Upload/Change Picture
                      </NavLink>
                      <NavLink
                        to="/change-password"
                        className="block px-4 py-2 hover:bg-[#fcf9fe] text-sm transition-colors duration-200"
                        onClick={() => setDropdownOpen(false)}
                      >
                        Change Password
                      </NavLink>
                    </div>
                    <div className="border-t border-[#E6E6E6]">
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-medium transition-colors duration-200"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <NavLink
                to="/login"
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg font-medium transition-all duration-300"
              >
                <LogIn className="w-4 h-4" />
                <span className="hidden sm:block">Login</span>
              </NavLink>
            )}

            <button
              id="mobile-menu-button"
              onClick={toggleMobileMenu}
              className="md:hidden text-white p-1 rounded-md hover:bg-[#A26DB1]/20 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div 
          ref={mobileMenuRef}
          className="md:hidden bg-[#491B6D]/95 backdrop-blur-sm shadow-lg border-t border-[#A26DB1]/20"
        >
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-md text-base font-medium ${
                    isActive
                      ? "bg-[#A26DB1]/30 text-white"
                      : "text-gray-200 hover:bg-[#A26DB1]/20 hover:text-white"
                  }`
                }
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.name}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;