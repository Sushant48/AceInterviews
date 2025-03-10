import { NavLink } from 'react-router-dom';
import { User, LogOut } from 'lucide-react';

const Navbar = () => {
  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Resumes', path: '/resumes' },
    { name: 'Interviews', path: '/interviews' },
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
        <User className="w-6 h-6 cursor-pointer" />
        <LogOut className="w-6 h-6 cursor-pointer" />
      </div>
    </nav>
  );
};

export default Navbar;
