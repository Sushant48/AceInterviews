import { NavLink } from 'react-router-dom';
import { User, LogOut, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  
  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Resumes', path: '/resumes' },
    { name: 'Interviews', path: '/interviews' },
    { name: 'Performance Metrics', path: '/performanceMetrics' },
  ];

  return (
    <nav className="bg-[#491B6D] text-white p-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold">AceInterviews</h1>
      <div className="flex gap-8">
        {navLinks.map((link) => (
          <NavLink
            key={link.name}
            to={link.path}
            className={({ isActive }) =>
              `text-lg ${isActive ? 'font-bold underline' : 'hover:opacity-80'}`
            }
          >
            {link.name}
          </NavLink>
        ))}
      </div>
      <div className="flex gap-4">
        {user ? (
          <>
            <User className="w-6 h-6 cursor-pointer" title={user.username} />
            <LogOut className="w-6 h-6 cursor-pointer" onClick={logout} title="Logout" />
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